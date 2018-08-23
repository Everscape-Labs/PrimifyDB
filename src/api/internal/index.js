'use strict';

const createCollection = require('./controllers/create');
const deleteCollection = require('./controllers/delete');
const updateCollection = require('./controllers/update');
const schema      = require('./schemas/create');

const basePath = '/:database/_internal';

const main = (Fastify) => {
  Fastify.route({
    method : 'PUT',
    url    : `${basePath}/collections`,
    handler: createCollection(Fastify),
  });

  Fastify.delete(`${basePath}/collections`, deleteCollection(Fastify));
  Fastify.patch(`${basePath}/collections`, updateCollection(Fastify));
};


module.exports = main;