'use strict';
import 'babel-polyfill'
import fastify from 'fastify';
import {internal, write, read } from './api';
import {registerLogger} from './api/utils/logger';
import launchIngestion from "./workers/ingestion";

const Fastify = fastify({
  logger: true,
  bodyLimit: 1048576 * 500, // 200 Mo
});

// register the logger for application wide usage
registerLogger('warning');

// register the ingestion logic
launchIngestion();

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