import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, UserProfile } from '../services/auth.service'
import { User as FirebaseUser } from 'firebase/auth'

export type UserRole = 'citizen' | 'admin' | null

interface AppContextType {
  user: FirebaseUser | null
  profile: UserProfile | null
  userRole: UserRole
  loading: boolean
  selectedReportId: string | null
  setSelectedReportId: (id: string | null) => void
  view: string
  setView: (v: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u, p) => {
      setUser(u)
      setProfile(p)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const userRole = profile?.role ?? null;

  const setView = (v: string) => {
     const pathMap: Record<string, string> = {
       'landing': '/',
       'login': '/login',
       'citizen-dashboard': '/dashboard',
       'report-flow': '/report',
       'pothole-map': '/map',
       'my-reports': '/reports',
       'rewards': '/rewards',
       'leaderboard': '/leaderboard',
       'achievements': '/achievements',
       'profile': '/profile',
       'report-detail': '/reports/' + (selectedReportId || 'default'),
       'admin-dashboard': '/admin',
       'admin-reports': '/admin/reports',
       'admin-report-detail': '/admin/reports/' + (selectedReportId || 'default'),
       'admin-analytics': '/admin/analytics',
       'admin-citizens': '/admin/users',
       'admin-suspicious': '/admin/suspicious'
     };
     if (pathMap[v]) {
        navigate(pathMap[v]);
     } else {
        console.warn('Unknown view:', v);
     }
  }

  return (
    <AppContext.Provider value={{ user, profile, userRole, loading, selectedReportId, setSelectedReportId, view: '', setView }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}


