const { v4: uuidv4 } = require('uuid');
const faker = require('faker');
const { pgPool, sql } = require('../config/database-connection');

/**
 * @param {String} battleId Battle ID
 * @param {String} name Battle name
 * @returns {Promise} returns new Battle
 */
module.exports.addBattle = ({
  battleId = uuidv4(),
  name = faker.name.lastName(),
} = {}) => pgPool(sql`
  INSERT INTO battles (
    "battleId",
    "name")
  VALUES (
    ${battleId},
    ${name})
  RETURNING *;`);
