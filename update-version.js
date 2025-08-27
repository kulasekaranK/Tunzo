const fs = require('fs');
const path = require('path');

// Get the version from package.json
const packageJson = require('./package.json');
const appVersion = packageJson.version;

// Path to the environment files
const environmentsDir = path.join(__dirname, 'src', 'environments');
const environmentFile = path.join(environmentsDir, 'environment.ts');
const environmentProdFile = path.join(environmentsDir, 'environment.prod.ts');

// Function to update the appVersion in a file
function updateVersionInFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    // Check if appVersion is already there
    if (data.includes('appVersion')) {
      // Replace existing version
      const result = data.replace(/appVersion: '.*'/g, `appVersion: '${appVersion}'`);
      fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log(`Updated version in ${filePath} to ${appVersion}`);
      });
    } else {
      // Add appVersion
      const result = data.replace(/production: (true|false)/g, `production: $1,
  appVersion: '${appVersion}'`);
      fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.log(err);
        console.log(`Added version in ${filePath} as ${appVersion}`);
      });
    }
  });
}

// Update both files
updateVersionInFile(environmentFile);
updateVersionInFile(environmentProdFile);
