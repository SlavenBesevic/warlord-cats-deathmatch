/* eslint-disable no-undef */
const request = require('supertest');
const should = require('chai').should();
const app = require('../../../server');
const { pgPool, sql } = require('../../config/database-connection');
const { addBattle, addArmy } = require('../../helpers');

describe('Start battle', () => {
  let createdBattle;

  before(async () => {
    await pgPool(sql`CALL delete_everything_from_all_tables();`);

    [createdBattle] = await addBattle();

    await Promise.all([
      addArmy({ battleId: createdBattle.battleId }),
      addArmy({ battleId: createdBattle.battleId }),
      addArmy({ battleId: createdBattle.battleId }),
      addArmy({ battleId: createdBattle.battleId }),
    ]);
  });

  it('GET /battles/:battleId/start Should successfully start battle', async () => {
    const { body: { message } } = await request(app)
      .get(`/api/v1/battles/${createdBattle.battleId}/start`)
      .set('Accept', 'application/json')
      .expect(200);

    message.should.equal('Successfully started battle');

    const [dbBattle] = await pgPool(sql`
      SELECT *
      FROM battles;`);

    should.exist(dbBattle.battleId);
    dbBattle.name.should.equal(createdBattle.name);
    dbBattle.status.should.equal('In progress');
    should.exist(dbBattle.createdAt);
    should.exist(dbBattle.updatedAt);
  });
});
