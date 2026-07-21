import React from 'react'
import { AlertOctagon, PhoneCall, ShieldAlert, X, ExternalLink } from 'lucide-react'

function AlertCard({ 
  show = false, 
  score = 0, 
  patterns = [], 
  reasoning = "", 
  onDismiss, 
  onReport 
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-glow-red rounded-2xl max-w-lg w-full overflow-hidden border border-rose-500/40 neon-glow-red animate-pulse-fast p-6 relative">
        
        {/* Cancel Button */}
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Threat Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/40 text-rose-500 animate-bounce">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-black font-sans text-rose-500 tracking-wide uppercase">
              DIGITAL ARREST SCAM WARNING
            </h2>
            <p className="text-[11px] text-gray-400 font-mono">SCAM FUSION THREAT RATIO: {score}%</p>
          </div>
        </div>

        {/* Threat Reasoning Box */}
        <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 mb-4">
          <h4 className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider mb-1">Semantic Threat Analysis</h4>
          <p className="text-sm text-gray-200 leading-relaxed">
            {reasoning || "The speaker is using patterns standard in Digital Arrest scams to induce fear, request isolation, and establish mock legal urgency."}
          </p>
        </div>

        {/* Matched scam indicators list */}
        <div className="mb-6">
          <h4 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-2">SCAM PATTERNS IDENTIFIED:</h4>
          <div className="flex flex-wrap gap-2">
            {patterns.map((pat, idx) => (
              <span 
                key={idx}
                className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded text-xs font-mono font-semibold"
              >
                ⚠️ {pat}
              </span>
            ))}
          </div>
        </div>

        {/* Protection / Escalation Actions */}
        <div className="flex flex-col space-y-3">
          <div className="text-[10px] text-gray-400 leading-relaxed italic bg-black/30 p-2.5 rounded border border-white/5">
            <strong>Judge Defense Factsheet:</strong> This app acts as a local interceptor companion. If you dial the helpline below or file a report, you will be directed to official Government of India channels.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a 
              href="tel:1930" 
              onClick={onReport}
              className="flex-1 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 text-center shadow-glow-red cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Helpline (1930)</span>
            </a>
            
            <a 
              href="https://cybercrime.gov.in" 
              target="_blank" 
              rel="noreferrer"
              onClick={onReport}
              className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 text-gray-200 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 text-center cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Report on NCRB Portal</span>
            </a>
          </div>
          
          <button 
            onClick={onDismiss}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-200 py-2 transition-all mt-1"
          >
            Dismiss Safety Warning
          </button>
        </div>

      </div>
    </div>
  )
}

export default AlertCard
