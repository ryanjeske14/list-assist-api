const { expect } = require("chai");
const supertest = require("supertest");

require("dotenv").config();

process.env.TEST_DB_URL =
  process.env.TEST_DB_URL ||
  `postgresql://ryanj:${
    process.env.MIGRATION_DB_PASS
  }@localhost/list-assist-test`;

global.expect = expect;
global.supertest = supertest;
