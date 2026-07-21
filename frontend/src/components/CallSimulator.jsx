import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Phone, PhoneOff, Mic, MicOff, AlertCircle, Volume2, ShieldAlert, Upload } from 'lucide-react'
import RiskMeter from './RiskMeter'
import TranscriptView from './TranscriptView'
import VoiceBadge from './VoiceBadge'
import AlertCard from './AlertCard'
import { SCENARIOS } from '../constants/scenarios'
import { useWebSocket } from '../hooks/useWebSocket'

const API_BASE = import.meta.env.VITE_API_URL || ''

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
      
      {/* LEFT COLUMN: Simulation Control Panel (5 cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        
        {/* Preset Selector Container */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold font-mono text-indigo-400 tracking-widest uppercase">SCENARIO REHEARSAL</h3>
            <p className="text-xs text-gray-400 mt-1">Select pre-loaded transcripts to simulate digital threats or genuine calls.</p>
          </div>

          <div className="flex flex-col space-y-3.5">
            {SCENARIOS.map((scen) => {
              const isSelected = activeScenario?.id === scen.id
              const isScam = scen.category.includes('Scam')
              
              return (
                <button
                  key={scen.id}
                  onClick={() => handleStartScenario(scen)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col relative group overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-600/10 border-indigo-500/50 shadow-glow-indigo'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`absolute top-4 right-4 text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                    isScam 
                      ? 'bg-rose-500/15 border border-rose-500/25 text-rose-400' 
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}>
                    {scen.category}
                  </span>

                  <h4 className="text-sm font-extrabold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
                    {scen.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed pr-16">{scen.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Call Control Console */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 relative overflow-hidden">
          <div className="border-b border-white/5 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-indigo-400 tracking-widest uppercase">INTERCEPTOR CONSOLE</h3>
            {callActive && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>

          <div className="bg-black/35 rounded-xl border border-white/5 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {callActive ? (
              <div className="w-full flex flex-col items-center">
                <div className={`bg-indigo-500/10 p-5 rounded-full border border-indigo-500/20 relative mb-3 ${!fileAnalysisActive && 'animate-pulse'}`}>
                  <Volume2 className="h-8 w-8 text-indigo-400" />
                  {!fileAnalysisActive && (
                    <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping"></div>
                  )}
                </div>
                
                <h4 className="text-sm font-bold tracking-wider text-gray-200">
                  {fileAnalysisActive ? uploadedFileName : (activeScenario ? activeScenario.name : 'Live Microphone Channel')}
                </h4>
                <p className="text-[10px] text-indigo-400 font-mono tracking-widest mt-1 uppercase">
                  {fileAnalysisActive 
                    ? 'FILE ANALYSIS COMPLETE' 
                    : (micActive ? 'RECEIVING VOICE CHUNKS' : `STREAMING DIALOGUE ${sentenceIndex}/${activeScenario?.sentences.length}`)}
                </p>

                <div className="text-[9px] font-mono text-gray-500 mt-2">
                  ID: <span className="text-gray-400">{sessionId}</span>
                </div>

                <button
                  onClick={handleEndCall}
                  className="mt-6 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-glow-red"
                >
                  <PhoneOff className="h-4.5 w-4.5" />
                  <span>{fileAnalysisActive ? 'CLEAR ANALYSIS' : 'TERMINATE STREAM'}</span>
                </button>
              </div>
            ) : (
              <div className="w-full py-4 text-center">
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Select a rehearsal scenario above, or enable the live microphone intercept to test call phrases in real time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
                  <button
                    onClick={toggleMicrophone}
                    className={`w-full sm:w-auto px-5 py-3 rounded-full font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      micActive
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-glow-red'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo'
                    }`}
                  >
                    {micActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    <span>{micActive ? 'STOP MICROPHONE' : 'LIVE MICROPHONE'}</span>
                  </button>

                  <label className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer text-gray-200">
                    <Upload className="h-4 w-4" />
                    <span>UPLOAD AUDIO</span>
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
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start space-x-2.5 text-amber-500">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] leading-relaxed">
                <strong>Local Fallback Active:</strong> Backend API is offline. The client is using fallback regex evaluation patterns directly in-browser. Start the FastAPI server on port 8000 to enable full DB logging & LLM scoring.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Threat Analysis Console (7 cols) */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-7">
            <RiskMeter score={riskScore} matchedPatterns={matchedPatterns} />
          </div>
          <div className="md:col-span-5 flex flex-col space-y-6">
            <div className="flex-1">
              <VoiceBadge 
                isAiVoice={isAiVoice} 
                deepfakeScore={deepfakeScore} 
                isChecking={isCheckingDeepfake} 
              />
            </div>
            
            <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest mb-1.5">
                  ANALYSIS REASONING
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  {reasoning || 'Initiate call simulation to compile transcript semantics and isolate potential fraud models.'}
                </p>
              </div>
              <div className="mt-4 border-t border-white/5 pt-3">
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono">
                  <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />
                  <span>WEIGHTS: 40% RULES / 60% LLM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <TranscriptView transcript={transcript} isListening={callActive && !fileAnalysisActive} />
        </div>

      </div>

      {/* EMERGENCY ALERT POPUP */}
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
