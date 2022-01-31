const { pgPool, sql } = require('../config/database-connection');
const { Army, Battle } = require('../models');
const { errorLogger } = require('../middlewares/errors/error-logger');

module.exports.initializeBattle = async (battle) => {
  try {
    const dbBattle = await pgPool(sql`
      UPDATE
        battles
      SET
        "status" = 'In progress'
      WHERE
        "battleId" = ${battle.battleId}
      RETURNING
        "battleId"`);

    if (dbBattle) {
      const initArmies = battle.armies.map((army) => new Army(
        army.armyId,
        battle.battleId,
        army.name,
        army.units,
        army.strategy,
      ));

      const initBattle = new Battle(battle.battleId, initArmies);
      initBattle.startBattle();
    }
  } catch (err) {
    errorLogger(err);
  }
};
