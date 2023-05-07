const fs = require('fs').promises;
const path = require('path');


function copyDir () {
   try {
      const projectFolder = path.join(__dirname, 'files-copy');
      const boxFiles = path.join(__dirname, 'files');
      const createDir = fs.mkdir(projectFolder, { recursive: true });
  
      async function print(pat) {
      const files = await fs.readdir(pat);
      for (const file of files) {
         const fromFile = path.join(boxFiles, file);
         const ToFile = path.join(projectFolder, file);
         fs.copyFile(fromFile, ToFile);
      }
   }
   print(boxFiles).catch(console.error);
   } catch (err) {
      console.error(err.message);
   }
}

copyDir();