import React from 'react'
import { Cpu, UserCheck, ShieldQuestion, Loader2, Radio } from 'lucide-react'

function VoiceBadge({ isAiVoice = false, deepfakeScore = 0.0, isChecking = false }) {
  
  // 1. SCANNING STATE
  if (isChecking) {
    return (
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 flex items-center space-x-3.5 relative overflow-hidden neon-glow-indigo animate-pulse">
        {/* Dynamic scan line laser overlay */}
        <div className="scan-line-animation"></div>
        
        {/* Grid Background Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none opacity-40"></div>

        {/* Animated Radar/Spinner */}
        <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-400 relative flex-shrink-0 border border-indigo-500/20">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        
        <div className="flex-1 relative z-10">
          <div className="flex items-center space-x-1.5">
            <Radio className="h-3 w-3 text-indigo-400 animate-ping" />
            <h4 className="text-[10px] font-black font-mono text-indigo-300 uppercase tracking-widest">
              VOICE SCANNING MATRIX
            </h4>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 leading-normal">
            Scanning voice spectrum nodes for synthesized AI frequency signatures...
          </p>
        </div>
      </div>
    )
  }

  const confidencePct = Math.round(deepfakeScore * 100)

  // 2. AI DEEPFAKE VOICE DETECTED STATE
  if (isAiVoice) {
    return (
      <div className="glass-panel-glow-red rounded-xl p-4 flex items-center space-x-3.5 relative overflow-hidden neon-glow-red animate-bounce-short border border-rose-500/40">
        {/* Glitch Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.08)_1px,transparent_1px)] bg-[size:100%_6px] pointer-events-none opacity-30"></div>
        
        {/* Glowing hazard accents */}
        <div className="bg-rose-500/20 p-2.5 rounded-lg text-rose-400 relative flex-shrink-0 border border-rose-500/30 animate-pulse">
          <Cpu className="h-5 w-5" />
        </div>

        <div className="flex-1 relative z-10">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black font-mono text-rose-400 uppercase tracking-widest glitch-text">
              ⚠️ AI DEEPFAKE DETECTED
            </h4>
            <span className="text-[9px] font-mono font-bold bg-rose-500/20 border border-rose-500/35 text-rose-400 px-2 py-0.5 rounded tracking-wide">
              {confidencePct}% CLONE CONFIDENCE
            </span>
          </div>
          <p className="text-[10px] text-gray-300 mt-1.5 leading-normal">
            Spectral acoustics match cloned text-to-speech vocoders. Disconnect immediately.
          </p>
        </div>
      </div>
    )
  }

  // 3. SECURED GENUINE HUMAN STATE
  return (
    <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-4 flex items-center space-x-3.5 relative overflow-hidden transition-all duration-500">
      {/* Light green grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none"></div>

      <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-400 border border-emerald-500/10 flex-shrink-0">
        <UserCheck className="h-5 w-5" />
      </div>

      <div className="flex-1 relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest">
            ACOUSTIC SIGNATURE VERIFIED
          </h4>
          <span className="text-[8px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
            HUMAN MATCH
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
          Voice metrics confirm normal natural bio-acoustic harmonics. No deepfake models matched.
        </p>
      </div>
    </div>
  )
}

export default VoiceBadge
