import { collection, query, where, onSnapshot, DocumentData, QuerySnapshot, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface RewardTransaction {
  id: string
  userId: string
  reportId: string
  amount: number
  reason: string
  createdAt: string
}

export const rewardsService = {
  subscribeToUserRewards: (userId: string, callback: (rewards: RewardTransaction[]) => void) => {
    const q = query(
      collection(db, 'rewards'),
      where('userId', '==', userId)
    )
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RewardTransaction))
      rewards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      callback(rewards)
    })
  }
}