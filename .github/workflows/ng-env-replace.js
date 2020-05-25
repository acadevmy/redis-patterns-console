const fs = require('fs');

const targetPath = './src/environments/environment.prod.ts';
const file = fs.readFileSync(targetPath ,'utf8');
const newFile = file.replace('REDIS_SERVER_API_WS', process.env.REDIS_SERVER_API_WS);

fs.writeFileSync(targetPath , newFile);
