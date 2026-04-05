import { useState, useRef, useCallback } from 'react';

export function useSession() {
  const [sessionState, setSessionState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const streamRef = useRef(null);

  const startSession = useCallback(async () => {
    if (sessionState === 'recording') return;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
      return;
    }
    streamRef.current = stream;

    const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/transcribe`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'transcript' && msg.text) {
          setTranscript((prev) => prev + msg.text);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      setSessionState((current) => {
        if (current === 'recording') {
          setError('Transcription connection lost unexpectedly.');
          return 'stopped';
        }
        return current;
      });
    };

    // Wait for WS to open before starting audio
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    // Use ScriptProcessor to capture raw PCM at 16kHz
    const audioContext = new AudioContext({ sampleRate: 16000 });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    // ScriptProcessor with 4096 buffer, 1 input channel, 1 output channel
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const float32 = e.inputBuffer.getChannelData(0);
      // Convert float32 PCM to int16 PCM
      const int16 = new Int16Array(float32.length);
      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      ws.send(int16.buffer);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    setSessionState('recording');
  }, [sessionState]);

  const stopSession = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setSessionState('stopped');
  }, []);

  const clearSession = useCallback(() => {
    setTranscript('');
    setError(null);
    setSessionState('idle');
  }, []);

  return { sessionState, transcript, error, startSession, stopSession, clearSession };
}
