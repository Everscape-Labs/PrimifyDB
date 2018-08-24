import fs from 'fs';
import {join} from 'path';

const file = join(__dirname, 'stream.log');
const writeStream = fs.createWriteStream(file, {flags: 'a'});

const writeData = (stream) => {
  setInterval(() => {
    const line = JSON.stringify({date: new Date(), foo: 'bar'});
    stream.write(`${line}\n`);
  }, 50);
};

writeData(writeStream);