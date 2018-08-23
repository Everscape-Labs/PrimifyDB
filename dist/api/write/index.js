'use strict';

var insertRecord = require('./controllers/insert');
var updateRecord = require('./controllers/update');
var deleteRecord = require('./controllers/delete');
var bulkInsert = require('./controllers/bulkInsert');

var basePath = '/:database/_write';

var main = function main(Fastify) {
  Fastify.route({
    method: 'POST',
    url: basePath + '/:collection',
    handler: insertRecord(Fastify)
  });

  Fastify.patch(basePath + '/:collection', updateRecord(Fastify));
  Fastify.delete(basePath + '/:collection', deleteRecord(Fastify));
  Fastify.post(basePath + '/bulk/:collection', bulkInsert(Fastify));
};

module.exports = main;