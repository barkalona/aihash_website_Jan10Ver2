import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const submitFeedback = async (data: any) => {
  const feedbackRef = ref(database, 'feedback');
  return push(feedbackRef, {
    ...data,
    timestamp: serverTimestamp(),
  });
};

export const submitWaitlist = async (data: any) => {
  const waitlistRef = ref(database, 'waitlist');
  return push(waitlistRef, {
    ...data,
    timestamp: serverTimestamp(),
  });
};

export const trackAnalytics = async (eventName: string, data: any) => {
  const analyticsRef = ref(database, 'analytics');
  return push(analyticsRef, {
    eventName,
    ...data,
    timestamp: serverTimestamp(),
  });
};