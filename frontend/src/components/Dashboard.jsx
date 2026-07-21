import React, { useState, useEffect } from 'react'
import { Trash2, AlertOctagon, ShieldCheck, CheckCircle, ExternalLink, RefreshCw, BarChart2, Search, SlidersHorizontal, ChevronDown, ChevronUp, FileText, Download, ShieldAlert, Cpu } from 'lucide-react'

// Helper component for mini SVG sparklines in dashboard cards
function Sparkline({ color, points }) {
  return (
    <svg className="w-16 h-8 opacity-40 ml-auto" viewBox="0 0 100 30">
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Dashboard() {
  const [incidents, setIncidents] = useState([])
  const [stats, setStats] = useState({
    total_scams: 0,
    average_risk: 0.0,
    total_dismissed: 0,
    total_reported: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all') // all, critical, deepfake, safe
  const [expandedId, setExpandedId] = useState(null)

  // Load stats and incidents on mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch incidents list
      const incRes = await fetch('/api/incidents')
      if (!incRes.ok) throw new Error(`HTTP error ${incRes.status}`)
      const incData = await incRes.json()
      setIncidents(incData)

      // Fetch dashboard metrics
      const statsRes = await fetch('/api/incidents/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      } else {
        // Fallback local calculations
        calculateLocalStats(incData)
      }
    } catch (err) {
      console.warn("Failed to contact backend API. Loading simulated logs.", err)
      // Load standard mock logs for offline demo fallback
      loadSimulatedLogs()
    } finally {
      setLoading(false)
    }
  }

  const calculateLocalStats = (logs) => {
    const totalScams = logs.filter(i => i.risk_score >= 75).length
    const totalReported = logs.filter(i => i.status === 'reported').length
    const totalDismissed = logs.filter(i => i.status === 'dismissed').length
    const avgRisk = logs.length > 0 ? (logs.reduce((acc, curr) => acc + curr.risk_score, 0) / logs.length) : 0
    
    setStats({
      total_scams: totalScams,
      average_risk: Math.round(avgRisk * 10) / 10,
      total_dismissed: totalDismissed,
      total_reported: totalReported
    })
  }

  const loadSimulatedLogs = () => {
    const mockLogs = [
      {
        id: 101,
        session_id: "session_fake_cbi",
        transcript: "This is the CBI Head Office in Mumbai. Your account has been found in money laundering. Lock the door and don't tell family members. Transfer 50,000 security deposit.",
        risk_score: 95.0,
        matched_patterns: ["Authority Impersonation", "Isolation", "Urgency", "Payment Coercion"],
        reasoning: "Impersonates CBI agency, orders seclusion, and demands immediate financial deposit under threat of arrest.",
        is_ai_voice: false,
        deepfake_score: 0.04,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "reported"
      },
      {
        id: 102,
        session_id: "session_fake_cust",
        transcript: "Mumbai Customs calling. A courier containing synthetic drugs has been seized. You face immediate arrest. Share bank balance or pay auditing fine.",
        risk_score: 85.0,
        matched_patterns: ["Authority Impersonation", "Urgency", "Payment Coercion"],
        reasoning: "Impersonates airport customs officials and enforces payment coercion under jail threats.",
        is_ai_voice: true,
        deepfake_score: 0.96,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: "flagged"
      },
      {
        id: 103,
        session_id: "session_genuine_bank",
        transcript: "Hello, calling from ICICI bank customer help desk. We noticed a suspicious credit card purchase of 45,000 rupees. Did you authorize this? No password is required.",
        risk_score: 12.0,
        matched_patterns: [],
        reasoning: "Authentic transaction verification request. No coercion or credential requests.",
        is_ai_voice: false,
        deepfake_score: 0.02,
        timestamp: new Date(Date.now() - 12000000).toISOString(),
        status: "dismissed"
      }
    ]
    setIncidents(mockLogs)
    calculateLocalStats(mockLogs)
  }

  const handleUpdateStatus = async (id, newStatus) => {
    // Optimistic UI update
    setIncidents(prev => 
      prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc)
    )

    try {
      const response = await fetch(`/api/incidents/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        // Reload dashboard stats
        const statsRes = await fetch('/api/incidents/stats')
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        } else {
          calculateLocalStats(incidents.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc))
        }
      }
    } catch (e) {
      console.warn("Could not post status update to server. Updated locally.")
      calculateLocalStats(incidents.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc))
    }
  }

  // Generate security audit dossier text file download
  const handleExportDossier = (inc) => {
    const reportText = `====================================================
DIGITAL ARREST INTERCEPTOR - SAFETY DOSSIER
====================================================
Timestamp: ${new Date(inc.timestamp).toLocaleString('en-IN')}
Session ID: ${inc.session_id}
Threat Index Ratio: ${inc.risk_score}%
Security Status: ${inc.status.toUpperCase()}

VOICE MATRIX ANALYSIS:
-------------------------------------------
Synthetic/Deepfake Voice Detected: ${inc.is_ai_voice ? 'YES' : 'NO'}
AI Voice Cloned Probability: ${Math.round(inc.deepfake_score * 100)}%

SEMANTIC SCAM PATTERNS IDENTIFIED:
-------------------------------------------
${inc.matched_patterns.length > 0 
  ? inc.matched_patterns.map(p => `[!] ${p}`).join('\n')
  : 'None'}

THREAT ANALYSIS REASONING:
-------------------------------------------
${inc.reasoning || 'No details processed.'}

DECODED CALL TRANSCRIPT:
-------------------------------------------
"${inc.transcript}"

====================================================
NCRB Cyber helpline: 1930 | cybercrime.gov.in
====================================================`

    const element = document.createElement("a")
    const file = new Blob([reportText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `safety_dossier_${inc.session_id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reported':
        return (
          <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-bold font-mono px-2 py-0.5 rounded-lg uppercase tracking-wider">
            🚨 Reported
          </span>
        )
      case 'dismissed':
        return (
          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold font-mono px-2 py-0.5 rounded-lg uppercase tracking-wider">
            🛡️ Safe
          </span>
        )
      default:
        return (
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold font-mono px-2 py-0.5 rounded-lg uppercase tracking-wider">
            ⚠️ Threat
          </span>
        )
    }
  }

  // Filter and search incidents
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.session_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.reasoning && inc.reasoning.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeFilter === 'all') return matchesSearch
    if (activeFilter === 'critical') return matchesSearch && inc.risk_score >= 70
    if (activeFilter === 'deepfake') return matchesSearch && inc.is_ai_voice
    if (activeFilter === 'safe') return matchesSearch && inc.risk_score < 40

    return matchesSearch
  })

  return (
    <div className="flex flex-col space-y-6 overflow-hidden">
      
      {/* 4 Dashboard Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scams Blocked */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex items-stretch min-h-[110px] card-scale">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <span className="text-[9px] font-mono font-bold text-rose-400 tracking-widest uppercase">SCAMS BLOCKED</span>
              <h3 className="text-3xl font-black mt-1 text-rose-500 tracking-tight">{stats.total_scams}</h3>
            </div>
            <div className="text-[8px] text-gray-500 font-mono tracking-wider">THREAT LEVEL &ge; 75%</div>
          </div>
          <div className="flex items-end flex-shrink-0">
            <Sparkline color="#ef4444" points="M5 25 Q 25 10, 45 20 T 85 5" />
          </div>
        </div>

        {/* Average Risk Index */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex items-stretch min-h-[110px] card-scale">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <span className="text-[9px] font-mono font-bold text-indigo-400 tracking-widest uppercase">AVG RISK INDEX</span>
              <h3 className="text-3xl font-black mt-1 text-indigo-400 tracking-tight">{stats.average_risk}%</h3>
            </div>
            <div className="text-[8px] text-gray-500 font-mono tracking-wider">CUMULATIVE TELEMETRY</div>
          </div>
          <div className="flex items-end flex-shrink-0">
            <Sparkline color="#6366f1" points="M5 20 Q 30 25, 55 15 T 85 10" />
          </div>
        </div>

        {/* Reported to 1930 */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex items-stretch min-h-[110px] card-scale">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <span className="text-[9px] font-mono font-bold text-amber-500 tracking-widest uppercase">HELPLINE REPORTS</span>
              <h3 className="text-3xl font-black mt-1 text-amber-500 tracking-tight">{stats.total_reported}</h3>
            </div>
            <div className="text-[8px] text-gray-500 font-mono tracking-wider">DIALED 1930 NCRB</div>
          </div>
          <div className="flex items-end flex-shrink-0">
            <Sparkline color="#f59e0b" points="M5 25 Q 35 25, 60 10 T 85 5" />
          </div>
        </div>

        {/* Safe/Dismissed Calls */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex items-stretch min-h-[110px] card-scale">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest uppercase">DISMISSED SAFE</span>
              <h3 className="text-3xl font-black mt-1 text-emerald-400 tracking-tight">{stats.total_dismissed}</h3>
            </div>
            <div className="text-[8px] text-gray-500 font-mono tracking-wider">CLEARED SIGNATURES</div>
          </div>
          <div className="flex items-end flex-shrink-0">
            <Sparkline color="#10b981" points="M5 28 Q 20 28, 50 18 T 85 15" />
          </div>
        </div>

      </div>

      {/* FILTER & REGISTRY CONTAINER */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col space-y-4 relative">
        <div className="tech-corner-tr opacity-25"></div>

        {/* Registry Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3 gap-3.5">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-xs font-black font-mono text-indigo-400 tracking-wider uppercase">
              THREAT REGISTRY DATABASE
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search sessions, terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 w-full sm:w-[220px]"
              />
            </div>
            
            {/* Refresh Button */}
            <button 
              onClick={fetchDashboardData}
              className="p-2 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-gray-400 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-mono font-bold cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>RELOAD DB</span>
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5 overflow-x-auto">
          {[
            { id: 'all', label: 'ALL LOGS' },
            { id: 'critical', label: 'CRITICAL THREATS (≥70%)' },
            { id: 'deepfake', label: 'AI DEEPFAKES' },
            { id: 'safe', label: 'CLEARED SAFE' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id)
                setExpandedId(null)
              }}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-glow-indigo'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Logs Table / Cards */}
        {loading ? (
          <div className="text-center py-20 text-xs text-gray-500 font-mono animate-pulse">
            Executing query against local SQLite security database...
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic text-xs font-mono">
            No incident threat dossiers matched the filters.
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 uppercase font-mono tracking-wider text-[9px]">
                  <th className="py-2.5 px-3">Date / Time</th>
                  <th className="py-2.5 px-3">Session & Score</th>
                  <th className="py-2.5 px-3">Primary Transcript Snippet</th>
                  <th className="py-2.5 px-3">Acoustic Signature</th>
                  <th className="py-2.5 px-3">Risk State</th>
                  <th className="py-2.5 px-3 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredIncidents.map((inc) => {
                  const dateStr = new Date(inc.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })
                  const riskColor = inc.risk_score >= 70 ? 'text-rose-500' : inc.risk_score >= 40 ? 'text-amber-500' : 'text-emerald-400'
                  const isExpanded = expandedId === inc.id
                  
                  return (
                    <React.Fragment key={inc.id}>
                      {/* Main Entry Row */}
                      <tr 
                        onClick={() => setExpandedId(isExpanded ? null : inc.id)}
                        className={`hover:bg-white/[0.02] cursor-pointer transition-all border-l-2 ${
                          isExpanded 
                            ? 'bg-white/[0.015]' 
                            : 'border-transparent'
                        } ${
                          inc.risk_score >= 70 
                            ? 'hover:border-rose-500/50' 
                            : inc.risk_score >= 40 
                            ? 'hover:border-amber-500/50' 
                            : 'hover:border-emerald-500/50'
                        }`}
                      >
                        {/* Timestamp */}
                        <td className="py-3.5 px-3 text-gray-400 whitespace-nowrap">{dateStr}</td>
                        
                        {/* Session ID + Risk Score */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="font-bold text-gray-300">{inc.session_id.slice(0, 16)}...</div>
                          <div className="mt-1 flex items-center space-x-1.5">
                            <span className={`font-black ${riskColor}`}>{inc.risk_score}%</span>
                            <span className="text-[9px] text-gray-500">score</span>
                          </div>
                        </td>

                        {/* Transcript Snippet */}
                        <td className="py-3.5 px-3 max-w-[160px] sm:max-w-xs md:max-w-md">
                          <p className="text-gray-300 truncate leading-normal">
                            {inc.transcript}
                          </p>
                          <div className="mt-1 text-[9px] text-indigo-400 font-semibold italic truncate">
                            {inc.reasoning || "Diagnostic logs compiled."}
                          </div>
                        </td>

                        {/* Deepfake Voice Audit Signature */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {inc.is_ai_voice ? (
                            <div className="flex items-center space-x-1 text-rose-400 font-bold text-[9px] uppercase">
                              <Cpu className="h-3 w-3" />
                              <span>AI CLONE ({Math.round(inc.deepfake_score * 100)}%)</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-500 text-[9px] uppercase">
                              <span>NATURAL AUDIO</span>
                            </div>
                          )}
                        </td>

                        {/* Threat Status Badge */}
                        <td className="py-3.5 px-3 whitespace-nowrap">{getStatusBadge(inc.status)}</td>

                        {/* Expand Icon */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-bold">
                            <span className="text-[9px] uppercase tracking-wider hidden sm:inline-block">Dossier</span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </td>
                      </tr>

                      {/* Collapsible Dossier Detail Drawer */}
                      {isExpanded && (
                        <tr className="bg-white/[0.01]">
                          <td colSpan="6" className="py-4 px-5 border-l-2 border-indigo-500/20">
                            <div className="flex flex-col space-y-4 animate-[fadeIn_0.25s_ease-out]">
                              
                              {/* Header Area */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-2 gap-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4.5 w-4.5 text-indigo-400" />
                                  <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest">
                                    THREAT COMPLIANCE AUDIT SHEET (ID: #{inc.id})
                                  </h4>
                                </div>
                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                  <button
                                    onClick={() => handleExportDossier(inc)}
                                    className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all font-mono font-bold text-[9px] flex items-center justify-center space-x-1.5 cursor-pointer"
                                  >
                                    <Download className="h-3 w-3" />
                                    <span>DOWNLOAD REPORT</span>
                                  </button>
                                </div>
                              </div>

                              {/* Dossier Grid Details */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                
                                {/* Full Transcript (7 cols) */}
                                <div className="md:col-span-7 bg-black/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between">
                                  <div>
                                    <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">DECODED DIALOGUE FLOW</span>
                                    <p className="text-[11px] text-gray-200 leading-relaxed mt-2 select-text italic">
                                      "{inc.transcript}"
                                    </p>
                                  </div>
                                  <div className="mt-3.5 border-t border-white/5 pt-2 flex items-center space-x-2 text-[9px]">
                                    <span className="text-gray-500">SIGNATURE CHECKS:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {inc.matched_patterns.length > 0 ? (
                                        inc.matched_patterns.map((p, i) => (
                                          <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[8px]">
                                            {p.toUpperCase()}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-emerald-400">NOMINAL STATE</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Matrix Compliance (5 cols) */}
                                <div className="md:col-span-5 bg-black/40 p-3.5 rounded-xl border border-white/5 flex flex-col justify-between space-y-3">
                                  <div>
                                    <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">MATRIX COMPLIANCE CRITERIA</span>
                                    
                                    <div className="mt-3 space-y-2">
                                      <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Coercion Semantics Match:</span>
                                        <span className={`font-bold ${inc.risk_score >= 70 ? 'text-rose-400' : inc.risk_score >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{inc.risk_score}%</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1">
                                        <span className="text-gray-400">Acoustic Deepfake Signature:</span>
                                        <span className={`font-bold ${inc.is_ai_voice ? 'text-rose-400' : 'text-gray-500'}`}>{inc.is_ai_voice ? `${Math.round(inc.deepfake_score * 100)}% CLONE` : '0% (NATURAL)'}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] pb-1">
                                        <span className="text-gray-400">System Recommendation:</span>
                                        <span className={`font-bold ${inc.risk_score >= 70 ? 'text-rose-400' : 'text-emerald-400'}`}>{inc.risk_score >= 70 ? 'TERMINATE & BLOCK' : 'NOMINAL SAFE'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Compliance Action Controls */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                    {inc.status !== 'reported' && (
                                      <button
                                        onClick={() => handleUpdateStatus(inc.id, 'reported')}
                                        className="flex-1 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-all font-mono font-bold text-[9px] flex items-center justify-center space-x-1 cursor-pointer shadow-glow-red"
                                      >
                                        <AlertOctagon className="h-3 w-3" />
                                        <span>ESCALATE (1930)</span>
                                      </button>
                                    )}
                                    {inc.status !== 'dismissed' && (
                                      <button
                                        onClick={() => handleUpdateStatus(inc.id, 'dismissed')}
                                        className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all font-mono font-bold text-[9px] flex items-center justify-center space-x-1 cursor-pointer"
                                      >
                                        <CheckCircle className="h-3 w-3" />
                                        <span>DISMISS LOG</span>
                                      </button>
                                    )}
                                  </div>

                                </div>

                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard
