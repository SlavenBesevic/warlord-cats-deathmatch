const { v4: uuidv4 } = require('uuid');
const { pgPool, sql } = require('../../config/database-connection');

module.exports.createArmy = async (req, res) => {
  const armyId = uuidv4();
  const { battleId } = req.params;
  const { name, units, strategy } = req.body;

  await pgPool(sql`
    INSERT INTO armies (
      "armyId",
      "battleId",
      "name",
      "units",
      "strategy")
    VALUES (
      ${armyId},
      ${battleId},
      ${name},
      ${units},
      ${strategy});`);

  return res.status(200).send({
    message: 'Successfully created army',
    results: { armyId },
  });
};
