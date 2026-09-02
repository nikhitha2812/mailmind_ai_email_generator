import { Mic, MicOff, Square, Loader2 } from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

interface VoiceInputButtonProps {
  state: VoiceState;
  isSupported: boolean;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  label?: string;
}

export function VoiceInputButton({
  state,
  isSupported,
  error,
  onStart,
  onStop,
  disabled,
  label = 'Speak',
}: VoiceInputButtonProps) {
  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input is not supported in this browser"
        aria-label="Voice input not supported"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
      >
        <MicOff className="h-4 w-4" />
        <span className="hidden sm:inline">Not supported</span>
      </button>
    );
  }

  const isListening = state === 'listening';
  const isProcessing = state === 'processing';

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  const buttonClass = isListening
    ? 'flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition hover:bg-red-600'
    : 'flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100';

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        aria-label={isListening ? 'Stop recording' : label}
        title={isListening ? 'Stop recording' : label}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isListening ? (
          <>
            <Square className="h-4 w-4" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            <span>{label}</span>
          </>
        )}
      </button>

      {isListening && (
        <div className="flex items-center gap-1 px-1" aria-hidden="true">
          <span className="h-3 w-1 animate-voice-wave rounded-full bg-red-400" style={{ animationDelay: '0ms' }} />
          <span className="h-4 w-1 animate-voice-wave rounded-full bg-red-400" style={{ animationDelay: '150ms' }} />
          <span className="h-2.5 w-1 animate-voice-wave rounded-full bg-red-400" style={{ animationDelay: '300ms' }} />
          <span className="h-4 w-1 animate-voice-wave rounded-full bg-red-400" style={{ animationDelay: '450ms' }} />
          <span className="h-3 w-1 animate-voice-wave rounded-full bg-red-400" style={{ animationDelay: '600ms' }} />
          <span className="ml-1.5 text-xs font-medium text-red-500">Listening...</span>
        </div>
      )}

      {error && state === 'error' && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
