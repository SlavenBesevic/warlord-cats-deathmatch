const { v4: uuidv4 } = require('uuid');
const faker = require('faker');
const { pgPool, sql } = require('../config/database-connection');
const { sample } = require('../lib/misc');
const { armyStrategy } = require('./enum-helper');

/**
 * @param {String} armyId Army ID
 * @param {String} name Army name
 * @returns {Promise} returns new Army
 */
module.exports.addArmy = ({
  armyId = uuidv4(),
  battleId = uuidv4(),
  name = faker.name.lastName(),
  units = faker.datatype.number({ min: 80, max: 100 }),
  strategy = sample(armyStrategy),
} = {}) => pgPool(sql`
  INSERT INTO armies (
    "armyId",
    "battleId",
    "name",
    "units",
    "strategy")
  VALUES (
    ${armyId},
    ${battleId},
    ${name},
    ${units},
    ${strategy})
  RETURNING *;`);
