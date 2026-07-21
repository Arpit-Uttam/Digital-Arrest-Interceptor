import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Phone, PhoneOff, Mic, MicOff, AlertCircle, Volume2, ShieldAlert, Upload, Sparkles, Terminal, Activity } from 'lucide-react'
import RiskMeter from './RiskMeter'
import TranscriptView from './TranscriptView'
import VoiceBadge from './VoiceBadge'
import AlertCard from './AlertCard'
import { SCENARIOS } from '../constants/scenarios'
import { useWebSocket } from '../hooks/useWebSocket'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Beautiful Canvas Waveform Visualizer
function WaveformVisualizer({ active, riskScore, isChecking }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let phase = 0

    // Set canvas dimensions dynamically for sharp display
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const render = () => {
      const width = rect.width
      const height = rect.height
      const centerY = height / 2

      ctx.clearRect(0, 0, width, height)

      // Background grid lines in canvas for a high-tech vibe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let j = 0; j < height; j += 15) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(width, j)
        ctx.stroke()
      }

      // Color selection based on threat status
      let color = 'rgba(99, 102, 241, 0.7)' // Indigo
      let glowColor = 'rgba(99, 102, 241, 0.3)'
      if (active) {
        if (riskScore >= 70) {
          color = 'rgba(239, 68, 68, 0.9)' // Red
          glowColor = 'rgba(239, 68, 68, 0.5)'
        } else if (riskScore >= 40) {
          color = 'rgba(245, 158, 11, 0.9)' // Yellow
          glowColor = 'rgba(245, 158, 11, 0.4)'
        } else {
          color = 'rgba(16, 185, 129, 0.9)' // Green
          glowColor = 'rgba(16, 185, 129, 0.4)'
        }
      }

      ctx.shadowBlur = active ? 10 : 0
      ctx.shadowColor = glowColor

      if (!active) {
        // Inactive flat line
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)'
        ctx.lineWidth = 1.5
        ctx.moveTo(0, centerY)
        ctx.lineTo(width, centerY)
        ctx.stroke()
        ctx.shadowBlur = 0
        return
      }

      if (isChecking) {
        // Scanning laser pulse wave
        ctx.lineWidth = 1.5
        ctx.strokeStyle = color
        
        const barWidth = 3
        const gap = 3
        const numBars = Math.floor(width / (barWidth + gap))
        
        for (let i = 0; i < numBars; i++) {
          const x = i * (barWidth + gap)
          // Frequency simulation
          const noise = Math.sin(i * 0.15 + phase) * Math.cos(i * 0.05 + phase * 0.5)
          const barHeight = Math.abs(noise) * (centerY - 10) + 2
          
          ctx.fillStyle = color
          ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight)
        }
        phase += 0.12
      } else {
        // Multi-layered fluid scrolling sine waves
        // Primary Wave
        ctx.beginPath()
        ctx.lineWidth = 2.5
        ctx.strokeStyle = color
        for (let x = 0; x < width; x++) {
          const cycle = x * 0.025 + phase
          const waveAmp = Math.sin(cycle) * Math.cos(x * 0.004 + phase * 0.3) * (centerY - 15)
          const y = centerY + waveAmp
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Secondary Ambient Wave
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = color.replace('0.9', '0.35')
        ctx.shadowBlur = 0
        for (let x = 0; x < width; x++) {
          const cycle = x * 0.035 - phase
          const waveAmp = Math.sin(cycle) * Math.cos(x * 0.008 - phase * 0.1) * (centerY - 25)
          const y = centerY + waveAmp
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        phase += 0.09
      }

      ctx.shadowBlur = 0 // Reset
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [active, riskScore, isChecking])

  return (
    <div className="relative w-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[95px] rounded-xl bg-black/60 border border-white/5 cursor-pointer block"
      />
      {/* Oscilloscope Grid Accent overlays */}
      <div className="absolute inset-x-2 bottom-1.5 flex justify-between pointer-events-none text-[8px] font-mono text-gray-600">
        <span>FREQ: 16.0 kHz</span>
        <span>PEAK: {active ? (riskScore >= 70 ? 'ALERT' : 'NOMINAL') : 'IDLE'}</span>
        <span>T: LIVE_BUFF</span>
      </div>
    </div>
  )
}

function CallSimulator({ sessionId, onResetSession, onIncidentLogged }) {
  // Call States
  const [callActive, setCallActive] = useState(false)
  const [activeScenario, setActiveScenario] = useState(null)
  const [micActive, setMicActive] = useState(false)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  
  // Audio analysis results
  const [riskScore, setRiskScore] = useState(0)
  const [matchedPatterns, setMatchedPatterns] = useState([])
  const [reasoning, setReasoning] = useState('')
  const [isAiVoice, setIsAiVoice] = useState(false)
  const [deepfakeScore, setDeepfakeScore] = useState(0.0)
  const [isCheckingDeepfake, setIsCheckingDeepfake] = useState(false)
  const [transcript, setTranscript] = useState('')
  
  // UI Overlays
  const [showAlertCard, setShowAlertCard] = useState(false)
  const [isDbOffline, setIsDbOffline] = useState(false)
  const [fileAnalysisActive, setFileAnalysisActive] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')

  // Refs for timers and speech recognition
  const sentenceTimerRef = useRef(null)
  const recognitionRef = useRef(null)

  function logger(msg) {
    console.log(`[Simulator] ${msg}`)
  }

  // Handle incoming live broadcast updates from WebSocket
  const handleWebSocketMessage = useCallback((data) => {
    if (data.session_id) {
      setRiskScore(data.risk_score)
      setMatchedPatterns(data.matched_patterns)
      setReasoning(data.reasoning)
      setIsAiVoice(data.is_ai_voice)
      setDeepfakeScore(data.deepfake_score)
      
      if (data.risk_score >= 75) {
        setShowAlertCard(true)
      }
    }
  }, [])

  // Instantiate clean custom hook
  useWebSocket(sessionId, callActive, handleWebSocketMessage)

  // Handle Scenario transcript streaming simulation
  useEffect(() => {
    if (callActive && activeScenario && sentenceIndex < activeScenario.sentences.length) {
      const sentence = activeScenario.sentences[sentenceIndex]
      
      sentenceTimerRef.current = setTimeout(() => {
        sendTranscriptChunk(sentence)
        setSentenceIndex(prev => prev + 1)
      }, 4000)
    } else if (activeScenario && sentenceIndex >= activeScenario.sentences.length) {
      logger('Scenario playback complete')
    }

    return () => {
      if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current)
    }
  }, [callActive, activeScenario, sentenceIndex])

  // Cleanup Speech Recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  // Send transcript chunk to API
  const sendTranscriptChunk = async (chunk) => {
    // 1. Update UI transcript log locally first
    setTranscript(prev => prev ? `${prev} ${chunk}` : chunk)

    // 2. Mock deepfake checking timing for visual feedback
    if (activeScenario && sentenceIndex === 0) {
      setIsCheckingDeepfake(true)
      setTimeout(() => {
        setIsCheckingDeepfake(false)
        setIsAiVoice(activeScenario.isAiVoice)
        setDeepfakeScore(activeScenario.deepfakeScore)
      }, 2500)
    }

    // 3. Post to API
    try {
      const response = await fetch(`${API_BASE}/api/transcript-chunk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          text_chunk: chunk
        })
      })

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status)
      }

      const data = await response.json()
      setRiskScore(data.risk_score)
      setMatchedPatterns(data.matched_patterns)
      setDeepfakeScore(data.deepfake_score)
      setIsAiVoice(data.is_ai_voice)
      
      if (data.risk_score >= 75) {
        setShowAlertCard(true)
      }
      onIncidentLogged()
    } catch (err) {
      // Local fallback simulation if server is offline
      setIsDbOffline(true)
      simulateLocalAnalysis(chunk)
    }
  }

  // Local Scorer Fallback
  const simulateLocalAnalysis = (chunkText) => {
    setTranscript(prev => {
      const full = prev.includes(chunkText) ? prev : (prev ? `${prev} ${chunkText}` : chunkText)
      const textLower = full.toLowerCase()
      
      let localScore = 0
      let patterns = []

      if (textLower.includes('cbi') || textLower.includes('customs') || textLower.includes('police')) {
        patterns.push('Authority Impersonation')
        localScore += 40
      }
      if (textLower.includes('camera') || textLower.includes('lock') || textLower.includes("don't talk")) {
        patterns.push('Isolation')
        localScore += 20
      }
      if (textLower.includes('immediate') || textLower.includes('arrest') || textLower.includes('minutes')) {
        patterns.push('Urgency')
        localScore += 20
      }
      if (textLower.includes('transfer') || textLower.includes('deposit') || textLower.includes('money') || textLower.includes('funds')) {
        patterns.push('Payment Coercion')
        localScore += 20
      }

      setRiskScore(localScore)
      setMatchedPatterns(patterns)
      
      if (localScore >= 75) {
        setReasoning('High correlation with Digital Arrest coercion tactics (police impersonation, transfer demands).')
        setShowAlertCard(true)
      } else if (localScore >= 40) {
        setReasoning('Caution: Speaker is referencing official institutions and requesting lockouts.')
      } else {
        setReasoning('No digital arrest patterns flagged.')
      }

      return full
    })
  }

  // Web Speech API Microphone listener
  const toggleMicrophone = () => {
    if (micActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setMicActive(false)
    } else {
      handleEndCall()
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        alert('Web Speech API is not supported in this browser. Please use Chrome/Edge or click predefined scenarios.')
        return
      }

      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = false
      rec.lang = 'en-IN'

      rec.onstart = () => {
        setCallActive(true)
        setMicActive(true)
        setTranscript('')
        setRiskScore(0)
        setMatchedPatterns([])
        setReasoning('Listening to live speech...')
        setIsAiVoice(false)
        setDeepfakeScore(0)
        setIsCheckingDeepfake(true)
        
        setTimeout(() => {
          setIsCheckingDeepfake(false)
          setIsAiVoice(false)
          setDeepfakeScore(0.05)
        }, 5000)
      }

      rec.onresult = (event) => {
        const resultIndex = event.resultIndex
        const transcriptText = event.results[resultIndex][0].transcript
        logger('Mic input transcribed: ' + transcriptText)
        sendTranscriptChunk(transcriptText)
      }

      rec.onerror = (err) => {
        logger('Speech recognition error: ' + err.error)
        setMicActive(false)
      }

      rec.onend = () => {
        setMicActive(false)
      }

      recognitionRef.current = rec
      rec.start()
    }
  }

  // Handle file uploads
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    handleEndCall()

    setCallActive(true)
    setFileAnalysisActive(true)
    setUploadedFileName(file.name)
    setTranscript('Reading audio file data...')
    setRiskScore(0)
    setMatchedPatterns([])
    setReasoning('Uploading audio for threat detection and transcription...')
    setIsAiVoice(false)
    setDeepfakeScore(0)
    setIsCheckingDeepfake(true)

    const reader = new FileReader()
    reader.onload = async () => {
      const base64Audio = reader.result

      try {
        setTranscript('Transcribing audio file chunks...')
        const audioRes = await fetch(`${API_BASE}/api/audio-chunk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            audio_blob: base64Audio,
            filename: file.name
          })
        })

        if (!audioRes.ok) throw new Error('Audio upload failed')
        const audioData = await audioRes.json()

        setTranscript(audioData.transcript)
        setIsCheckingDeepfake(false)
        setTranscript('Analyzing transcript semantics...')
        
        const transcriptRes = await fetch(`${API_BASE}/api/transcript-chunk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            text_chunk: audioData.transcript
          })
        })

        if (!transcriptRes.ok) throw new Error('Scam analysis failed')
        const transcriptData = await transcriptRes.json()

        setTranscript(audioData.transcript)
        setRiskScore(transcriptData.risk_score)
        setMatchedPatterns(transcriptData.matched_patterns)
        setIsAiVoice(transcriptData.is_ai_voice)
        setDeepfakeScore(transcriptData.deepfake_score)
        
        if (transcriptData.risk_score >= 75) {
          setShowAlertCard(true)
        }
        
        onIncidentLogged()
      } catch (err) {
        logger('File upload pipeline error: ' + err.message)
        setTranscript(`[Error analyzing uploaded file: ${err.message}]`)
        setIsCheckingDeepfake(false)
      }
    }
    reader.onerror = (error) => {
      logger('File reading failed: ' + error)
      setTranscript('[Error reading file]')
      setIsCheckingDeepfake(false)
    }
    reader.readAsDataURL(file)
  }

  // Start predefined scenario simulation
  const handleStartScenario = (scenario) => {
    handleEndCall()
    setCallActive(true)
    setActiveScenario(scenario)
    setSentenceIndex(0)
    setTranscript('')
    setRiskScore(0)
    setMatchedPatterns([])
    setIsAiVoice(false)
    setDeepfakeScore(0.0)
    setShowAlertCard(false)
    
    logger(`Starting scenario: ${scenario.name}`)
  }

  // Terminate Active Call
  const handleEndCall = () => {
    if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    setCallActive(false)
    setActiveScenario(null)
    setMicActive(false)
    setSentenceIndex(0)
    setShowAlertCard(false)
    setFileAnalysisActive(false)
    setUploadedFileName('')
    onResetSession()
    logger('Call disconnected. Session refreshed.')
  }

  // Handle report submission to database
  const handleReportIncident = async () => {
    try {
      const getIncidentRes = await fetch(`${API_BASE}/api/incidents?limit=1`)
      if (getIncidentRes.ok) {
        const incidents = await getIncidentRes.json()
        if (incidents.length > 0) {
          const incId = incidents[0].id
          await fetch(`${API_BASE}/api/incidents/${incId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'reported' })
          })
          logger(`Incident ${incId} marked as REPORTED`)
          onIncidentLogged()
        }
      }
    } catch (e) {
      logger('Failed to update status on DB: ' + e.message)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden relative">
      
      {/* LEFT COLUMN: Simulation Control Panel (5 cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        
        {/* Preset Selector Container - Rehearsal Dossiers */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col space-y-4 relative overflow-hidden">
          <div className="tech-corner-tr opacity-30"></div>
          <div className="border-b border-white/5 pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black font-mono text-indigo-400 tracking-wider uppercase">THREAT REHEARSAL DOSSIERS</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Test pre-loaded threat dialogues and genuine samples.</p>
            </div>
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          </div>

          <div className="flex flex-col space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {SCENARIOS.map((scen) => {
              const isSelected = activeScenario?.id === scen.id
              const isScam = scen.category.includes('Scam')
              
              return (
                <button
                  key={scen.id}
                  onClick={() => handleStartScenario(scen)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col relative group overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-glow-indigo border-gradient-active scale-[1.01]'
                      : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Category Badge */}
                  <span className={`absolute top-3.5 right-3.5 text-[8px] font-bold font-mono px-2 py-0.5 rounded border ${
                    isScam 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {scen.category.toUpperCase()}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] font-mono text-indigo-500 group-hover:text-indigo-400">ID: TH-{scen.id.slice(0, 4).toUpperCase()}</span>
                  </div>
                  <h4 className="text-xs font-black text-white mt-1 group-hover:text-indigo-300 transition-colors tracking-wide">
                    {scen.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed pr-18 group-hover:text-gray-300 transition-colors">
                    {scen.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Call Control Console */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col space-y-4 relative overflow-hidden">
          <div className="tech-corner-tr opacity-30"></div>
          <div className="border-b border-white/5 pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-xs font-black font-mono text-indigo-400 tracking-wider uppercase">INTERCEPT PANEL</h3>
            </div>
            {callActive && (
              <div className="flex items-center space-x-1.5">
                <span className="text-[9px] font-mono text-rose-500 font-bold uppercase animate-pulse">RECORDING DATA</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              </div>
            )}
          </div>

          {/* Audio Waveform Visualization container */}
          <div className="p-1 rounded-xl bg-black/30 border border-white/5 relative overflow-hidden flex flex-col space-y-3">
            <WaveformVisualizer 
              active={callActive} 
              riskScore={riskScore} 
              isChecking={isCheckingDeepfake} 
            />

            {callActive ? (
              <div className="px-3 pb-3 flex flex-col items-center text-center">
                <div className="flex items-center space-x-2 mb-1 mt-1">
                  <Activity className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <h4 className="text-xs font-bold text-gray-200">
                    {fileAnalysisActive ? uploadedFileName : (activeScenario ? activeScenario.name : 'Live Microphone Stream')}
                  </h4>
                </div>
                <p className="text-[9px] text-indigo-400 font-mono tracking-widest uppercase">
                  {fileAnalysisActive 
                    ? 'FILE AUDIT COMPLETE' 
                    : (micActive ? 'RECEIVING SPEECH SAMPLES' : `STREAMING DIALOGUE: LINE ${sentenceIndex}/${activeScenario?.sentences.length}`)}
                </p>

                <button
                  onClick={handleEndCall}
                  className="mt-4.5 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-mono font-bold text-[10px] tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-glow-red hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span>{fileAnalysisActive ? 'CLEAR CHANNEL' : 'DISCONNECT STREAM'}</span>
                </button>
              </div>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Select a rehearsal scenario above, or use the controls below to intercept your live microphone or audit an audio file.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center mt-5">
                  <button
                    onClick={toggleMicrophone}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono font-bold text-[10px] tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                      micActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-glow-red'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo'
                    }`}
                  >
                    {micActive ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
                    <span>{micActive ? 'STOP MIC' : 'LIVE MIC INTERCEPT'}</span>
                  </button>

                  <label className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 font-mono font-bold text-[10px] tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer text-gray-200 hover:-translate-y-0.5 active:translate-y-0">
                    <Upload className="h-4.5 w-4.5 text-indigo-400" />
                    <span>UPLOAD AUDIO FILE</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {isDbOffline && (
            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-start space-x-2.5 text-amber-400">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] leading-relaxed font-mono">
                <span className="font-bold text-amber-300">LOCAL SCORER FALLBACK:</span> FastAPI is offline. The dashboard is using client-side fallback parsing (regex models) inside the browser. Start the python server on port 8000 to enable databases and LLM validation.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Threat Analysis Console (7 cols) */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* RiskMeter (7 cols) */}
          <div className="md:col-span-7">
            <RiskMeter score={riskScore} matchedPatterns={matchedPatterns} />
          </div>

          {/* VoiceBadge & Analysis Reasoning (5 cols) */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <div className="flex-1 min-h-[70px]">
              <VoiceBadge 
                isAiVoice={isAiVoice} 
                deepfakeScore={deepfakeScore} 
                isChecking={isCheckingDeepfake} 
              />
            </div>
            
            {/* Reasoning Panel */}
            <div className="glass-panel rounded-2xl p-4.5 flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="tech-corner-tr opacity-25"></div>
              <div>
                <h4 className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-wider mb-2">
                  TELEMETRY REASONING
                </h4>
                <p className="text-[11px] text-gray-300 leading-relaxed italic">
                  {reasoning || 'Establish call intercept connection to begin compiling live threat indices and auditing linguistic signatures.'}
                </p>
              </div>
              <div className="mt-4 border-t border-white/5 pt-2.5">
                <div className="flex items-center space-x-2 text-[9px] text-gray-500 font-mono">
                  <ShieldAlert className="h-3.5 w-3.5 text-indigo-500" />
                  <span>WEIGHTS: 40% MATRIX / 60% NEURAL LLM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Transcript Panel */}
        <div className="flex-1 min-h-[380px]">
          <TranscriptView transcript={transcript} isListening={callActive && !fileAnalysisActive} />
        </div>

      </div>

      {/* EMERGENCY SAFETY ALERT INTERFACE */}
      <AlertCard 
        show={showAlertCard} 
        score={riskScore} 
        patterns={matchedPatterns} 
        reasoning={reasoning}
        onDismiss={() => setShowAlertCard(false)}
        onReport={handleReportIncident}
      />

    </div>
  )
}

export default CallSimulator
