const admin = require("firebase-admin");
let serviceAccount;

try {
    // Production: Request JSON credentials from environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // Development: Local file
        // Check if file exists before requiring to avoid crash
        try {
            serviceAccount = require("./serviceAccountKey.json");
        } catch (e) {
            console.error("Local serviceAccountKey.json not found.");
        }
    }
} catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", error);
}

if (!serviceAccount) {
    throw new Error("Firebase Service Account credentials are missing. Set FIREBASE_SERVICE_ACCOUNT env var or add config/serviceAccountKey.json");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
