import React, { useEffect, useRef } from 'react'
import { MessageSquare, RefreshCw } from 'lucide-react'

const LOCAL_HIGHLIGHT_KEYWORDS = [
  "cbi", "central bureau of investigation", "ed", "enforcement directorate",
  "customs", "police warrant", "supreme court", "money laundering", "drugs", "cyber cell",
  "arrest warrant", "don't talk to anyone", "keep the camera on", "lock the door",
  "confidential", "secret", "do not tell", "dont tell", "immediate arrest",
  "30 minutes", "jail", "security deposit", "verify your funds", "transfer money",
  "rbi", "bank details", "pay fine"
]

function TranscriptView({ transcript = "", isListening = false }) {
  const containerRef = useRef(null)

  // Scroll to bottom on transcript update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [transcript])

  // Highlights trigger words dynamically in text
  const highlightText = (text) => {
    if (!text) return ""
    
    // Sort keywords by length descending so that multi-word phrases match before individual words
    const sortedKeywords = [...LOCAL_HIGHLIGHT_KEYWORDS].sort((a, b) => b.length - a.length)
    
    let regexPattern = sortedKeywords
      .map(keyword => {
        // Escape special chars
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // Use word boundaries for short acronyms like CBI, ED, RBI
        return keyword.length <= 3 ? `\\b${escaped}\\b` : escaped
      })
      .join("|")
      
    const regex = new RegExp(`(${regexPattern})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => {
      const isMatch = sortedKeywords.some(keyword => {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const keywordRegex = new RegExp(keyword.length <= 3 ? `^${escapedKeyword}$` : escapedKeyword, 'i')
        return keywordRegex.test(part)
      })

      if (isMatch) {
        return (
          <span 
            key={index} 
            className="bg-amber-500/20 text-amber-300 font-bold border-b border-amber-400/60 px-1 rounded transition-all hover:bg-amber-400/30"
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Format transcript into speech turns (simple split by punctuation or speaker markings)
  const renderTurns = () => {
    if (!transcript) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 italic py-16">
          <MessageSquare className="h-8 w-8 text-gray-600 mb-2" />
          <p className="text-xs">No active call stream detected.</p>
          <p className="text-[10px] text-gray-600 mt-1">Start a scenario or speak into the microphone to begin.</p>
        </div>
      )
    }

    // Split paragraphs or turns. For demo purposes, we will treat sentences as individual dialogue turns
    const sentences = transcript.match(/[^.!?]+[.!?]+(\s|$)/g) || [transcript]
    
    return sentences.map((sentence, idx) => {
      // Alternate speaker labels for demo simulation feel
      const isIncoming = idx % 2 === 0
      const speakerLabel = isIncoming ? "INCOMING (SCAMMER)" : "TARGET USER"
      const bubbleBg = isIncoming 
        ? "bg-slate-800/40 border border-slate-700/30 text-gray-100" 
        : "bg-indigo-950/20 border border-indigo-900/30 text-indigo-100 self-end ml-12"

      return (
        <div key={idx} className={`flex flex-col max-w-[85%] ${isIncoming ? 'self-start mr-12' : 'self-end'} mb-4`}>
          <span className={`text-[10px] font-mono font-bold tracking-wider mb-1 px-1 ${
            isIncoming ? 'text-rose-400' : 'text-indigo-400'
          }`}>
            {speakerLabel}
          </span>
          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${bubbleBg}`}>
            {highlightText(sentence)}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4">
        <span className="text-xs font-bold font-mono text-indigo-400 tracking-widest uppercase">REAL-TIME CALL TRANSCRIPT</span>
        {isListening && (
          <div className="flex items-center space-x-1.5 text-xs text-red-400 font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            <span>LIVE INTERCEPT</span>
          </div>
        )}
      </div>

      {/* Transcript container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto flex flex-col pr-1 min-h-[300px] max-h-[480px]"
      >
        {renderTurns()}
        
        {/* Rolling Transcription loading state */}
        {isListening && (
          <div className="flex flex-col max-w-[80%] self-start mt-2">
            <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider mb-1 px-1">
              INCOMING VOICE
            </span>
            <div className="bg-slate-800/20 border border-white/5 p-3 rounded-2xl flex items-center space-x-2">
              <span className="text-xs text-gray-400">Capturing audio stream</span>
              <div className="flex space-x-1">
                <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full typing-dot"></span>
                <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full typing-dot"></span>
                <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full typing-dot"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptView
export { LOCAL_HIGHLIGHT_KEYWORDS }
