import React, { useState, useEffect } from 'react'
import { Trash2, AlertOctagon, ShieldCheck, CheckCircle, ExternalLink, RefreshCw, BarChart2 } from 'lucide-react'

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
      // Load standard mock logs for offline demo fallback so that the dashboard doesn't look empty!
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
        reasoning: "Impersonates CBI agency, orders seclusion, and demands immediate financial deposit.",
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reported':
        return (
          <span className="bg-rose-500/15 border border-rose-500/20 text-rose-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
            Reported to 1930
          </span>
        )
      case 'dismissed':
        return (
          <span className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
            Dismissed
          </span>
        )
      default:
        return (
          <span className="bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
            Flagged Threat
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col space-y-6 overflow-hidden">
      
      {/* 4 Dashboard Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Scams Blocked */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">Scams Blocked</span>
            <h3 className="text-3xl font-black mt-1 text-rose-500">{stats.total_scams}</h3>
          </div>
          <div className="text-[10px] text-gray-500 font-mono mt-2">THREAT SCORE &ge; 75%</div>
        </div>

        {/* Average Risk Index */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">Avg Risk Index</span>
            <h3 className="text-3xl font-black mt-1 text-indigo-400">{stats.average_risk}%</h3>
          </div>
          <div className="text-[10px] text-gray-500 font-mono mt-2">CUMULATIVE METRIC</div>
        </div>

        {/* Reported to 1930 */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">Helpline Reports</span>
            <h3 className="text-3xl font-black mt-1 text-amber-500">{stats.total_reported}</h3>
          </div>
          <div className="text-[10px] text-gray-500 font-mono mt-2">DIALED 1930 HOTLINE</div>
        </div>

        {/* Safe/Dismissed Calls */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase">Dismissed Safe</span>
            <h3 className="text-3xl font-black mt-1 text-emerald-400">{stats.total_dismissed}</h3>
          </div>
          <div className="text-[10px] text-gray-500 font-mono mt-2">CLEARED CONVERSATIONS</div>
        </div>

      </div>

      {/* HISTORICAL INCIDENT LOG LIST */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4">
        
        {/* Dashboard Header controls */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold font-mono text-indigo-400 tracking-widest uppercase">
              THREAT REGISTRY DATABASE
            </h3>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white transition-all flex items-center space-x-1 text-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Registry</span>
          </button>
        </div>

        {/* Logs Table/Card */}
        {loading ? (
          <div className="text-center py-16 text-xs text-gray-500 font-mono animate-pulse">
            Querying local SQLite security database...
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-16 text-gray-500 italic text-xs">
            No incident threat entries captured in registry yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-400 uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Session & Risk</th>
                  <th className="py-3 px-4">Transcript Snippet</th>
                  <th className="py-3 px-4">Audit Signature</th>
                  <th className="py-3 px-4">Threat State</th>
                  <th className="py-3 px-4 text-right">Escalation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {incidents.map((inc) => {
                  const dateStr = new Date(inc.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })
                  const riskColor = inc.risk_score >= 70 ? 'text-rose-500' : inc.risk_score >= 40 ? 'text-amber-500' : 'text-emerald-400'
                  
                  return (
                    <tr key={inc.id} className="hover:bg-white/[0.01] transition-all">
                      {/* Timestamp */}
                      <td className="py-4 px-4 font-mono text-gray-400 whitespace-nowrap">{dateStr}</td>
                      
                      {/* Session ID + Risk Score */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono text-gray-300 font-bold">{inc.session_id}</div>
                        <div className="mt-1 flex items-center space-x-1.5">
                          <span className={`font-black ${riskColor}`}>{inc.risk_score}%</span>
                          <span className="text-[10px] text-gray-500">score</span>
                        </div>
                      </td>

                      {/* Transcript Snippet */}
                      <td className="py-4 px-4 max-w-xs md:max-w-md">
                        <p className="text-gray-300 truncate leading-relaxed" title={inc.transcript}>
                          {inc.transcript}
                        </p>
                        <div className="mt-1 text-[10px] text-indigo-400 font-semibold italic truncate">
                          {inc.reasoning || "Reasoning processed"}
                        </div>
                      </td>

                      {/* Deepfake Voice Audit Signature */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {inc.is_ai_voice ? (
                          <div className="flex items-center space-x-1.5 text-rose-400 font-mono font-bold text-[10px] uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                            <span>Deepfake Voice ({Math.round(inc.deepfake_score * 100)}%)</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-gray-500 font-mono text-[10px] uppercase">
                            <span>Human Signature</span>
                          </div>
                        )}
                      </td>

                      {/* Threat Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(inc.status)}</td>

                      {/* Escalation Controls */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {inc.status !== 'reported' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'reported')}
                              className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 transition-all font-semibold flex items-center space-x-1.5 hover:shadow-glow-red cursor-pointer"
                            >
                              <AlertOctagon className="h-3.5 w-3.5" />
                              <span>Escalate (1930)</span>
                            </button>
                          )}
                          {inc.status !== 'dismissed' && (
                            <button
                              onClick={() => handleUpdateStatus(inc.id, 'dismissed')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-all font-semibold flex items-center space-x-1.5 cursor-pointer"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Dismiss</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
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
