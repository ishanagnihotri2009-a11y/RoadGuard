import { collection, query, where, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  title: string
  description: string
  awardedAt: string
}

export const gamificationService = {
  subscribeToUserAchievements: (userId: string, callback: (achievements: UserAchievement[]) => void) => {
    const q = query(
      collection(db, 'user_achievements'),
      where('userId', '==', userId)
    )
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAchievement))
      achievements.sort((a, b) => new Date(b.awardedAt).getTime() - new Date(a.awardedAt).getTime())
      callback(achievements)
    })
  }
}