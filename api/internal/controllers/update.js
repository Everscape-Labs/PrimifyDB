'use strict';

const main = (Fastify) => (request, reply) => {
  Fastify.log.info(request);
  return reply.send({ response: true });
};

module.exports = main;