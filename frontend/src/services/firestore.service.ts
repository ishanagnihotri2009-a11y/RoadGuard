import { collection, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'reports',
  REWARDS: 'rewards',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
  NOTIFICATIONS: 'notifications',
  SUSPICIOUS_REPORTS: 'suspicious_reports',
  ADMIN_ACTIONS: 'admin_actions'
} as const;

export const firestoreService = {
  getCollectionRef: (collectionName: keyof typeof COLLECTIONS) => collection(db, COLLECTIONS[collectionName]),
  getDocRef: (collectionName: keyof typeof COLLECTIONS, docId: string) => doc(db, COLLECTIONS[collectionName], docId)
};
