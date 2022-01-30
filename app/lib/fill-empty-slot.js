const { randomIntBetween } = require('./misc');
const { addArmy, addBattle } = require('../helpers');
const { initializeBattle } = require('./initialize-battle');

const fillEmptySlot = async () => {
  const [battle] = await addBattle();

  await Promise.all(
    new Array(randomIntBetween(3, 300)).fill().map(() => addArmy({ battleId: battle.battleId })),
  );

  initializeBattle(battle.battleId);
};

module.exports = {
  fillEmptySlot,
};
