const { pgPool, sql } = require('../../config/database-connection');
const { initializeBattle } = require('../../lib/initialize-battle');

module.exports.startBattle = async (req, res) => {
  const { battleId } = req.params;

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

  battle.armies = armies;

  initializeBattle(battle);

  return res.status(200).send({
    message: 'Successfully started battle',
  });
};
