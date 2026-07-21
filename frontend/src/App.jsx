import React, { useState } from 'react'
import { Shield, LayoutDashboard, Radio, Activity, Cpu } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col text-gray-100 relative bg-[#06070a] scanlines-overlay">
      
      {/* Top Header with Cyber-Tech Accents */}
      <header className="border-b border-indigo-500/10 bg-cyber-bg/75 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        {/* Decorative corner lines */}
        <div className="tech-corner-tr opacity-50"></div>
        <div className="tech-corner-bl opacity-50"></div>

        {/* Branding */}
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/30 neon-glow-indigo transition-transform duration-300 hover:scale-105">
            <Shield className="h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-xl tracking-wider bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                DIGITAL ARREST INTERCEPTOR
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-widest bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 uppercase">
                AGENT V1.2
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest">AI VOICE & SEMANTIC SCAM DEFENSE</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4.5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-glow-indigo'
                : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Radio className="h-4 w-4 text-indigo-400" />
            <span>CALL SIMULATOR</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('dashboard')
              triggerStatsReload()
            }}
            className={`px-4.5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-glow-indigo'
                : 'text-gray-400 border border-transparent hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-400" />
            <span>INCIDENT REGISTRY</span>
          </button>
        </nav>

        {/* System Health / Status Badges */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">GUARD ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
            <Cpu className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-widest">NEURAL ENG. UP</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden relative z-20 flex flex-col justify-start">
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

      {/* Technical Footer */}
      <footer className="py-4 px-6 border-t border-white/5 bg-[#050608] text-center text-[10px] text-gray-500 font-mono flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 relative z-20">
        <div>DIGITAL ARREST INTERCEPTOR © 2026. SECURED THREAT INTERNET GATEWAY.</div>
        <div className="flex space-x-4 text-gray-600">
          <span>PORT: 5173 (VITE)</span>
          <span>•</span>
          <span>STATUS: ENCRYPTED LINK</span>
        </div>
      </footer>
    </div>
  )
}

export default App
