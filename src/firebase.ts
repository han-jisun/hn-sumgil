import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEpTuE7nwgfXCMX2q-BwDy6ah0oxNRUTw",
  authDomain: "hn-sumgil.firebaseapp.com",
  projectId: "hn-sumgil",
  storageBucket: "hn-sumgil.firebasestorage.app",
  messagingSenderId: "102458186374",
  appId: "1:102458186374:web:64f8e15eaf2bc77a68cf07",
  measurementId: "G-XYV9GPX3V7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
