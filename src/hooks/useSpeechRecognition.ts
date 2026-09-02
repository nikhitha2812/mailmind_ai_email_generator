import { useCallback, useEffect, useRef, useState } from 'react';

type RecognitionState = 'idle' | 'listening' | 'processing' | 'error';

interface SpeechRecognitionResult {
  transcript: string;
  state: RecognitionState;
  error: string | null;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERROR_MESSAGES: Record<string, string> = {
  'no-speech': 'No speech detected. Please try speaking again.',
  'audio-capture': 'Could not capture audio. Check your microphone.',
  'not-allowed': 'Microphone permission denied. Please allow access and try again.',
  'service-not-allowed': 'Speech service is not allowed in this browser.',
  network: 'Network error during speech recognition. Please check your connection.',
  'language-not-supported': 'This language is not supported for voice input.',
  aborted: 'Voice input was cancelled.',
};

export function useSpeechRecognition(
  lang: string,
  onResult: (text: string) => void
): SpeechRecognitionResult {
  const [state, setState] = useState<RecognitionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef('');
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const isSupported = getSpeechRecognitionConstructor() !== null;

  useEffect(() => {
    const SR = getSpeechRecognitionConstructor();
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      onResultRef.current(finalTranscriptRef.current + interim);
    };

    recognition.onerror = (event: { error: string }) => {
      const message = ERROR_MESSAGES[event.error] ?? `Voice input error: ${event.error}`;
      setError(message);
      setState('error');
    };

    recognition.onend = () => {
      if (finalTranscriptRef.current.trim()) {
        setState('processing');
        onResultRef.current(finalTranscriptRef.current.trim());
        finalTranscriptRef.current = '';
        setTimeout(() => setState('idle'), 600);
      } else if (state !== 'error') {
        setState('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // already stopped
      }
    };
  }, [lang]);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setError(null);
    finalTranscriptRef.current = '';
    setState('listening');
    try {
      recognition.start();
    } catch {
      // already started
    }
  }, []);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // already stopped
    }
  }, []);

  return {
    transcript: '',
    state,
    error,
    isSupported,
    start,
    stop,
  };
}
