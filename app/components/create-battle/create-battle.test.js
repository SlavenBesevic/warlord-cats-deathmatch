/* eslint-disable no-undef */
const faker = require('faker');
const request = require('supertest');
const should = require('chai').should();
const app = require('../../../server');
const { pgPool, sql } = require('../../config/database-connection');

describe('Create battle', () => {
  before(async () => {
    await pgPool(sql`CALL delete_everything_from_all_tables();`);
  });

  it('POST /battles Should successfully create battle', async () => {
    const body = {
      name: faker.name.firstName(),
    };
    const { body: { message } } = await request(app)
      .post('/api/v1/battles')
      .set('Accept', 'application/json')
      .send(body)
      .expect(200);

    message.should.equal('Successfully created battle');

    const [dbBattle] = await pgPool(sql`
      SELECT *
      FROM battles;`);

    should.exist(dbBattle.battleId);
    dbBattle.name.should.equal(body.name);
    dbBattle.status.should.equal('Pending');
    should.exist(dbBattle.createdAt);
    should.exist(dbBattle.updatedAt);
  });
});
