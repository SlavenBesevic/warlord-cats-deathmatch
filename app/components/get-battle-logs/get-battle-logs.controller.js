const { pgPool, sql } = require('../../config/database-connection');

module.exports.getBattleLogs = async (req, res) => {
  const { battleId } = req.params;

  const results = await pgPool(sql`
    SELECT
      *
    FROM
      battle_logs
    WHERE
      "battleId" = ${battleId}
    ORDER BY
      "createdAt";`);

  return res.status(200).send({
    message: 'Successfully got a list of battle logs',
    results,
  });
};
