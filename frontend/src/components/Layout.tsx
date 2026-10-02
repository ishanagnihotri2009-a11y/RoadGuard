import type { ReactNode } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { authService } from '../services/auth.service'
import {
  LayoutDashboard, MapPin, FileText, Trophy, Star, Medal, User,
  LogOut, Shield, BarChart2, Users, AlertTriangle, Menu, X, ChevronRight,
  Plus
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { notificationsService, Notification } from '../services/notifications.service'
import { Bell } from 'lucide-react'

interface NavItem { label: string; path: string; icon: ReactNode }

const citizenNav: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Pothole Map', path: '/map', icon: <MapPin size={18} /> },
  { label: 'My Reports', path: '/reports', icon: <FileText size={18} /> },
  { label: 'Rewards', path: '/rewards', icon: <Trophy size={18} /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <Star size={18} /> },
  { label: 'Achievements', path: '/achievements', icon: <Medal size={18} /> },
  { label: 'Profile', path: '/profile', icon: <User size={18} /> },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Reports', path: '/admin/reports', icon: <FileText size={18} /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart2 size={18} /> },
  { label: 'Citizens', path: '/admin/users', icon: <Users size={18} /> },
  { label: 'Suspicious', path: '/admin/suspicious', icon: <AlertTriangle size={18} /> },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { userRole, profile } = useApp()
  const nav = userRole === 'admin' ? adminNav : citizenNav
  const isAdmin = userRole === 'admin'

  const handleNav = (path: string) => {
    navigate(path)
    onClose?.()
  }

  const handleLogout = async () => {
    await authService.logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-sm font-display text-slate-800">RoadGuard</span>
            <p className="text-xs text-slate-400">{isAdmin ? 'Admin Portal' : 'Citizen App'}</p>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="px-4 pt-4">
          <button
            onClick={() => handleNav('/report')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#0891b2' }}
          >
            <Plus size={16} /> Report Pothole
          </button>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {nav.map(item => {
          const active = location.pathname === item.path || (location.pathname.startsWith(item.path + '/') && item.path !== '/' && item.path !== '/admin')
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all " +
                (active
                  ? 'text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700')
              }
              style={active ? { backgroundColor: '#1e3a5f' } : {}}
            >
              <span className={active ? 'text-cyan-300' : ''}>{item.icon}</span>
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto text-slate-400" />}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            {profile?.name?.charAt(0).toUpperCase() || (isAdmin ? 'A' : 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{profile?.name || (isAdmin ? 'Admin User' : 'Citizen')}</p>
            <p className="text-xs text-slate-400 truncate">{profile?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation()
  const { userRole, profile } = useApp()
  const allNav = [...citizenNav, ...adminNav]
  const current = allNav.find(n => n.path === location.pathname || (location.pathname.startsWith(n.path + '/') && n.path !== '/' && n.path !== '/admin'))
  const isAdmin = userRole === 'admin'

  return (
    <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold font-display text-slate-800">{current?.label ?? 'RoadGuard'}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">{isAdmin ? 'Admin Portal' : 'Citizen Dashboard'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500">AI Online</span>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0891b2' }}>
          {profile?.name?.charAt(0).toUpperCase() || (isAdmin ? 'A' : 'U')}
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = citizenNav.slice(0, 5)
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-20 px-2 py-1 safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {items.map(item => {
          const active = location.pathname === item.path || (location.pathname.startsWith(item.path + '/') && item.path !== '/' && item.path !== '/admin')
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all"
            >
              <span style={{ color: active ? '#0891b2' : '#94a3b8' }}>{item.icon}</span>
              <span className={"text-[10px] font-medium " + (active ? 'text-cyan-600' : 'text-slate-400')}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function Layout() {
  const { userRole } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = userRole === 'admin'

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-white border-r border-slate-100 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-56 bg-white h-full shadow-xl z-50">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
            >
              <X size={18} />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className={"flex-1 overflow-y-auto p-4 lg:p-6 " + (!isAdmin ? 'pb-24 lg:pb-6' : '')}>
          <Outlet />
        </main>
        {!isAdmin && <BottomNav />}
      </div>
    </div>
  )
}


