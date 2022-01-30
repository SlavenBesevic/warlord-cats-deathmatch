const { v4: uuidv4 } = require('uuid');
const { pgPool, sql } = require('../../config/database-connection');

module.exports.createBattle = async (req, res) => {
  const battleId = uuidv4();
  const { name = battleId } = req.body;

  await pgPool(sql`
    INSERT INTO battles (
      "battleId",
      "name")
    VALUES (
      ${battleId},
      ${name}
    )
    RETURNING *;`);

  return res.status(200).send({
    message: 'Successfully created battle',
  });
};
