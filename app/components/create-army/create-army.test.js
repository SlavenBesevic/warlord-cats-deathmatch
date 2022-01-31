/* eslint-disable no-undef */
const faker = require('faker');
const request = require('supertest');
const should = require('chai').should();
const app = require('../../../server');
const { pgPool, sql } = require('../../config/database-connection');
const { sample } = require('../../lib/misc');
const { addBattle, armyStrategy } = require('../../helpers');

describe('Create army', () => {
  let createdBattle;

  before(async () => {
    await pgPool(sql`CALL delete_everything_from_all_tables();`);

    [createdBattle] = await addBattle();
  });

  it('POST /battles/:battleId/armies Should successfully create battle', async () => {
    const body = {
      name: faker.name.firstName(),
      units: faker.datatype.number({ min: 80, max: 100 }),
      strategy: sample(armyStrategy),
    };
    const { body: { message, results } } = await request(app)
      .post(`/api/v1/battles/${createdBattle.battleId}/armies`)
      .set('Accept', 'application/json')
      .send(body)
      .expect(200);

    message.should.equal('Successfully created army');
    should.exist(results.armyId);

    const [dbArmy] = await pgPool(sql`
      SELECT *
      FROM armies
      WHERE "armyId" = ${results.armyId};`);

    should.exist(dbArmy.armyId);
    dbArmy.battleId.should.equal(createdBattle.battleId);
    dbArmy.name.should.equal(body.name);
    dbArmy.units.should.equal(body.units);
    dbArmy.strategy.should.equal(body.strategy);
    should.exist(dbArmy.createdAt);
    should.exist(dbArmy.updatedAt);
  });
});
