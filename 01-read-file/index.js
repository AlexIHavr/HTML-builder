const { join } = require('path');
const { createReadStream } = require('fs');

const readableStream = createReadStream(join(__dirname, 'text.txt'), 'utf-8');

readableStream.on('data', (chunk) => console.log(chunk));
