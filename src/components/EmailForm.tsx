import { useCallback } from 'react';
import { Send } from 'lucide-react';
import type { EmailLength, EmailRequest, Tone } from '@/types';
import { LENGTHS, TONES } from '@/types';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface EmailFormProps {
  request: EmailRequest;
  onChange: (field: keyof EmailRequest, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  language: string;
  onLanguageChange: (code: string) => void;
}

export function EmailForm({
  request,
  onChange,
  onSubmit,
  isLoading,
  language,
  onLanguageChange,
}: EmailFormProps) {
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700';

  const handleVoiceResult = useCallback(
    (text: string) => {
      onChange('purpose', text);
    },
    [onChange]
  );

  const { state: voiceState, error: voiceError, isSupported, start, stop } =
    useSpeechRecognition(language, handleVoiceResult);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Email Details
      </h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="recipient" className={labelClass}>
            Recipient
          </label>
          <input
            id="recipient"
            type="text"
            className={inputClass}
            placeholder="e.g. hiring@techcorp.com"
            value={request.recipient}
            onChange={(e) => onChange('recipient', e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="inputLanguage" className={labelClass}>
            Input Language
          </label>
          <LanguageSelector
            value={language}
            onChange={onLanguageChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="purpose" className={labelClass}>
            Email Purpose
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <textarea
              id="purpose"
              className={`${inputClass} min-h-[120px] flex-1 resize-y`}
              placeholder="Type or speak your email request in any supported language..."
              value={request.purpose}
              onChange={(e) => onChange('purpose', e.target.value)}
              disabled={isLoading}
            />
            <div className="flex sm:flex-shrink-0">
              <VoiceInputButton
                state={voiceState}
                isSupported={isSupported}
                error={voiceError}
                onStart={start}
                onStop={stop}
                disabled={isLoading}
                label="Speak"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tone" className={labelClass}>
              Tone
            </label>
            <select
              id="tone"
              className={inputClass}
              value={request.tone}
              onChange={(e) => onChange('tone', e.target.value)}
              disabled={isLoading}
            >
              {TONES.map((t: Tone) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="length" className={labelClass}>
              Length
            </label>
            <select
              id="length"
              className={inputClass}
              value={request.length}
              onChange={(e) => onChange('length', e.target.value)}
              disabled={isLoading}
            >
              {LENGTHS.map((l: EmailLength) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !request.purpose.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Generate Email
            </>
          )}
        </button>
      </div>
    </div>
  );
}
