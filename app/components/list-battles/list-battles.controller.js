const { pgPool, sql } = require('../../config/database-connection');

module.exports.listBattles = async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  const [{ results, count }] = await pgPool(sql`
    SELECT
      COUNT(*)::INT AS "count",
      COALESCE(jsonb_agg(row_to_json(battles)), '[]')::jsonb AS "results"
    FROM
      battles
    LIMIT
      ${limit}
    OFFSET
      ${offset};`);

  return res.status(200).send({
    message: 'Successfully got a list of battles',
    results,
    count,
  });
};
