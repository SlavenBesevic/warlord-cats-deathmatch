/* eslint-disable no-undef */
const request = require('supertest');
const should = require('chai').should();
const app = require('../../../server');
const { pgPool, sql } = require('../../config/database-connection');
const { addBattle, addArmy } = require('../../helpers');

describe('Get battle logs', () => {
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

    await pgPool(sql`
      UPDATE battles
      SET "status" = 'In progress'
      WHERE "battleId" = ${createdBattle.battleId};`);
  });

  it('GET /battles/:battleId/logs Should successfully get a list of battle logs', async () => {
    const { body: { message, results } } = await request(app)
      .get(`/api/v1/battles/${createdBattle.battleId}/logs`)
      .set('Accept', 'application/json')
      .expect(200);

    message.should.equal('Successfully got a list of battle logs');
    results.should.have.lengthOf.above(0);
    results[0].battleId.should.equal(createdBattle.battleId);
    results[0].event.should.equal('Started');
  });
});
