import { collection, doc, setDoc, query, where, orderBy, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'
import { limit } from 'firebase/firestore';
import { COLLECTIONS } from './firestore.service';

export interface Report {
  statusHistory?: { status: string; timestamp: string; changedBy: string; reason?: string }[];
  id: string;
  userId: string;
  street: string;
  area: string;
  coords: { lat: number, lng: number };
  status: 'pending' | 'verified' | 'duplicate' | 'invalid';
  severity: 'high' | 'medium' | 'low';
  date: string;
  imageUrl: string;
  points: number;
  confidence: number;
  description?: string;
  count?: number;
  potholeCount?: number;
  potholeDetected?: boolean;
  annotatedImageUrl?: string;
  processedAt?: string;
  aiError?: string;
  roadCondition?: string;
  duplicate?: boolean;
  aiData?: {
    model: string;
    inferenceMs: number;
    avgDiameter: string;
    depthEst: string;
  };
}

export const reportsService = {
  createReport: async (reportData: Omit<Report, 'id'>) => {
    const reportRef = doc(collection(db, COLLECTIONS.REPORTS));
    await setDoc(reportRef, {
      ...reportData,
      id: reportRef.id,
    });
    return reportRef.id;
  },

  subscribeToReport: (reportId: string, callback: (report: Report | null) => void, onError?: (error: Error) => void) => {
    return onSnapshot(doc(db, COLLECTIONS.REPORTS, reportId), (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as Report);
      } else {
        callback(null);
      }
    });
  },

  subscribeToUserReports: (userId: string, callback: (reports: Report[]) => void, onError?: (error: Error) => void) => {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('userId', '==', userId), limit(100)
    );
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(reports);
      }, onError);
  },

    subscribeToMapReports: (callback: (reports: Report[]) => void, onError?: (error: Error) => void) => {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('status', 'in', ['verified', 'under_review', 'pending', 'processing']),
      limit(200)
    );
    return onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      callback(reports);
      }, onError);
  },
  subscribeToPublicReports: (callback: (reports: Report[]) => void, onError?: (error: Error) => void) => {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('status', '==', 'verified'), limit(100)
    );
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      callback(reports);
      }, onError);
  }
};






