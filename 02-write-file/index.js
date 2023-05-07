const fs = require('fs');

const { stdout } = process;
const readline = require('readline');

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

const output = fs.createWriteStream('02-write-file/write-text.txt');
stdout.write('ВВЕДИТЕ ТЕКСТ\n');
rl.on('line', (data) => {
   if(data.toString() === 'exit') {
      stdout.write('ДО СВИДАНИЯ\n');
      rl.close()
   } else {
      return output.write(`${data}\n`);
   }
});
rl.on('SIGINT', () => {
   stdout.write('ДО СВИДАНИЯ\n');
   rl.close()
});