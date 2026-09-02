import { useState } from 'react';
import { Check, Copy, RefreshCw, Reply, Sparkles, X } from 'lucide-react';
import type { GeneratedEmail as GeneratedEmailType } from '@/types';

interface ReplyResultProps {
  email: GeneratedEmailType | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

export function ReplyResult({ email, isLoading, error, onRegenerate }: ReplyResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!email) return;
    const fullText = `Subject: ${email.subject}\n\n${email.body}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="relative mb-6">
          <div className="h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20" />
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
        <p className="text-lg font-semibold text-slate-700">Generating your reply...</p>
        <p className="mt-1 text-sm text-slate-400">The AI is crafting the perfect response</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
          <X className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-red-700">Something went wrong</p>
        <p className="mt-1 max-w-sm text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-blue-500">
          <Reply className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-slate-600">Your reply will appear here</p>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          Paste an email you received on the left, choose a tone, and click Generate Reply to create an AI-crafted response.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Generated Reply</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <Sparkles className="h-3.5 w-3.5" />
          Ready
        </span>
      </div>

      <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Subject
        </p>
        <p className="font-semibold text-slate-800">{email.subject}</p>
      </div>

      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Body
        </p>
        <div className="whitespace-pre-wrap text-slate-700">{email.body}</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>

        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </button>
      </div>

      {copied && (
        <p className="mt-3 text-sm font-medium text-green-600">
          Reply copied to clipboard!
        </p>
      )}
    </div>
  );
}
