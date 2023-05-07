const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

const boxFiles = path.join(__dirname, 'styles');
async function print(pat) {
   const files = await fsp.readdir(pat);
   const projectDist = path.join(__dirname, 'project-dist', 'bundle.css');
   const createBundle = fs.createWriteStream(`${projectDist}`);
   for (const file of files) {
      if (path.extname(file) === '.css') {
         let currentFile = path.join(boxFiles, file);
         let stream = fs.createReadStream(`${currentFile}`, 'utf8');
         stream.on('data', (chunk) => {
            fs.appendFile(projectDist, chunk, (err) => {
                  if (err) throw err;
                });
          });
      }
   }
}
print(boxFiles).catch(console.error);
