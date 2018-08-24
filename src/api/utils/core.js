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

  return path.join(config.path, database, 'collections', collection);
};

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

    return getDatabasePath(database);
  }

  logger.debug(`[utils/fileSystem] no database : ${database}`);
  return getDatabasePath(database);
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

const formatDate = (date) => {
  const d    = new Date(date);
  let month  = '' + (d.getMonth() + 1),
        day  = '' + d.getDate(),
        year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [
    year,
    month,
    day
  ].join('');
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

const escapeOutput = (content) => {
  if (!content || typeof content !== typeof " ") {
    return false;
  }

  return content.substring(0, content.length - 2);
};

export const readSingleDate = async (database, collection, key, date, objectMode = true) => {
  const dirPath = generateKeyStorageDirectoryPath(database, collection, date);
  let error     = {};
  let content   = {};


  try {
    content = await readFile(`${dirPath}/${key}.json`, false);
  }
  catch (readError) {
    error = readError;
  }

  if (objectMode === true) {
    const escapedContent = escapeOutput(content);

    if (escapedContent) {
      return {
        data: JSON.parse(`[${escapedContent}]`),
        error,
      };
    } else {
      return {
        data : null,
        error: 'content is undefined - cannot escape sentence',
      };
    }
  }

  return {
    data: content,
    error,
  };
};

export const readRangeOfDates = async (database, collection, key, dateFrom, dateTo) => {
  const data   = [];
  const errors = [];
  for (let d = dateFrom; d <= dateTo; d.setDate(d.getDate() + 1)) {
    const response = await readSingleDate(database, collection, key, d);
    if (response.data && response.data.length > 0) {
      data.push(response.data);
    }

    if (response.error && response.error.length > 0) {
      errors.push(response.error);
    }
  }

  const content = data.join('');
  return {
    response: JSON.parse(`[${content.substring(0, content.length - 2)}]`),
    errors,
  };
};
