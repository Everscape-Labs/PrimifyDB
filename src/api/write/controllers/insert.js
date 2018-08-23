'use strict';

import logger from '../../utils/logger';
import {generateKeyStorageDirectoryIfNotExists} from "../../utils/core";
import {getFileHandle} from "../../utils/resourcesManager";

const main = (Fastify) => async (request, reply) => {
  const { data, key, splitField } = request.body;
  const { database, collection }  = request.params;

  const temp = {
    database,
    collection,
    key,
    data,
    splitField
  };

  // logger.info('DATA TO INSERT', data);
  // logger.info('splitField : ', splitField);
  // logger.info('Date : ', data.date);
  // logger.info('Date : ', data[splitField]);

  const storageDirectory = await generateKeyStorageDirectoryIfNotExists(database, collection, data[splitField]);
  const storageFile = `${storageDirectory}/${key}.json`;
  const handle = getFileHandle(storageFile);

  handle.write(`${JSON.stringify(data)},\n`);

  reply.send(temp);
};

module.exports = main;