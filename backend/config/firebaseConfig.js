const admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config();


const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // ✅ FIXED: Convert to actual newlines
    // "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC86f4UhlCHNTWa\nfdd5Dn9ekzpDeXcYQDrCxzpmEZFYBSDEBdu4gGiE2LzLOhkbtJpJVUsM0i5fvbrA\n1gNPVLlSAYvgYFhOe6UMmUXGAxnlUP2byTSTeUIL/MOCl4uZpmETa+ehaLKzAOp+\npGUlMSwC3M+y178Cn+nRoSQJ/+lmhmKwjP1qCE+wFeV+eJvBKLbxlpR2ilS7t3OL\nQTrZN/0hhhFy6YMFNPRYdJIy74raH23JKeMNUueeYXP5+q+GjVn4hLD8l9+fHoxp\nTDmLVGwinhrRneA2U2k820qfP3vPIYzFZ+4stKR+/7Y5RHIsaAn7VWt7FUxE8TWD\nHvazH9trAgMBAAECggEAAu29uqO6a94vTo3U4VOQNe8iYBlp9z5Hqu1bwmlTT4IE\n2AUfOuUCucyCYMQtz3glTC2+VByOC33tfz/SHVC67sKHYJsdw1m3XVKi+kbiB+QR\ninC8F+0xUO5COawPxfoGVz69AIuW+Z9yAzSZPNJeVE0IC0W8+FVyUoWlAWKuQ6Ca\n5HqGtzHPPJFIAd1NjyrhjEvELs25sBg9as9F1lWtcR1jqWud9enK/rX5PXbS6oxC\nKGnU8qhM63laZfWP0/YuOgWYF5NRjAmwl6oRnPz7JMPY4cnAh0PKc/6JfXNeaCQn\nf0eW5nNW7cOd2oRYGc0ehGnPZuA9NK+dgXPypFdYQQKBgQDjlic8sV5KZFA9ULFL\n0GgTIFvRREw/EM+TgFVSY1lJASgp3Wcnfe5n7udPCOm+6chUA2RtMIyKKRldYfW8\nGKL2Rp/1BrJ7tAVjYZD1DujvRb+kJLAVhvSZi6JmK4eir+yGnFxR/xL22VL4rLv0\nEYQA8TdjQM9AJdmwaH81koqDJQKBgQDUf9XUcfsLwI4UPJEIQ0mHzd/u5SnNpmN2\ndJMNWMOMHaNAk6zYHoTOzhhcgK8GDMTH9yjlnPbZe8OVwlwvhJcxQAyEO5Z+SQXa\nEyfLx1tUG5yJab7Yif+jZmPbYl4u6icBQ3rvUVnFjtw08shWQeP0fvK9eNovKfi7\nQpKgzW/nTwKBgAJchHu0u226LLr2I2DOAMZyB4HcW44r9ntpUXlRXpPLV0dX7MIU\nJG0fpXbEeOhqNJHqlxgq8MpeMs0tPwd8mfREN1SrhR6Td5rYYFCqnvAcoShq2Qjg\nJZmSQVUeDoI5oRKkfLC9HM1C5AGAiVK2+8+msRRuj7fyrJeP/gHoS1ehAoGANH64\nFllqCUcyUjF8Kqxkt9XWIjAemZ0nKRY3Va698BlKQSO6KVGwwV4Mip2Hn1j8K+IV\nClQybxux/4caOuroZtRJw0jtLplfhrYAuMiw+SAxFYk4CkpdCsK6nHG6jqBtrlQ7\nRG+2W6WlJLdtYlG4vKe307LNQ6V8utYBXxQhNuUCgYEAniuL3H1hEkF5xkiC29/C\noe2ncSahT+AYYbpj+XV+mNAmYUCbbiGOKf8IRf1V546xvucH7Xd2nit8TbpzCkHO\noiyXCR/uMr0/MECYzu3gNAdZbI/8FSoVfOU7t3tkv0y9NXc797gFLDQFak9R+qWg\n2NXzWjKBS775OJIBGGExe18=\n-----END PRIVATE KEY-----\n",  // Correct parsing
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};



// ✅ Initialize Firebase Admin SDK only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DB_URL
    });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };