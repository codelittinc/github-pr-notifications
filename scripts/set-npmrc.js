//  ╔═╗╦═╗╔═╗╦╔╗╔╔═╗╔╦╗╔═╗╦  ╦    ┌─┐┌─┐┌┬┐  ┌┐┌┌─┐┌┬┐┬─┐┌─┐  ┌─┐┬┬  ┌─┐
//  ╠═╝╠╦╝║╣ ║║║║╚═╗ ║ ╠═╣║  ║    └─┐├┤  │   │││├─┘│││├┬┘│    ├┤ ││  ├┤
//  ╩  ╩╚═╚═╝╩╝╚╝╚═╝ ╩ ╩ ╩╩═╝╩═╝  └─┘└─┘ ┴   ┘└┘┴  ┴ ┴┴└─└─┘  └  ┴┴─┘└─┘
//
// Used in production to install npm private modules
import fs from 'fs';

if(process.env.NODE_ENV == 'production') {
  console.log("creating custom .npmrc")
  fs.writeFileSync('.npmrc', '//npm.pkg.github.com/:_authToken=${CODELITT_GITHUB_PACKAGES_TOKEN}');
  fs.chmodSync('.npmrc', '0600');
} else {
  console.log("not creating custom .npmrc")
}

fs.readFile('./.npmrc', function read(err, data) {
  if (err) {
      throw err;
  }
  const content = data;

  // Invoke the next step here however you like
  console.log('reading stuff')
  console.log(String(content));   // Put all of the code here (not the best solution)
});
