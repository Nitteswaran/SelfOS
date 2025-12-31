import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (singleton)
// We check if we are on the client and have a valid config, otherwise we might be in build time or unconfigured
let app: ReturnType<typeof initializeApp>;
let auth: ReturnType<typeof getAuth>;
let db: ReturnType<typeof initializeFirestore>;
let storage: ReturnType<typeof getStorage>;
let functions: ReturnType<typeof getFunctions>;

try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = initializeFirestore(app, {});
    storage = getStorage(app);
    functions = getFunctions(app);
} catch (e) {
    console.warn("Firebase initialization failed:", e);
    // In case of failure (e.g. invalid config), we explicitly don't export broken instances if possible, 
    // but due to ESM constraints we must export something.
    // The app will likely fail at runtime when using these, but at least won't crash immediately on import.
}

// Check if we are using the mock config
const isMockKey = !firebaseConfig.apiKey;
export const isConfigured = !isMockKey;

export { auth, db, storage, functions };
export default app!;
