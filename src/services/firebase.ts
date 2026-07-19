import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const app = isFirebaseConfigured ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) : null;
export const auth = app ? getAuth(app) : null;

export const getFirebaseErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Firebase authentication failed.';
};

export const signInToAccount = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Add your VITE_FIREBASE_* values to the environment file.');
  }

  return signInWithEmailAndPassword(auth, email, password);
};

export const createAccount = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Add your VITE_FIREBASE_* values to the environment file.');
  }

  return createUserWithEmailAndPassword(auth, email, password);
};

export const signOutOfAccount = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Add your VITE_FIREBASE_* values to the environment file.');
  }

  return signOut(auth);
};

export type FirebaseUser = User;
