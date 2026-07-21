import React from 'react'
import { Cpu, UserCheck, ShieldQuestion } from 'lucide-react'

function VoiceBadge({ isAiVoice = false, deepfakeScore = 0.0, isChecking = false }) {
  if (isChecking) {
    return (
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-4 flex items-center space-x-3 neon-glow-indigo animate-pulse">
        <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
          <ShieldQuestion className="h-5 w-5 animate-spin" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">Voice Analysis Active</h4>
          <p className="text-[11px] text-gray-400">Scanning voice frequencies for synthesized artifacts...</p>
        </div>
      </div>
    )
  }

  const confidencePct = Math.round(deepfakeScore * 100)

  if (isAiVoice) {
    return (
      <div className="bg-rose-950/40 border border-rose-500/35 rounded-xl p-4 flex items-center space-x-3 neon-glow-red animate-bounce-short">
        <div className="bg-rose-500/20 p-2 rounded-lg text-rose-400 animate-pulse">
          <Cpu className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono text-rose-400 font-extrabold uppercase tracking-widest">AI VOICE DETECTED</h4>
            <span className="text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded">
              {confidencePct}% CONFIDENCE
            </span>
          </div>
          <p className="text-[11px] text-gray-300 mt-0.5">Spectral signatures match text-to-speech / clone models. Handle with extreme caution.</p>
        </div>
      </div>
    )
  }

  // Default Verified Human State
  return (
    <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 flex items-center space-x-3 transition-all duration-300">
      <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
        <UserCheck className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Voice Matrix Verified</h4>
          <span className="text-[10px] font-mono text-gray-500">AUTHENTIC</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">Voice analysis shows natural acoustic features. No deepfake patterns found.</p>
      </div>
    </div>
  )
}

export default VoiceBadge
