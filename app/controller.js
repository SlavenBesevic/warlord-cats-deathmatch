const { createBattle } = require('./components/create-battle/create-battle.controller');
const { listBattles } = require('./components/list-battles/list-battles.controller');
const { createArmy } = require('./components/create-army/create-army.controller');
const { startBattle } = require('./components/start-battle/start-battle.controller');
const { getBattleLogs } = require('./components/get-battle-logs/get-battle-logs.controller');

module.exports = {
  createBattle,
  listBattles,
  createArmy,
  startBattle,
  getBattleLogs,
};
