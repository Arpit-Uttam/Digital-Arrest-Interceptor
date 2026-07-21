import React, { useEffect, useRef } from 'react'
import { MessageSquare, Terminal, Skull, UserCheck, Eye } from 'lucide-react'

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
            className="bg-rose-500/20 text-rose-300 font-extrabold border-b border-rose-500/80 px-1.5 py-0.5 rounded transition-all hover:bg-rose-500/35 hover:shadow-[0_0_8px_rgba(239,68,68,0.3)] select-all"
            title="SCAM SIGNAL FLAG"
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
          <MessageSquare className="h-7 w-7 text-gray-600 mb-2" />
          <p className="text-xs font-mono">NO ACTIVE VOICE DATALINK DETECTED</p>
          <p className="text-[10px] text-gray-600 mt-1 font-mono">Dial a rehearsal scenario or stream microphone feed to compile transcripts.</p>
        </div>
      )
    }

    // Split paragraphs or turns. For demo purposes, we will treat sentences as individual dialogue turns
    const sentences = transcript.match(/[^.!?]+[.!?]+(\s|$)/g) || [transcript]
    
    return sentences.map((sentence, idx) => {
      // Alternate speaker labels for demo simulation feel
      const isIncoming = idx % 2 === 0
      const speakerLabel = isIncoming ? "INCOMING SOURCE (COERCION TARGET)" : "LOCAL USER (SECURED AGENT)"
      
      const bubbleBg = isIncoming 
        ? "bg-slate-900/60 border border-rose-500/10 text-gray-200" 
        : "bg-indigo-950/15 border border-indigo-500/10 text-indigo-100 self-end ml-12"

      const AvatarIcon = isIncoming ? Skull : UserCheck
      const iconColorClass = isIncoming ? "text-rose-400" : "text-indigo-400"

      return (
        <div 
          key={idx} 
          className={`flex items-start max-w-[85%] ${isIncoming ? 'self-start mr-12' : 'self-end'} mb-4 animate-[fadeIn_0.3s_ease-out]`}
        >
          {/* Avatar Icon */}
          {isIncoming && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl mr-2.5 flex-shrink-0">
              <AvatarIcon className={`h-4.5 w-4.5 ${iconColorClass}`} />
            </div>
          )}

          <div className="flex flex-col">
            <span className={`text-[9px] font-mono font-black tracking-widest mb-1 px-1 flex items-center space-x-1 ${
              isIncoming ? 'text-rose-400' : 'text-indigo-400'
            }`}>
              <span>{speakerLabel}</span>
              {isIncoming && <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping"></span>}
            </span>
            <div className={`p-3 rounded-2xl text-xs leading-relaxed ${bubbleBg}`}>
              {highlightText(sentence)}
            </div>
          </div>

          {/* User side avatar */}
          {!isIncoming && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl ml-2.5 flex-shrink-0 self-end">
              <AvatarIcon className={`h-4.5 w-4.5 ${iconColorClass}`} />
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full relative overflow-hidden">
      <div className="tech-corner-tr opacity-25"></div>
      
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4.5 w-4.5 text-indigo-400" />
          <span className="text-xs font-black font-mono text-indigo-400 tracking-wider uppercase">REAL-TIME STREAM DECODING</span>
        </div>
        {isListening && (
          <div className="flex items-center space-x-1.5 text-[9px] text-rose-500 font-mono font-bold uppercase">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>ACTIVE SIGNAL CAPTURE</span>
          </div>
        )}
      </div>

      {/* Transcript container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto flex flex-col pr-1 min-h-[280px] max-h-[460px] scrollbar-thin"
      >
        {renderTurns()}
        
        {/* Rolling Transcription loading state */}
        {isListening && (
          <div className="flex items-start max-w-[80%] self-start mt-2">
            <div className="bg-rose-500/5 border border-rose-500/10 p-2 rounded-xl mr-2.5 flex-shrink-0">
              <Skull className="h-4.5 w-4.5 text-rose-500/40 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold text-gray-500 tracking-widest mb-1 px-1">
                STREAM DECOMPOSING...
              </span>
              <div className="bg-slate-900/30 border border-white/5 px-3 py-2 rounded-2xl flex items-center space-x-2">
                <span className="text-[10px] text-gray-400 font-mono">Awaiting speech patterns</span>
                <div className="flex space-x-1">
                  <span className="h-1.5 w-1.5 bg-rose-500/50 rounded-full typing-dot"></span>
                  <span className="h-1.5 w-1.5 bg-rose-500/50 rounded-full typing-dot"></span>
                  <span className="h-1.5 w-1.5 bg-rose-500/50 rounded-full typing-dot"></span>
                </div>
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
