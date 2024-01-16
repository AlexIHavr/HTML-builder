const { stat } = require('node:fs');
const { readdir } = require('fs/promises');
const { join, extname, basename } = require('path');

const FILE_PATH = join(__dirname, 'secret-folder');

readdir(FILE_PATH, { withFileTypes: true }).then((files) => {
  for (const file of files) {
    if (file.isFile()) {
      const filePath = join(FILE_PATH, file.name);
      const fileExtname = extname(filePath);

      stat(filePath, (_, stats) => {
        console.log(
          [
            basename(file.name, fileExtname),
            fileExtname.slice(1),
            `${stats.size / 1024}kb`,
          ].join(' - '),
        );
      });
    }
  }
});
