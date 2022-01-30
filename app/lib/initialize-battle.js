const { pgPool, sql } = require('../config/database-connection');
const { HTTPError, errorConstants } = require('../middlewares/errors/http-errors');
const { Army, Battle } = require('../models');

module.exports.initializeBattle = async (battleId) => {
  const [[battle], armies] = await Promise.all([
    pgPool(sql`
      UPDATE
        battles
      SET
        "status" = 'In progress'
      WHERE
        "battleId" = ${battleId}
      RETURNING
        "battleId";`),
    pgPool(sql`
      SELECT
        *
      FROM
        armies
      WHERE
        "battleId" = ${battleId};`),
  ]);

  if (!battle) throw new HTTPError(errorConstants.NOT_FOUND);

  const initArmies = armies.map((army) => new Army(
    army.armyId,
    battle.battleId,
    army.name,
    army.units,
    army.strategy,
  ));

  const initBattle = new Battle(battle.battleId, initArmies);
  initBattle.startBattle();
};
