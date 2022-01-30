/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../../server');
const { pgPool, sql } = require('../../config/database-connection');
const { addBattle } = require('../../helpers');

describe('List battles', () => {
  before(async () => {
    await pgPool(sql`CALL delete_everything_from_all_tables();`);

    await Promise.all([
      addBattle(),
      addBattle(),
      addBattle(),
    ]);
  });

  it('GET /battles Should successfully get a list of battles', async () => {
    const { body: { message, results, count } } = await request(app)
      .get('/api/v1/battles')
      .set('Accept', 'application/json')
      .expect(200);

    message.should.equal('Successfully got a list of battles');
    results.length.should.equal(3);
    count.should.equal(3);
  });
});
