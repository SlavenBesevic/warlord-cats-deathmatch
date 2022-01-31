const { addManyArmies, addBattle } = require('../helpers');
const { initializeBattle } = require('./initialize-battle');

const fillEmptySlot = async () => {
  const [battle] = await addBattle();

  const armies = await addManyArmies({ battleId: battle.battleId });

  battle.armies = armies;

  initializeBattle(battle);
};

module.exports = {
  fillEmptySlot,
};
