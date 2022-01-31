const { Client, Pool } = require('pg');
const { PG_CONNECTION_STRING } = require('./environments');
const { HTTPError, errorConstants } = require('../middlewares/errors/http-errors');

const pool = new Pool({
  connectionString: PG_CONNECTION_STRING,
});

const client = new Client({
  connectionString: PG_CONNECTION_STRING,
});
client.connect();
client.query('LISTEN fill_empty_slot');

module.exports.client = client;

module.exports.pgPool = (query) => pool.query(query)
  .then((res) => res.rows)
  .catch((err) => {
    // console.log('db error', err);
    // console.log('pool query', query);
    let error;
    switch (err.code) {
      case '23502':
        error = errorConstants.MISSING_PARAMETERS;
        break;
      case '22P02':
      case '22007':
      case '23503':
        error = errorConstants.INVALID_VALUE;
        break;
      case '23514':
        error = errorConstants.INVALID_EMAIL;
        break;
      case '23000':
      case '23001':
      case '23505':
        error = errorConstants.NOT_ACCEPTABLE;
        break;
      default:
        error = errorConstants.UNKNOWN_DATABASE_ERROR;
    }

    throw new HTTPError(error, err.message);
  });

/**
 * SQL query template
 * @param originalText
 * @param values
 * @returns {object}
 */
module.exports.sql = (originalText, ...values) => {
  let text = '';

  if (values.length) {
    originalText = [...originalText];

    let i = 0;
    while (i < values.length) {
      if (values[i]?._sqlQueryTagFunction) {
        const newValues = values[i].values;
        const newText = values[i].originalText;
        const newTextLength = newText.length;

        values.splice(i, 1);
        values.splice(i, 0, ...newValues);

        originalText.splice(i + 1, 0, ...newText);

        originalText[i + newTextLength] = `${originalText[i + newTextLength]} ${originalText[i + newTextLength + 1]}`;
        originalText.splice(i + newTextLength + 1, 1);

        originalText[i] = `${originalText[i]} ${originalText[i + 1]}`;
        originalText.splice(i + 1, 1);
      }
      text += `${originalText[i]}$${i + 1}`;
      i += 1;
    }
    text += originalText.slice(-1);
  } else {
    [text] = originalText;
  }

  return {
    text, values, originalText, _sqlQueryTagFunction: true,
  };
};
