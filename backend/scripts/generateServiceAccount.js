const fs = require('fs');
require('dotenv').config();

// ✅ Build the service account object dynamically from the `.env` file
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Fix line breaks
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

// ✅ Generate the JSON file if it doesn't already exist
const filePath = './serviceAccountKey.json';

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(serviceAccount, null, 2));
    console.log('✅ serviceAccountKey.json created successfully.');
} else {
    console.log('⚠️ serviceAccountKey.json already exists. Delete it to regenerate.');
}