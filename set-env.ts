const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

console.log('process.env', process.env);

const envConfigFile = `export const environment = {
   clientID: '${process.env.clientID}',
   vapidKey: '${process.env.VAPID_PUBLIC_KEY}',
   production: true
};
`;
console.log('The file `environment.prod.ts` will be written with the following content: \n');
console.log(envConfigFile);
fs.writeFile(targetPath, envConfigFile, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});
