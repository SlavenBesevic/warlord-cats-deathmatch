const { battleStatus, armyStrategy } = require('./enum-helper');
const { addBattle } = require('./battle-helper');
const { addArmy, addManyArmies } = require('./army-helper');

module.exports = {
  battleStatus,
  armyStrategy,
  addBattle,
  addArmy,
  addManyArmies,
};
