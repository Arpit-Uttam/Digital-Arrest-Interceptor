import React from 'react'
import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react'

function RiskMeter({ score = 0, matchedPatterns = [] }) {
  // Determine color theme based on score threshold
  let strokeColor = '#10b981' // Green
  let glowClass = 'neon-glow-green'
  let labelText = 'SAFE CONVERSATION'
  let labelDesc = 'No threats detected. Continuing normal security monitoring.'
  let statusIcon = <ShieldCheck className="h-6 w-6 text-emerald-400" />
  let bgColorClass = 'bg-emerald-500/10 border-emerald-500/20'

  if (score >= 70) {
    strokeColor = '#ef4444' // Red
    glowClass = 'neon-glow-red'
    labelText = 'CRITICAL THREAT BREACH'
    labelDesc = 'Digital Arrest scam indicators found. Take immediate precautions.'
    statusIcon = <ShieldAlert className="h-6 w-6 text-rose-500" />
    bgColorClass = 'bg-rose-500/10 border-rose-500/20'
  } else if (score >= 40) {
    strokeColor = '#f59e0b' // Yellow
    glowClass = 'neon-glow-yellow'
    labelText = 'ELEVATED RISK STATUS'
    labelDesc = 'Suspicious authority/coercion statements found. Stay alert.'
    statusIcon = <AlertTriangle className="h-6 w-6 text-amber-500" />
    bgColorClass = 'bg-amber-500/10 border-amber-500/20'
  }

  // Circular progress dimensions
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between h-full relative overflow-hidden">
      {/* Background grid accents */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_12px] pointer-events-none"></div>

      <div className="w-full flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <span className="text-xs font-bold font-mono text-indigo-400 tracking-widest uppercase">RISK TELEMETRY</span>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider ${bgColorClass} border uppercase`}>
          SYS STATUS
        </div>
      </div>

      {/* Radial SVG Dial */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Base track circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-[#1a1b26]"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active progress arc */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Text inside the Dial */}
        <div className="absolute flex flex-col items-center text-center">
          <span className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: strokeColor }}>
            {score}%
          </span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">THREAT RATING</span>
        </div>
      </div>

      {/* Threat Summary Status */}
      <div className={`w-full mt-4 p-4 rounded-xl border flex items-start space-x-3 transition-colors duration-300 ${bgColorClass}`}>
        <div className="mt-0.5">{statusIcon}</div>
        <div className="flex-1">
          <h4 className="text-sm font-extrabold tracking-wide uppercase" style={{ color: strokeColor }}>
            {labelText}
          </h4>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{labelDesc}</p>
        </div>
      </div>

      {/* Matched scam patterns tags */}
      <div className="w-full mt-5">
        <h5 className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-2">SCAM SIGNALS MATCHED</h5>
        <div className="flex flex-wrap gap-1.5 min-h-[40px]">
          {matchedPatterns.length === 0 ? (
            <span className="text-xs text-gray-400 italic">No threat signals triggered yet...</span>
          ) : (
            matchedPatterns.map((pat, idx) => (
              <span
                key={idx}
                className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded text-[11px] font-mono font-semibold"
              >
                {pat}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default RiskMeter
