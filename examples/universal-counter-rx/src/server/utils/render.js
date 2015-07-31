import fs from 'fs';

const index = fs.readFileSync('./src/server/index.html', {encoding: 'utf-8'});

export default function(state) {
  return index.replace('${counter}', state.counter).replace('${state}', JSON.stringify(state));
}