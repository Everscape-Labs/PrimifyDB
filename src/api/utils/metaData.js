import fs from 'fs';
import {getDatabasePath, getCollectionPath} from './core';
import {readFile, writeFile} from "./fs";
import logger from "./logger";

const cache = {
  databases  : {},
  collections: {},
};

export const createDatabase = async (database, opts) => {
  const metadata = {
    name       : database,
    schema     : false,
    created_at : new Date(),
    encoding   : 'utf-8',
    collections: [],
    ...opts
  };

  cache.databases[database] = metadata;
  return writeFile(`${getDatabasePath(database)}/.metadata`, JSON.stringify(metadata))
};

const getDatabaseMetadata = async (database) => {
  if (cache.databases[database]) {
    return cache.databases[database];
  }

  const metadata = await readFile(`${getDatabasePath(database)}/.metadata`);

  cache.databases[database] = metadata;

  return metadata;
};

const getCollectionMetadata = async (database, collection) => {
  if (cache.collections[`${database}.${collection}`]) {
    return cache.collections[`${database}.${collection}`];
  }


  const metadata = await readFile(`${getCollectionPath(database, collection)}/.metadata`);

  cache.collections[`${database}.${collection}`] = metadata;

  return metadata;
};

export const addCollectionToDatabaseMeta = async (database, collection) => {
  const metadata = await getDatabaseMetadata(database);

  logger.info('METADATA : ', metadata);

  metadata.collections.push(collection);

  logger.info('METADATA AFTER: ', metadata);

  return createDatabase(database, metadata); // overwrite metadata
};

export const createCollection = async (database, collection, opts) => {
  const metadata = {
    database  : database,
    name      : collection,
    schema    : false,
    created_at: new Date(),
    encoding  : 'utf-8',
    ...opts
  };

  cache.collections[`${database}.${collection}`] = metadata;
  await writeFile(`${getCollectionPath(database, collection)}/.metadata`, JSON.stringify(metadata));
  await addCollectionToDatabaseMeta(database, collection);

  return true;
};
