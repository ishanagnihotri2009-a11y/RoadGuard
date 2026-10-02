import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { COLLECTIONS } from './firestore.service';

export interface UserProfile {
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  points: number;
  tier: string;
  totalReports: number;
  achievements?: string[];
  verifiedReports: number;
  rank?: number;
  createdAt: string;
  phone?: string;
  city?: string;
}

export const authService = {
    updateProfile: async (userId: string, data: Partial<{ name: string; phone: string; city: string }>) => {
    // Strictly pick only permitted fields to prevent role/point tampering
    const safeData: any = {};
    if (data.name !== undefined) safeData.name = data.name;
    if (data.phone !== undefined) safeData.phone = data.phone;
    if (data.city !== undefined) safeData.city = data.city;
    
    await setDoc(doc(db, COLLECTIONS.USERS, userId), safeData, { merge: true });
  },
  register: async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const profile: UserProfile = {
      name,
      email,
      role: 'citizen',
      points: 0,
      tier: 'Rookie',
      totalReports: 0,
      verifiedReports: 0,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), profile);
    return { user, profile };
  },

  login: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profileDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));
    
    if (!profileDoc.exists()) {
      throw new Error("User profile not found");
    }
    
    return { user: userCredential.user, profile: profileDoc.data() as UserProfile };
  },

  logout: () => signOut(auth),

  onAuthStateChanged: (callback: (user: FirebaseUser | null, profile: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profileDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
        if (profileDoc.exists()) {
          callback(user, profileDoc.data() as UserProfile);
        } else {
          callback(user, null);
        }
      } else {
        callback(null, null);
      }
    });
  }
};



