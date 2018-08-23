'use strict';

var main = function main(Fastify) {
  return function (request, reply) {
    Fastify.log.info(request);
    return reply.send({ response: true, headers: request.headers, body: request.body, params: request.params });
  };
};

module.exports = main;