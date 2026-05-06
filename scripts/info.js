const fs = require('fs');
console.log('Size of wordmark.png:', fs.statSync('./public/wordmark.png').size);
if (fs.existsSync('./Wordmark-removebg-preview.png')) {
  console.log('Size of original:', fs.statSync('./Wordmark-removebg-preview.png').size);
}
