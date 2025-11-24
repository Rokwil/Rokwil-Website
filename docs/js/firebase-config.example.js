// Firebase Configuration Template
// Copy this file to firebase-config.js and fill in your Firebase project credentials
// Get these values from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID" // Optional: Only if using Google Analytics
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
// Storage is optional - set to null if not available
let storage = null;
try {
    storage = firebase.storage();
} catch (e) {
    console.warn('Firebase Storage not available. You can use image/video URLs instead.');
}
const auth = firebase.auth();

