const { join } = require('path');
const { createWriteStream } = require('fs');
const readline = require('node:readline');
const { stdin, stdout } = require('node:process');

const rl = readline.createInterface({ input: stdin, output: stdout });

const writeableStream = createWriteStream(join(__dirname, 'text.txt'), 'utf-8');

rl.question('Enter any text: ', (answer) => writeableStream.write(answer));

rl.on('line', (input) => {
  if (input === 'exit') closeReadLine();
  else writeableStream.write(input);
});

rl.on('SIGINT', closeReadLine);

function closeReadLine() {
  console.log('Bye, bye');
  rl.close();
}
