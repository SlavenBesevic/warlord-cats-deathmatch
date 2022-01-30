const path = require('path');

const envPath = path.join(process.cwd(), `.env.${process.env.NODE_ENV}`);
require('dotenv').config({ path: envPath });

/*
 * Project wide environment variables
 * If a new environment variable is added to the project,
 * add it to the respective .env file and to the object below.
 */
const environmentVariables = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PG_CONNECTION_STRING: process.env.PG_CONNECTION_STRING,
};

/**
 * Returns Project environment variables based on NODE_ENV
 * @returns {Object}
 */
const getEnvVariables = () => {
  if (!environmentVariables.NODE_ENV) {
    throw new Error('Missing NODE_ENV environment variable');
  }
  return {
    NODE_ENV: environmentVariables.NODE_ENV,
    PORT: environmentVariables.PORT,
    PG_CONNECTION_STRING: environmentVariables.PG_CONNECTION_STRING,
  };
};

// Check for missing environment variables
Object
  .entries(getEnvVariables())
  .forEach(([key, value]) => {
    if (!value) throw new Error(`Missing ${key} environment variable`);
  });

module.exports = getEnvVariables();
