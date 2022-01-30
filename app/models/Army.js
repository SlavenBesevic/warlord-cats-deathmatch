const { pgPool, sql } = require('../config/database-connection');
const { sample } = require('../lib/misc');

const DAMAGE_RATE = 0.5; // 0.5
const RELOAD_TIME_RATE = 0.01 * 1000; // 0.01 * 1000
const MINIMUM_SUCCESS_CHANCE = 10; // 10

class Army {
  constructor(armyId, battleId, name, units, strategy) {
    this.armyId = armyId;
    this.battleId = battleId;
    this.name = name;
    this.units = units;
    this.strategy = strategy;
    this.successChance = this.units;
    this.damage = units * DAMAGE_RATE;
    this.reloadTime = units * RELOAD_TIME_RATE;
  }

  setUnits(recievedDamage) {
    this.units -= Math.floor(recievedDamage);

    const logDetails = {
      army: {
        armyId: this.armyId,
        name: this.name,
      },
      damage: recievedDamage,
      units: this.units > 0 ? this.units : 0,
    };

    this.createLog('Damaged', logDetails);

    if (this.units < 1) this.eliminateArmy();

    this.setSuccessChance();
    this.setDamage();
    this.setReloadTime();
  }

  eliminateArmy() {
    const logDetails = {
      army: {
        armyId: this.armyId,
        name: this.name,
      },
    };

    this.createLog('Eliminated', logDetails);
  }

  setSuccessChance() {
    if (this.units >= MINIMUM_SUCCESS_CHANCE) this.successChance = this.units;
  }

  setDamage() {
    if (this.units > 1) this.damage = this.units * DAMAGE_RATE;
  }

  setReloadTime() {
    this.reloadTime = this.units * RELOAD_TIME_RATE;
  }

  fight(targets) {
    this.targets = targets.filter((target) => target.armyId !== this.armyId);

    const start = () => {
      if (this.targets.length > 0 && this.units > 0) {
        this.attack();
        setTimeout(start, this.reloadTime);
      }
    };

    start();
  }

  attack() {
    const target = this.findTarget();
    if (!target) {
      this.declareWinner();
    } else {
      const isAttackSuccessful = this.successChance >= Math.random() * 100;

      const logDetails = {
        attacker: {
          armyId: this.armyId,
          name: this.name,
        },
        target: {
          armyId: target.armyId,
          name: target.name,
        },
        successful: isAttackSuccessful,
        damage: this.damage,
      };

      this.createLog('Attack', logDetails);

      if (isAttackSuccessful) target.setUnits(this.damage);
    }
  }

  findTarget() {
    this.targets = this.targets.filter((t) => t.units > 0);
    if (!this.targets) this.declareWinner();

    switch (this.strategy) {
      case 'Weakest': {
        let minUnits = 100;
        let reducedTargets = [];
        for (let i = 0; i < this.targets.length; i += 1) {
          if (this.targets[i].units === minUnits) {
            reducedTargets.push(this.targets[i]);
          } else if (this.targets[i].units < minUnits) {
            minUnits = this.targets[i].units;
            reducedTargets = [this.targets[i]];
          }
        }
        return sample(reducedTargets);
      }
      case 'Strongest': {
        let maxUnits = 0;
        let reducedTargets = [];
        for (let i = 0; i < this.targets.length; i += 1) {
          if (this.targets[i].units === maxUnits) {
            reducedTargets.push(this.targets[i]);
          } else if (this.targets[i].units > maxUnits) {
            maxUnits = this.targets[i].units;
            reducedTargets = [this.targets[i]];
          }
        }
        return sample(reducedTargets);
      }
      default: {
        return sample(this.targets);
      }
    }
  }

  declareWinner() {
    const logDetails = {
      army: {
        armyId: this.armyId,
        name: this.name,
      },
    };

    this.createLog('Winner', logDetails);

    return this.name;
  }

  createLog(event, details) {
    pgPool(sql`
      INSERT INTO battle_logs (
        "battleId",
        "event",
        "details")
      VALUES (
        ${this.battleId},
        ${event},
        ${details});`);
  }
}

module.exports = {
  Army,
};
