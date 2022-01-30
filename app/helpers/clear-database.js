/* eslint-disable no-undef */
const path = require('path');
const { exec } = require('child_process');
const { PG_CONNECTION_STRING } = require('../config/environments');

const databaseName = PG_CONNECTION_STRING.split('/').slice(-1)[0];

const databaseInitialization = path.join(__dirname, '../../db/database-initialization.sql');
const pathToSQLScripts = path.join(__dirname, '../..');
const clearDatabase = path.join(__dirname, './clear-database.sql');

before((done) => {
  exec(`
    psql ${databaseName} -c "DROP SCHEMA public CASCADE;"
    psql postgres -f ${databaseInitialization} -v v1=${databaseName} -v v2=${pathToSQLScripts}
    psql ${databaseName} -f ${clearDatabase}`, (error) => {
    if (error) {
      console.error(`Errors in tests before hook: ${error}`);
      process.exit(1);
    }
    done();
  });
});

after((done) => {
  exec(`psql ${databaseName} -c "DROP SCHEMA public CASCADE;"`, (error) => {
    if (error) {
      console.error(`Errors in tests after hook: ${error}`);
      process.exit(1);
    }
    done();
  });
});
