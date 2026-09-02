import { useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import type { GeneratedEmail as GeneratedEmailType } from '@/types';

interface ImproveModalProps {
  open: boolean;
  initialText: string;
  isLoading: boolean;
  result: GeneratedEmailType | null;
  error: string | null;
  onClose: () => void;
  onImprove: (text: string) => void;
  onUseResult: () => void;
}

export function ImproveModal({
  open,
  initialText,
  isLoading,
  result,
  error,
  onClose,
  onImprove,
  onUseResult,
}: ImproveModalProps) {
  const [text, setText] = useState(initialText);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Improve Email</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Email to improve
        </label>
        <textarea
          className="min-h-[160px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="Paste your email here or use the generated one..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {result && !error && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Improved Subject
            </p>
            <p className="mb-3 font-semibold text-slate-800">{result.subject}</p>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Improved Body
            </p>
            <p className="whitespace-pre-wrap text-slate-700">{result.body}</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
          {result && !error && (
            <button
              onClick={onUseResult}
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Use improved version
            </button>
          )}
          <button
            onClick={() => onImprove(text)}
            disabled={isLoading || !text.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Improve with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
