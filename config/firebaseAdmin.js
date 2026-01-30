const admin = require("firebase-admin");
let serviceAccount;

try {
    // Production: Request JSON credentials from environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // Development: Local file
        serviceAccount = require("./serviceAccountKey.json");
    }
} catch (error) {
    console.error("Failed to load Firebase credentials:", error);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
