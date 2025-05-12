const fs = require('fs');
const path = require('path');

// Ensure the environment variable is set
const googleServiceInfoBase64 = process.env.GOOGLE_SERVICE_INFO_PLIST;

if (!googleServiceInfoBase64) {
  console.error('GOOGLE_SERVICE_INFO_PLIST is not set.');
  process.exit(1);
}

// Decode the base64 string to binary data
const decodedData = Buffer.from(googleServiceInfoBase64, 'base64');

// Automatically handle platform-based logic using the EAS Build environment
const platform = process.env.PLATFORM || 'ios'; // Default to 'ios' if not set

let filePath = path.join(__dirname, 'ios', 'GoogleService-Info.plist');
if (platform === 'android') {
  filePath = path.join(__dirname, 'android', 'google-services.json');
}

// Write the decoded content to the correct file based on platform
fs.writeFileSync(filePath, decodedData);

console.log(`${platform === 'ios' ? 'GoogleService-Info.plist' : 'google-services.json'} has been written to ${platform}/ directory.`);
