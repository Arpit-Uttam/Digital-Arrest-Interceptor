import React, { useState } from 'react'
import { Shield, LayoutDashboard, Radio, Activity } from 'lucide-react'
import CallSimulator from './components/CallSimulator'
import Dashboard from './components/Dashboard'

function App() {
  const [activeTab, setActiveTab] = useState('simulator') // simulator, dashboard
  const [currentSessionId, setCurrentSessionId] = useState(() => `session_${Math.random().toString(36).substr(2, 9)}`)
  const [triggerRefreshStats, setTriggerRefreshStats] = useState(0)

  const handleResetSession = () => {
    setCurrentSessionId(`session_${Math.random().toString(36).substr(2, 9)}`)
  }

  const triggerStatsReload = () => {
    setTriggerRefreshStats(prev => prev + 1)
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-100 relative">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-cyber-bg/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/30 neon-glow-indigo">
            <Shield className="h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-400 bg-clip-text text-transparent">
              DIGITAL ARREST INTERCEPTOR
            </h1>
            <p className="text-[11px] text-gray-400 font-mono tracking-wider">AI PUBLIC SAFETY SYSTEM</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'simulator'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-glow-indigo'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Call Simulator</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('dashboard')
              triggerStatsReload()
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-glow-indigo'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Incident Database</span>
          </button>
        </nav>

        {/* Real-time Status Badges */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">GUARD ACTIVE</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            V1.0 (SECURE)
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden">
        {activeTab === 'simulator' ? (
          <CallSimulator 
            sessionId={currentSessionId} 
            onResetSession={handleResetSession}
            onIncidentLogged={triggerStatsReload}
          />
        ) : (
          <Dashboard key={triggerRefreshStats} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-white/5 bg-[#08090d] text-center text-xs text-gray-500 font-mono">
        Digital Arrest Interceptor © 2026. Consented Audio Threat Mitigation Companion.
      </footer>
    </div>
  )
}

export default App
