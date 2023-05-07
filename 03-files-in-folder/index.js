const fs = require('fs').promises;
const rr = require('fs');
const path = require('path');

(async function(pat) {
   try {
      const files = await fs.readdir(pat, {withFileTypes: true});
      for (const file of files) {
         let a = path.join(__dirname, 'secret-folder', `${file.name}`);
         rr.stat(a, (err, stats) => {
            if ( stats.isFile() === true) {
               console.log(`${file.name.split('.')[0]} -- ${path.extname(file.name)} --  ${stats.size /1024}kb`);
            } else {
               return
            }
          });
      }
   } catch (error) {
     console.error('there was an error:', error.message);
   }
 })(path.join(__dirname, 'secret-folder'));
