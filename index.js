'use strict';
import fastify from 'fastify';
import {internal, write, read } from './api';
import {registerLogger} from './api/utils/logger';

const Fastify = fastify({
  logger: true,
  bodyLimit: 1048576 * 200, // 200 Mo
});

// register the logger for application wide usage
registerLogger('debug');

// Declare a route
internal(Fastify);
write(Fastify);
read(Fastify);


Fastify.listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1', (err, address) => {
  if (err) {
    throw err;
  }

  Fastify.log.info(`server listening on ${address}`);
});