/* eslint-disable import/no-extraneous-dependencies */
const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const { checkCondition, isValidJson } = require("./helper");

const GENERICS = ["__ANY__"];
const isValueGeneric = (val) => ["NUMBER"].includes(val);

const includesGeneric = (val) =>
  typeof val === "string" && GENERICS.some((gen) => val.includes(gen));

const getGeneric = (val) => GENERICS.find((gen) => val.includes(gen));

// GIVEN
Given("server is running", async function () {
  await this.createReqClient();
});

Given("user is not authorized", () => {});

Given("user is authorized with {}", function (authToken) {
  this.headers = {
    ...this.headers,
    "x-api-token": authToken,
  };
});

Given("user is authorized", function () {
  this.addAuthHeader();
});

// WHEN
When("make {word} request to: {}", async function (method, url) {
  await this.makeRequest({
    method,
    url,
  });
});

When("request {word} to {} without body", async function (method, path) {
  if (/\{/.test(path)) {
    const keys = (path.match(/\{(\w+)\}/g) || []).map((el) => ({
      key: el,
      val: this[el.replace(/\{|\}/g, "")],
    }));

    keys.forEach((el) => {
      path = path.replace(el.key, el.val); // eslint-disable-line no-param-reassign
    });
  }

  const data = {
    method,
    url: path,
  };

  if (["POST", "PUT", "PATCH"].includes(method)) {
    data.headers = {
      "Content-Type": "application/json",
    };
  }

  await this.makeRequest(data);
});

// THEN
Then("response status: {int}", function (status) {
  if (this.response.data && this.response.data.errorMessage) {
    throw new Error(this.response.data.errorMessage);
  }
  const statusMsg = `Response status ${this.response.status} is not correct. Expected ${status}`;
  assert.equal(this.response.status, status, statusMsg);
});

Then("response body: {}", function (message) {
  const responseMsg = (data) =>
    `Response message is not correct. Response is ${JSON.stringify(data)}`;

  if (this.response.config.method === "head") {
    return true;
  }
  const msgData = JSON.parse(message);
  Object.entries(msgData).forEach(([key, val]) => {
    const resVal = this.response.data[key];
    if (isValueGeneric(val)) {
      const valStr = val.toLowerCase();
      assert.equal(typeof resVal, valStr, responseMsg(this.response.data));
    } else if (includesGeneric(val)) {
      const generic = getGeneric(val);
      const potentialMessage = val
        .replace(generic, ".+")
        .replace(/[()\[\]]/g, (e) => `\\${e}`);
      const regex = new RegExp(`^${potentialMessage}$`);
      assert.match(resVal, regex, responseMsg(this.response.data));
    } else {
      assert.equal(resVal, val, responseMsg(this.response.data));
    }
  });
});

Then("standard response body", function () {
  this.body = this.response.data;
  assert.equal(
    this.body.success,
    true,
    `Incorrect body.success -> "${
      this.body.success
    }" should be "true". Response is ${JSON.stringify(this.body)}`
  );
  assert.equal(
    typeof this.body.data,
    "object",
    `Incorrect type of body.data. Response is ${JSON.stringify(this.body)}`
  );
});

Then(
  `key in data is called "{word}" with a type of "{word}"`,
  function (key, type) {
    this.dataVal = this.body.data[key];
    this.dataKey = key;
    assert.notEqual(
      this.dataVal,
      undefined,
      `body.data.${key} should not be undefined. Response is ${JSON.stringify(
        this.body
      )}`
    );
    const errorMessage = `Incorrect type of body.data.${key} -> "${typeof this
      .dataVal}" should be "${type}". Response is ${JSON.stringify(this.body)}`;
    if (type === "array") {
      assert.ok(Array.isArray(this.dataVal), errorMessage);
    } else {
      assert.equal(typeof this.dataVal, type, errorMessage);
    }
  }
);

Then(`each element should be a type of "{word}"`, function (type) {
  const errorMessage = (val) =>
    `Incorrect type of elements in body.data.${
      this.dataKey
    } -> "${typeof val}" should be "${type}". Response is ${JSON.stringify(
      this.body
    )}`;
  this.dataVal.forEach((val) => {
    if (type === "array") {
      assert.ok(Array.isArray(val), errorMessage(val));
    } else {
      assert.equal(typeof val, type, errorMessage(val));
    }
  });
});

Then(`element has property "{word}": {}`, function (property, conditionsRaw) {
  const conditions = JSON.parse(conditionsRaw);

  const workWithSingle = (val) => {
    assert.notEqual(
      val[property],
      undefined,
      `Value of ${property} is not exist in ${JSON.stringify(val)}`
    );

    const data = val[property];

    Object.entries(conditions).forEach(([type, condition]) => {
      checkCondition(data, type, condition);
    });
  };

  // Main logic divided as value could be an array too
  Array.isArray(this.dataVal)
    ? this.dataVal.forEach(workWithSingle)
    : workWithSingle(this.dataVal);
});
