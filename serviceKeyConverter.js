const fs = require('fs');

const jsonData = fs.readFileSync('./serviceAccountKey.json');

const base64Data = Buffer.from(jsonData, 'utf-8').toString('base64'); 

console.log(base64Data);