import { collection, query, orderBy, limit, getDocs, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface LeaderboardUser {
  id: string
  name: string
  points: number
  tier: string
  totalReports: number
  verifiedReports: number
  rank?: number
}

export const leaderboardService = {
  subscribeToLeaderboard: (callback: (users: LeaderboardUser[]) => void) => {
    const q = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(100) // Top 100
    )
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const users = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        name: doc.data().name || 'Anonymous',
        points: doc.data().points || 0,
        tier: doc.data().tier || 'Rookie',
        totalReports: doc.data().totalReports || 0,
        verifiedReports: doc.data().verifiedReports || 0,
        rank: index + 1
      } as LeaderboardUser))
      callback(users)
    })
  }
}