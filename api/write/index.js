'use strict';

const insertRecord = require('./controllers/insert');
const updateRecord = require('./controllers/update');
const deleteRecord = require('./controllers/delete');
const bulkInsert   = require('./controllers/bulkInsert');

const basePath = '/:database/_write';

const main = (Fastify) => {
  Fastify.route({
    method: 'POST',
    url: `${basePath}/:collection`,
    handler: insertRecord(Fastify),
  });

  Fastify.patch(`${basePath}/:collection`, updateRecord(Fastify));
  Fastify.delete(`${basePath}/:collection`, deleteRecord(Fastify));
  Fastify.post(`${basePath}/bulk/:collection`, deleteRecord(Fastify));
};


module.exports = main;