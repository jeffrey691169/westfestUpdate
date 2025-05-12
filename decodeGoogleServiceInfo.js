const fs = require('fs');
const path = require('path');

// Ensure the environment variable is set
const googleServiceInfoBase64 = process.env.GOOGLE_SERVICE_INFO_PLIST;

console.log(process.env.GOOGLE_SERVICE_INFO_PLIST); // This should print the base64 string

if (!googleServiceInfoBase64) {
  console.error('GOOGLE_SERVICE_INFO_PLIST is not set.');
  process.exit(1);
}

// Decode the base64 string to binary data
const decodedData = Buffer.from(googleServiceInfoBase64, 'base64');

// Define the file path
const filePath = path.join(__dirname, 'ios', 'GoogleService-Info.plist');

// Check if the file already exists
if (fs.existsSync(filePath)) {
  console.log('GoogleService-Info.plist already exists. Skipping writing.');
} else {
  // Write the decoded content to the file for iOS (or Android if needed)
  fs.writeFileSync(filePath, decodedData);
  console.log('GoogleService-Info.plist has been written to ios/ directory.');
}
