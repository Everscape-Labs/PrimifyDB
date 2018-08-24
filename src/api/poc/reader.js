import {join} from "path";
import {Tail} from 'tail';

const file = join(__dirname, 'stream.log');

const tail = new Tail(file);

tail.on("line", function(line) {
  console.log(`${line}\n`);
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});
