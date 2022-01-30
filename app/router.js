const { Router } = require('express');
const { resolveRequest } = require('./middlewares/resolve-request');
const Controller = require('./controller');

module.exports = Router()
  .post('/battles', resolveRequest(Controller.createBattle))
  .get('/battles', resolveRequest(Controller.listBattles))
  .post('/battles/:battleId/armies', resolveRequest(Controller.createArmy))
  .get('/battles/:battleId/start', resolveRequest(Controller.startBattle))
  .get('/battles/:battleId/logs', resolveRequest(Controller.getBattleLogs));
