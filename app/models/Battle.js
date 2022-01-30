class Battle {
  constructor(battleId, armies) {
    this.battleId = battleId;
    this.armies = armies.sort(() => 0.5 - Math.random());
  }

  startBattle() {
    this.armies.forEach((army) => {
      army.fight(this.armies);
    });
  }
}

module.exports = {
  Battle,
};
