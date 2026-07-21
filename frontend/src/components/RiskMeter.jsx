import React from 'react'
import { AlertTriangle, ShieldCheck, ShieldAlert, Activity } from 'lucide-react'

function RiskMeter({ score = 0, matchedPatterns = [] }) {
  // Determine color theme based on score threshold
  let strokeColor = '#10b981' // Green (Safe)
  let shadowColor = 'rgba(16, 185, 129, 0.4)'
  let labelText = 'SAFE COMMUNICATION'
  let labelDesc = 'No fraudulent linguistic patterns isolated. Continuing real-time monitoring.'
  let statusIcon = <ShieldCheck className="h-5 w-5 text-emerald-400" />
  let bgColorClass = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
  let textColorClass = 'text-emerald-400'

  if (score >= 70) {
    strokeColor = '#ef4444' // Red (Scam)
    shadowColor = 'rgba(239, 68, 68, 0.5)'
    labelText = 'CRITICAL THREAT BREACH'
    labelDesc = 'Severe digital arrest coercion markers matched. Disconnect call immediately.'
    statusIcon = <ShieldAlert className="h-5 w-5 text-rose-400 animate-bounce" />
    bgColorClass = 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    textColorClass = 'text-rose-500'
  } else if (score >= 40) {
    strokeColor = '#f59e0b' // Yellow (Warning)
    shadowColor = 'rgba(245, 158, 11, 0.4)'
    labelText = 'ELEVATED SCAM RISK'
    labelDesc = 'Suspicious authority citations or pressure language found. Proceed with caution.'
    statusIcon = <AlertTriangle className="h-5 w-5 text-amber-400 animate-pulse" />
    bgColorClass = 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    textColorClass = 'text-amber-400'
  }

  // Circular progress configuration
  const radius = 76
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-between h-full relative overflow-hidden">
      {/* Interactive technical accents */}
      <div className="tech-corner-tr opacity-20"></div>
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_10px] pointer-events-none"></div>

      <div className="w-full flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center space-x-1.5">
          <Activity className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-black font-mono text-indigo-400 tracking-wider uppercase">RISK TELEMETRY</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest ${bgColorClass} border uppercase`}>
          CORE SCAN
        </div>
      </div>

      {/* Cybernetic Radial Dial */}
      <div className="relative my-5 flex items-center justify-center">
        
        {/* Decorative Rotating Accent Rings */}
        <div className="absolute w-[184px] h-[184px] rounded-full border border-dashed border-white/[0.03] animate-[spin_40s_linear_infinite] pointer-events-none"></div>
        <div className="absolute w-[172px] h-[172px] rounded-full border border-double border-white/[0.02] animate-[spin_20s_linear_infinite_reverse] pointer-events-none"></div>

        <svg className="w-44 h-44 transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]">
          {/* Base track circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-900/80"
            strokeWidth="10"
            fill="transparent"
          />
          
          {/* Segmented Ticks (Outer Background) */}
          <circle
            cx="88"
            cy="88"
            r={radius + 8}
            className="stroke-white/[0.04]"
            strokeWidth="2"
            strokeDasharray="3, 5"
            fill="transparent"
          />

          {/* Active progress arc */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0px 0px 8px ${strokeColor})`,
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), stroke 0.5s ease-in-out'
            }}
          />
        </svg>

        {/* Technical Text overlay inside the Dial */}
        <div className="absolute flex flex-col items-center text-center">
          <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">THREAT RATIO</div>
          <span className="text-4xl font-black tracking-tighter my-0.5" style={{ color: strokeColor }}>
            {score}%
          </span>
          <span className={`text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-full ${bgColorClass} border bg-black/40`}>
            {score >= 70 ? 'DANGER' : score >= 40 ? 'WARNING' : 'SECURE'}
          </span>
        </div>
      </div>

      {/* Threat Summary Status Container */}
      <div className={`w-full p-3 rounded-xl border flex items-start space-x-3 transition-all duration-500 bg-black/30 ${score >= 70 ? 'border-rose-500/20' : score >= 40 ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
        <div className="mt-0.5 bg-black/20 p-1.5 rounded-lg">{statusIcon}</div>
        <div className="flex-1">
          <h4 className="text-xs font-black tracking-wider uppercase" style={{ color: strokeColor }}>
            {labelText}
          </h4>
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{labelDesc}</p>
        </div>
      </div>

      {/* Matched scam patterns tags */}
      <div className="w-full mt-4">
        <h5 className="text-[9px] font-black font-mono text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
          <span>SIGNATURE CHECKS</span>
          <span>{matchedPatterns.length} MATCHED</span>
        </h5>
        <div className="flex flex-wrap gap-1.5 min-h-[38px] items-start">
          {matchedPatterns.length === 0 ? (
            <span className="text-[10px] text-gray-500 italic font-mono">No suspicious semantic signals detected...</span>
          ) : (
            matchedPatterns.map((pat, idx) => (
              <span
                key={idx}
                className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wide transition-all hover:bg-indigo-500/20"
              >
                ⚠️ {pat.toUpperCase()}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default RiskMeter
