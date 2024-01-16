const { join } = require('path');
const { copyFile, readdir } = require('fs/promises');
const { mkdir, rm } = require('fs');

const filesCopyPath = join(__dirname, 'files-copy');
const filesPath = join(__dirname, 'files');

rm(filesCopyPath, { recursive: true, force: true }, () => {
  mkdir(filesCopyPath, { recursive: true }, () => {
    readdir(filesPath, { withFileTypes: true }).then((files) => {
      for (const file of files) {
        if (file.isFile()) {
          copyFile(join(filesPath, file.name), join(filesCopyPath, file.name));
        }
      }
    });
  });
});
