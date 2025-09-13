'use client'

import { Search, Settings, Bell, User, Clock, MapPin, Home, Map, Users, Building2, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useDashboardStore from '@/lib/store'
import { cn } from '@/lib/utils'

export default function Header() {
  const { region, setRegion } = useDashboardStore()
  const pathname = usePathname()

  return (
    <header className="h-16 bg-white border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-xl font-semibold">The Eye</h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link 
            href="/"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              pathname === '/' 
                ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
                : 'text-[var(--text-muted)] hover:bg-gray-50'
            )}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            href="/li"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              pathname === '/li' 
                ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
                : 'text-[var(--text-muted)] hover:bg-gray-50'
            )}
          >
            <Map className="w-4 h-4" />
            Locations
          </Link>
          <Link 
            href="/pi"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              pathname.startsWith('/pi')
                ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
                : 'text-[var(--text-muted)] hover:bg-gray-50'
            )}
          >
            <Users className="w-4 h-4" />
            Persons
          </Link>
          <Link 
            href="/ci"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              pathname.startsWith('/ci')
                ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
                : 'text-[var(--text-muted)] hover:bg-gray-50'
            )}
          >
            <Building2 className="w-4 h-4" />
            Companies
          </Link>
          <Link 
            href="/monitoring"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              pathname.startsWith('/monitoring')
                ? 'bg-[var(--primary-100)] text-[var(--primary-600)]'
                : 'text-[var(--text-muted)] hover:bg-gray-50'
            )}
          >
            <Shield className="w-4 h-4" />
            Monitoring
            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">GOV</span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search person, company, or location..."
            className="input-field pl-10 w-80"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Clock className="w-4 h-4" />
          <span>Last 24h</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent outline-none font-medium"
          >
            <option value="jakarta">Jakarta</option>
            <option value="surabaya">Surabaya</option>
            <option value="bandung">Bandung</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <User className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
    </header>
  )
}