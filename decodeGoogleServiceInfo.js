const fs = require('fs');
const path = require('path');

// Check if the environment variable is set
const googleServiceInfoBase64 = process.env.GOOGLE_SERVICE_INFO_PLIST;

if (!googleServiceInfoBase64) {
  console.error('GOOGLE_SERVICE_INFO_PLIST is not set.');
  process.exit(1);
}

// Decode the base64 string to binary data
const decodedData = Buffer.from(googleServiceInfoBase64, 'base64');

// Define the file path where GoogleService-Info.plist should be written
const filePath = path.join(__dirname, 'ios', 'GoogleService-Info.plist');

// Write the decoded content to the file
fs.writeFileSync(filePath, decodedData);

console.log('GoogleService-Info.plist has been written to ios/ directory.');
