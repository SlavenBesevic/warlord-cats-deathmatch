const { initializeBattle } = require('../../lib/initialize-battle');

module.exports.startBattle = async (req, res) => {
  const { battleId } = req.params;

  initializeBattle(battleId);

  return res.status(200).send({
    message: 'Successfully started battle',
  });
};
