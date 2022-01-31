/* eslint-disable no-console */
const path = require('path');
const { exec } = require('child_process');
const { PG_CONNECTION_STRING } = require('../app/config/environments');

const databaseName = PG_CONNECTION_STRING.split('/').slice(-1)[0];

const databaseInitialization = path.join(__dirname, './database-initialization.sql');
const pathToSQLScripts = path.join(__dirname, '../');

exec(`
  psql ${databaseName} -c "DROP SCHEMA public CASCADE;"
  psql postgres -f ${databaseInitialization} -v v1=${databaseName} -v v2=${pathToSQLScripts}`, (error) => {
  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }
  console.error('Successfully initialized database');
  process.exit(0);
});
