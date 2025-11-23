// Firebase Configuration
// Your Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyDOuXRhmeNHS65EIPLq7v4ad0L6cwKTQOk",
    authDomain: "rokwil.firebaseapp.com",
    projectId: "rokwil",
    storageBucket: "rokwil.firebasestorage.app",
    messagingSenderId: "210198831386",
    appId: "1:210198831386:web:46f7956931ff84dae54ca3"
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

