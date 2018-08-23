'use strict';

import fetch from './controllers/fetch';

const basePath = '/:database/_read';

const main = (Fastify) => {
  Fastify.post(`${basePath}/:collection`, fetch(Fastify));
};


module.exports = main;