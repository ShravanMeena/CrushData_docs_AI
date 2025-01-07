const admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config();

// ✅ Import the service account key securely
const serviceAccount = require("./serviceAccountKey.json");

// ✅ Initialize Firebase Admin SDK (Server-Side)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore(); // ✅ Correct Firestore Reference for Server
const auth = admin.auth();    // ✅ Firebase Admin Auth (Server-side)

module.exports = { db, auth };