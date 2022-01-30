const cors = require('cors');
const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const { PORT } = require('./app/config/environments');
const ErrorHandler = require('./app/middlewares/errors/error-handler');
const AppRoutes = require('./app/router');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.disable('x-powered-by');

app.use(lusca.xframe('ALLOWALL'));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use('/api/v1', AppRoutes);

app.use(ErrorHandler());

app.listen(PORT);
module.exports = app;
