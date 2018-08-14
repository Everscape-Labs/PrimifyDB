import fs from 'fs';
import path from 'path';

import config from '../../config/local';
import logger from '../utils/logger';
import {mkdir, readFile} from "./fs";

import {
  createDatabase as createDatabaseMeta,
  createCollection as createCollectionMeta
} from './metaData';

const caches = {
  databases  : {},
  collections: {},
  files      : {},
};

export const getDatabasePath   = (database) => path.join(config.path, database);
export const getCollectionPath = (database, collection) => {
  logger.debug(`getCollectionPath : `, {
    path: config.path,
    database,
    collection
  });

  const dirPath = path.join(config.path, database, 'collections', collection);

  return dirPath;
}

const registerDatabaseInCache = (database) => {
  logger.debug(`[utils/fileSystem] cache registration : database ${database}`);
  caches.databases[database] = {
    collections: {},
  };

  return true;
};

const registerCollectionInCache = (database, collection) => {
  logger.debug(`[utils/fileSystem] cache registration : collection ${collection}`);
  caches.collections[`${database}.${collection}`]       = true;
  caches.databases[database]['collections'][collection] = true;
  return true;
};

export const databaseExists = async (database) => {
  if (caches.databases[database]) {
    return true;
  }

  // in case we are not in sync with the file system (bad server reboot ...)
  logger.debug(`[utils/fileSystem] check path : ${getDatabasePath(database)}`);
  if (fs.existsSync(getDatabasePath(database))) {

    return registerDatabaseInCache(database);
  }

  logger.debug(`[utils/fileSystem] database not found in the file sytem`);
  return false;
};

export const collectionExists = async (database, collection) => {
  if (!await databaseExists(database)) {
    throw new Error('You cannot create a collection for an unknown database');
  }

  if (caches.collections[`${database}.${collection}`]) {
    return true;
  }

  // in case we are not in sync with the file system (bad server reboot ...)
  logger.debug(`[utils/fileSystem] check path : ${getDatabasePath(database)}`);
  if (fs.existsSync(getCollectionPath(database, collection))) {
    return registerCollectionInCache(database, collection);
  }

  logger.debug(`[utils/fileSystem] collection not found in the file sytem`);
  return false;
};

export const createDatabase = async (database) => {
  logger.debug(`[utils/fileSystem] create dir : ${getDatabasePath(database)}`);

  if (await mkdir(`${getDatabasePath(database)}/collections`)) {
    return registerDatabaseInCache(database);
  }

  logger.debug(`[utils/fileSystem] Cannot create the database ${database} - ${getDatabasePath(database)}`);
  throw new Error(`Cannot create the database ${database} in ${getDatabasePath(database)}`);
};

export const createCollection = async (database, collection) => {
  logger.debug(`[utils/fileSystem] create dir : ${getCollectionPath(database, collection)}`);

  if (await mkdir(`${getCollectionPath(database, collection)}`)) {
    return registerCollectionInCache(database, collection);
  }

  logger.debug(`[utils/fileSystem] Cannot create the collection ${collection} - ${getCollectionPath(database, collection)}`);
  throw new Error(`Cannot create the database ${database} in ${getCollectionPath(database, collection)}`);
};

export const createDatabaseIfNotExists = async (database) => {
  logger.debug(`[utils/fileSystem] check if database exists: ${database}`);
  if (!await databaseExists(database)) {
    logger.debug(`[utils/fileSystem] database doesn't exists : ${database}`);

    await createDatabase(database);
    await createDatabaseMeta(database);

    return getDatabasePath(database, collection);
  }

  logger.debug(`[utils/fileSystem] no database : ${database}`);
  return getDatabasePath(database, collection);
};

export const createCollectionIfNotExists = async (database, collection) => {
  logger.debug(`[utils/fileSystem] check if collection exists: ${database}.${collection}`);
  if (!await collectionExists(database, collection)) {
    logger.debug(`[utils/fileSystem] collection doesn't exists : ${database}.${collection}`);

    await createCollection(database, collection);
    await createCollectionMeta(database, collection);

    return getCollectionPath(database, collection);
  }

  logger.debug(`[utils/fileSystem] no collection : ${database}.${collection}`);
  return getCollectionPath(database, collection);
};

const formatDate = (dateSubmitted) => {
  const date = new Date(dateSubmitted);

  const formatted = [
    date.getFullYear(),
    date.getMonth(),
    date.getDay(),
  ].join('');

  logger.info(`dateSubmitted is ${dateSubmitted}`)
  logger.info(`DATE is ${date}`)
  logger.info('formatted is ', formatted)

  return formatted;
};

export const generateKeyStorageDirectoryPath = (database, collection, date) =>
  path.join(getCollectionPath(database, collection), formatDate(date));

export const keyStorageExists = (path) => {
  if (caches.files[path]) {
    return true;
  }

  if (fs.existsSync(path)) {
    caches.files[path] = true;
    return true;
  }

  return false;
};

export const createKeyStorageDirectory = (path) => {
  return mkdir(path)
};

export const generateKeyStorageDirectoryIfNotExists = async (database, collection, date) => {
  const path = generateKeyStorageDirectoryPath(database, collection, date);

  if (keyStorageExists(path)) {
    return path;
  }

  await createKeyStorageDirectory(path);

  return path;
};

export const readSingleDate = async (database, collection, key, date, objectMode = true) => {
  const dirPath = generateKeyStorageDirectoryPath(database, collection, date);

  const content = await readFile(`${dirPath}/${key}.json`, false);

  if (objectMode === true) {
    return JSON.parse(`[${content.substring(0, content.length - 2)}]`);
  }

  return content;
};


export const readRangeOfDates = async (database, collection, key, dateFrom, dateTo) => {
  const data = [];
  for (let d = dateFrom; d <= dateTo; d.setDate(d.getDate() + 1)) {
    data.push(await readSingleDate(database, collection, key, d));
  }

  const content = data.join('');
  return JSON.parse(`[${content.substring(0, content.length - 2)}]`);
}