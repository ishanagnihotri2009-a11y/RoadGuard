import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { Loader2 } from 'lucide-react'

import Landing from './pages/Landing'
import Auth from './pages/Auth'

const CitizenDashboard = lazy(() => import('./pages/citizen/CitizenDashboard'))
const ReportFlow = lazy(() => import('./pages/citizen/ReportFlow'))
const ReportDetail = lazy(() => import('./pages/citizen/ReportDetail'))
const PotholeMap = lazy(() => import('./pages/citizen/PotholeMap'))
const MyReports = lazy(() => import('./pages/citizen/MyReports'))
const Rewards = lazy(() => import('./pages/citizen/Rewards'))
const Leaderboard = lazy(() => import('./pages/citizen/Leaderboard'))
const Achievements = lazy(() => import('./pages/citizen/Achievements'))
const Profile = lazy(() => import('./pages/citizen/Profile'))

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminReportDetail = lazy(() => import('./pages/admin/AdminReportDetail'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminCitizens = lazy(() => import('./pages/admin/AdminCitizens'))
const AdminSuspicious = lazy(() => import('./pages/admin/AdminSuspicious'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-140px)] items-center justify-center text-slate-400"><Loader2 size={32} className="animate-spin"/></div>}>
      {children}
    </Suspense>
  )
}

function MainRouter() {
  const { user, userRole, loading } = useApp()
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace /> : <Auth />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<SuspenseWrapper><CitizenDashboard /></SuspenseWrapper>} />
        <Route path="/report" element={<SuspenseWrapper><ReportFlow /></SuspenseWrapper>} />
        <Route path="/reports" element={<SuspenseWrapper><MyReports /></SuspenseWrapper>} />
        <Route path="/reports/:id" element={<SuspenseWrapper><ReportDetail /></SuspenseWrapper>} />
        <Route path="/map" element={<SuspenseWrapper><PotholeMap /></SuspenseWrapper>} />
        <Route path="/rewards" element={<SuspenseWrapper><Rewards /></SuspenseWrapper>} />
        <Route path="/achievements" element={<SuspenseWrapper><Achievements /></SuspenseWrapper>} />
        <Route path="/leaderboard" element={<SuspenseWrapper><Leaderboard /></SuspenseWrapper>} />
        <Route path="/profile" element={<SuspenseWrapper><Profile /></SuspenseWrapper>} />
      </Route>

      <Route element={<ProtectedRoute requireAdmin><Layout /></ProtectedRoute>}>
        <Route path="/admin" element={<SuspenseWrapper><AdminDashboard /></SuspenseWrapper>} />
        <Route path="/admin/reports" element={<SuspenseWrapper><AdminReports /></SuspenseWrapper>} />
        <Route path="/admin/reports/:id" element={<SuspenseWrapper><AdminReportDetail /></SuspenseWrapper>} />
        <Route path="/admin/analytics" element={<SuspenseWrapper><AdminAnalytics /></SuspenseWrapper>} />
        <Route path="/admin/users" element={<SuspenseWrapper><AdminCitizens /></SuspenseWrapper>} />
        <Route path="/admin/suspicious" element={<SuspenseWrapper><AdminSuspicious /></SuspenseWrapper>} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </BrowserRouter>
  )
}



