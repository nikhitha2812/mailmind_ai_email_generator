import { useCallback } from 'react';
import { Reply } from 'lucide-react';
import type { ReplyRequest, ReplyTone } from '@/types';
import { REPLY_TONES } from '@/types';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VoiceInputButton } from '@/components/VoiceInputButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface ReplyFormProps {
  request: ReplyRequest;
  onChange: (field: keyof ReplyRequest, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  language: string;
  onLanguageChange: (code: string) => void;
}

export function ReplyForm({
  request,
  onChange,
  onSubmit,
  isLoading,
  language,
  onLanguageChange,
}: ReplyFormProps) {
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20';
  const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700';

  const handleVoiceResult = useCallback(
    (text: string) => {
      onChange('receivedEmail', text);
    },
    [onChange]
  );

  const { state: voiceState, error: voiceError, isSupported, start, stop } =
    useSpeechRecognition(language, handleVoiceResult);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Received Email
      </h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="replyInputLanguage" className={labelClass}>
            Input Language
          </label>
          <LanguageSelector
            id="replyInputLanguage"
            value={language}
            onChange={onLanguageChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="receivedEmail" className={labelClass}>
            Paste the email you received
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <textarea
              id="receivedEmail"
              className={`${inputClass} min-h-[200px] flex-1 resize-y`}
              placeholder="Type, paste, or speak the email you want to reply to..."
              value={request.receivedEmail}
              onChange={(e) => onChange('receivedEmail', e.target.value)}
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

        <div>
          <label htmlFor="replyTone" className={labelClass}>
            Reply Tone
          </label>
          <select
            id="replyTone"
            className={inputClass}
            value={request.tone}
            onChange={(e) => onChange('tone', e.target.value)}
            disabled={isLoading}
          >
            {REPLY_TONES.map((t: ReplyTone) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !request.receivedEmail.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating Reply...
            </>
          ) : (
            <>
              <Reply className="h-5 w-5" />
              Generate Reply
            </>
          )}
        </button>
      </div>
    </div>
  );
}
