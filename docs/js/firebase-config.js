// Firebase Configuration
// Your Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyA54tuw-iRcuCquvkfuF5XlPSCFQJnUdsM",
    authDomain: "rokwil.firebaseapp.com",
    projectId: "rokwil",
    storageBucket: "rokwil.firebasestorage.app",
    messagingSenderId: "210198831386",
    appId: "1:210198831386:web:c18edaa2a18f3c8de54ca3",
    measurementId: "G-WNF17ERJCZ"
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

