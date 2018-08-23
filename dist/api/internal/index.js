'use strict';

var createCollection = require('./controllers/create');
var deleteCollection = require('./controllers/delete');
var updateCollection = require('./controllers/update');
var schema = require('./schemas/create');

var basePath = '/:database/_internal';

var main = function main(Fastify) {
  Fastify.route({
    method: 'PUT',
    url: basePath + '/collections',
    handler: createCollection(Fastify)
  });

  Fastify.delete(basePath + '/collections', deleteCollection(Fastify));
  Fastify.patch(basePath + '/collections', updateCollection(Fastify));
};

module.exports = main;