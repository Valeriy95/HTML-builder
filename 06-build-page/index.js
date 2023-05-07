const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');


let arrayOriginalFolder = [];
let arrayFolderCopy = [];

const folder = path.join(__dirname, 'project-dist');
fs.mkdir(folder, { recursive: true }, (err) => {
   if (err) throw err;
});

 const template =  path.join(__dirname, 'template.html');
 const indexFile = path.join(folder, 'index.html');

fs.writeFile(path.join(indexFile), '', function(err){
   if (err) {
       console.log(err);
   }
});

let nameTags;
let nameFiles =[];
let addressFiles = [];
let nameFilesDoubleBrackets = [];

const boxFiles = path.join(__dirname, 'styles');
async function print(pat) {
   const files = await fsp.readdir(pat);
   const projectDist = path.join(__dirname, 'project-dist', 'style.css');
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

function copyDir () {
   try {
      const projectFolder = path.join(__dirname, 'project-dist', 'assets');
      const boxFiless = path.join(__dirname, 'assets');
      const createDir = fsp.mkdir(projectFolder, { recursive: true });
      let originalFolder;
      let folderCopy;

      async function print(pat) {
         const files = await fsp.readdir(pat);
         for (const file of files) {
            let currentElem = path.join(`${pat}`, `${file}`);
            fs.stat(currentElem, (err, stats) => {
               if(stats.isDirectory() === true) {
                  originalFolder = path.join(__dirname, 'assets', `${file}`);
                  folderCopy = path.join(__dirname, 'project-dist', 'assets', `${file}`);
                  arrayOriginalFolder.push(originalFolder);
                  arrayFolderCopy.push(folderCopy);

                  for(let y = 0; y < arrayOriginalFolder.length; y++) {
                     const filesg = fs.readdir(arrayOriginalFolder[y], (err, elements) => {
                        for (const elem of elements) {
                           const fromFile = path.join(arrayOriginalFolder[y], elem);
                           const ToFile = path.join(arrayFolderCopy[y], elem);
                           fs.copyFile(fromFile, ToFile, (err) => {
                              if (err) {
                                 console.log(err);
                              }
                           });
                        }
                     })
                  }

                  fs.mkdir(folderCopy, { recursive: true }, (err) => {
                     if (err) throw err;
                  });
               } else {
                  console.log('NO!')
               }
            })
         }
      }
      print(boxFiless).catch(console.error);
   } catch (err) {
      console.error(err.message);
   }
}
copyDir();

const readableStream = fs.createReadStream(path.join(template));
readableStream.on('data', (chunk) => {
   nameTags = chunk.toString().match(/{[a-z]+}/g);
   nameFilesDoubleBrackets = chunk.toString().match(/{{[a-z]+}}/g);
   for(let i = 0; i < nameTags.length; i++) {
      let fileHtml = nameTags[i].slice(1, nameTags[i].length - 1) + '.html';
      nameFiles[i] = fileHtml;
      addressFiles[i] = path.join(__dirname, 'components', nameFiles[i]);
   }
})

fs.copyFile(template, indexFile, err => {
   if(err) throw err;
   let textFile;
   let textFileEdit;
   const readableStream3 = fs.createReadStream(path.join(indexFile));
   readableStream3.on('data', (chunk) => {
      textFile = chunk.toString();
      for(let e = 0; e < nameFilesDoubleBrackets.length; e++) {
         let readableStream4 = fs.createReadStream(path.join(addressFiles[e]));
         readableStream4.on('data', (chunk) => {
            textFileEdit = textFile.replace(`${nameFilesDoubleBrackets[e]}`, `${chunk.toString()}`);
            textFile = textFileEdit
            fs.writeFile(path.join(indexFile), textFileEdit, function(err){
               if (err) {
                  console.log(err);
               }
            });
         })
      }
   })
})