import mkdirp from 'mkdirp';
import fs from 'fs';

export const mkdir = async (path) =>
  new Promise((resolve, reject) => {
    mkdirp(path, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve(true);
    })
  });


export const writeFile = async (path, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, content, (error) => {
      if (error) {
        reject(error);
      }

      resolve(true);
    })
  });

export const readFile = async (path, objectMode = true) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, content) => {
      if (error) {
        return reject(error);
      }

      if (objectMode === true) {
        return resolve(JSON.parse(content));
      }

      return resolve(content);
    })
  });

export const fileExists = async(path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (error, content) => {
      if (error) {
        return reject(error);
      }

      if (objectMode === true) {
        return resolve(JSON.parse(content));
      }

      return resolve(content);
    })
  });
