/* eslint-disable import/no-extraneous-dependencies */
const {
  setWorldConstructor,
  setDefaultTimeout,
  World,
} = require("@cucumber/cucumber");
const axios = require("axios");
require("dotenv").config();

const {
  API_PORT,
  API_KEY,
  TEST_CASE_TIMEOUT,
  TEST_RECIPIENT_ADDRESS,
  TEST_SENDER_ADDRESS,
} = process.env;
const DEFAULT_TIMEOUT = TEST_CASE_TIMEOUT * 1000;

const baseUrl = `http://localhost:${API_PORT}`;
class CustomWorld extends World {
  constructor(opts) {
    super(opts);
    this.response = {};
    this.headers = {};
    this.recipientAddress = TEST_RECIPIENT_ADDRESS;
    this.senderAddress = TEST_SENDER_ADDRESS;
  }

  async createReqClient() {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: DEFAULT_TIMEOUT,
    });
  }

  async addAuthHeader() {
    this.headers = {
      "x-api-key": API_KEY,
    };
  }

  async makeRequest(data) {
    try {
      /* eslint-disable-next-line no-param-reassign */
      data.headers = {
        ...data.headers,
        ...this.headers,
      };
      this.response = await this.client.request(data);
    } catch (error) {
      if (error.response) {
        this.response = error.response;
        return;
      }

      const errorMessage = `
Failed request to path ${data.url}
Request:
${JSON.stringify(error.config)}
`;
      this.response = {
        data: {
          status: 0,
          errorMessage,
        },
      };
    }
  }
}

setDefaultTimeout(DEFAULT_TIMEOUT);
setWorldConstructor(CustomWorld);
