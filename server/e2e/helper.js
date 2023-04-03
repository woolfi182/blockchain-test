const assert = require("assert");

const FORMAT_REGEXP = {
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/,
  uuid4:
    /^[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}$/,
  smallId: /^[a-zA-Z0-9]{32}$/,
  // example, 2022-01-28T17:47:12.900Z
  date: /^20[0-2][0-9]-[01][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\.[0-9]{3}Z/,
  url: /^((http(s)?|ftp|ws|ssh):\/\/)?((([a-zA-Z0-9_-]+\.){1,}[a-zA-Z0-9]{2,8})|localhost)(:[0-9]{2,4})?((\/[\w\d_-]+){1,})?(\?([\w\d_-]+(=|(=[^&=]+))?)?(&[\w\d_-]+(=|(=[^&=]+))?)*)?$/,
};

exports.isValidJson = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

const checkCondition = (data, type, condition) => {
  switch (type) {
    case "type": {
      const errorMessage = `Element ${JSON.stringify(
        data
      )} type is not correct: "${typeof data}" should be "${condition}"`;
      condition === "array"
        ? assert.ok(Array.isArray(data), errorMessage)
        : assert.equal(typeof data, condition, errorMessage);
      break;
    }
    case "regExp": {
      const regExp = new RegExp(condition);
      assert.match(
        data,
        regExp,
        `Value ${JSON.stringify(data)} is not passed RegExp ${condition}`
      );
      break;
    }
    case "value": {
      assert.equal(
        data,
        condition,
        `Value ${JSON.stringify(data)} is not as expected "${condition}"`
      );
      break;
    }
    case "format": {
      const regExp = FORMAT_REGEXP[condition];

      if (!regExp) {
        throw new Error(
          "Condition type is not correct and could not be processed"
        );
      }

      assert.match(
        data,
        regExp,
        `Value ${JSON.stringify(data)} is not passed format RegExp ${regExp}`
      );
      break;
    }
    case "oneOf": {
      assert.ok(
        condition.includes(data),
        `Value "${data}" is not one of [${condition}]`
      );
      break;
    }
    case "min": {
      assert.ok(
        data > condition,
        `Value ${data} should be greater than ${condition}`
      );
      break;
    }
    case "minOrEq": {
      assert.ok(
        data >= condition,
        `Value ${data} should be greater or equal than ${condition}`
      );
      break;
    }
    case "max": {
      assert.ok(
        data < condition,
        `Value ${data} should be less than ${condition}`
      );
      break;
    }
    case "maxOrEq": {
      assert.ok(
        data <= condition,
        `Value ${data} should be less or equal than ${condition}`
      );
      break;
    }
    case "items": {
      data.forEach((element) => {
        Object.entries(condition).forEach(([newType, newCondition]) => {
          checkCondition(element, newType, newCondition);
        });
      });
      break;
    }
    case "properties": {
      const internalConditions = condition;
      internalConditions.forEach((objConditions) => {
        const newData = data[objConditions.name];
        Object.entries(objConditions).forEach(([newType, newCondition]) => {
          // We use this property for getting an element (it's done above)
          if (newType === "name") return;
          checkCondition(newData, newType, newCondition);
        });
      });
      break;
    }
    default: {
      throw new Error(
        "Condition type is not correct and could not be processed"
      );
    }
  }
};
exports.checkCondition = checkCondition;
