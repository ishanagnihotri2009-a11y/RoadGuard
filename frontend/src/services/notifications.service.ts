import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedReportId?: string
}

export const notificationsService = {
  subscribeToUserNotifications: (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]
      callback(data)
    })
  },
  
  markAsRead: async (notificationId: string) => {
    const ref = doc(db, 'notifications', notificationId)
    await updateDoc(ref, { read: true })
  },
  
  markAllAsRead: async (userId: string, notifications: Notification[]) => {
    const unread = notifications.filter(n => !n.read)
    if (unread.length === 0) return
    
    const batch = writeBatch(db)
    unread.forEach(n => {
      batch.update(doc(db, 'notifications', n.id), { read: true })
    })
    await batch.commit()
  }
}