const { join, extname } = require('path');
const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

const writeableStream = createWriteStream(
  join(__dirname, 'project-dist', 'bundle.css'),
  'utf-8',
);

const stylesPath = join(__dirname, 'styles');

readdir(stylesPath, { withFileTypes: true }).then((files) => {
  for (const file of files) {
    if (file.isFile() && extname(file.name) === '.css') {
      const readableStream = createReadStream(
        join(stylesPath, file.name),
        'utf-8',
      );

      readableStream.on('data', (chunk) => writeableStream.write(`${chunk}\n`));
    }
  }
});
