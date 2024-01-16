const { join, extname, basename } = require('path');
const { copyFile, readdir } = require('fs/promises');
const { mkdir, rm } = require('fs');
const { createReadStream, createWriteStream } = require('fs');
const { EventEmitter } = require('node:events');

const projectDistPath = join(__dirname, 'project-dist');

rm(projectDistPath, { recursive: true, force: true }, () => {
  mkdir(projectDistPath, { recursive: true }, () => {
    //CREATE ASSETS
    const projectDistAssetsPath = join(projectDistPath, 'assets');
    const assetsPath = join(__dirname, 'assets');

    mkdir(projectDistAssetsPath, { recursive: true }, () => {
      readdir(assetsPath, { withFileTypes: true }).then((dirs) => {
        for (const dir of dirs) {
          if (dir.isDirectory()) {
            const currentProjectDirPath = join(projectDistAssetsPath, dir.name);

            mkdir(currentProjectDirPath, { recursive: true }, () => {
              const currentDirPath = join(assetsPath, dir.name);
              readdir(currentDirPath, {
                withFileTypes: true,
              }).then((files) => {
                for (const file of files) {
                  if (file.isFile()) {
                    copyFile(
                      join(currentDirPath, file.name),
                      join(currentProjectDirPath, file.name),
                    );
                  }
                }
              });
            });
          }
        }
      });
    });

    //CREATE STYLE
    const styleStream = createWriteStream(
      join(projectDistPath, 'style.css'),
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

          readableStream.on('data', (chunk) => styleStream.write(`${chunk}\n`));
        }
      }
    });

    //CREATE COMPONENTS
    const templateStream = createReadStream(
      join(__dirname, 'template.html'),
      'utf-8',
    );

    const indexStream = createWriteStream(
      join(projectDistPath, 'index.html'),
      'utf-8',
    );

    const EE = new EventEmitter();

    templateStream.on('data', (chunk) => {
      let data = chunk;
      const componentsPath = join(__dirname, 'components');

      readdir(componentsPath, { withFileTypes: true }).then((components) => {
        let counter = 0;

        for (const component of components) {
          const fileExtname = extname(component.name);

          if (component.isFile() && fileExtname === '.html') {
            const componentStream = createReadStream(
              join(componentsPath, component.name),
              'utf-8',
            );

            componentStream.on('data', (componentChunk) => {
              data = data.replaceAll(
                `{{${basename(component.name, fileExtname)}}}`,
                componentChunk,
              );

              counter++;

              if (counter === components.length) EE.emit('write');
            });
          }
        }

        EE.on('write', () => indexStream.write(data));
      });
    });
  });
});
