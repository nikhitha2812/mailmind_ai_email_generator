import { useState } from 'react';
import { Mail, Reply } from 'lucide-react';
import { Header } from '@/components/Header';
import { EmailForm } from '@/components/EmailForm';
import { Examples } from '@/components/Examples';
import { GeneratedEmail } from '@/components/GeneratedEmail';
import { ImproveModal } from '@/components/ImproveModal';
import { ReplyForm } from '@/components/ReplyForm';
import { ReplyResult } from '@/components/ReplyResult';
import { geminiService } from '@/services/geminiService';
import type {
  EmailRequest,
  ExampleUseCase,
  GeneratedEmail as GeneratedEmailType,
  ReplyRequest,
} from '@/types';

const DEFAULT_REQUEST: EmailRequest = {
  recipient: '',
  purpose: '',
  tone: 'Professional',
  length: 'Medium',
};

const DEFAULT_REPLY_REQUEST: ReplyRequest = {
  receivedEmail: '',
  tone: 'Professional',
};

const LANGUAGE_STORAGE_KEY = 'mailmind-language';

function getInitialLanguage(): string {
  try {
    const stored = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // sessionStorage not available
  }
  return 'en';
}

type Tab = 'generate' | 'reply';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [language, setLanguage] = useState<string>(getInitialLanguage);

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    try {
      sessionStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      // sessionStorage not available
    }
  };

  const [request, setRequest] = useState<EmailRequest>(DEFAULT_REQUEST);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [improveOpen, setImproveOpen] = useState(false);
  const [improveText, setImproveText] = useState('');
  const [improveResult, setImproveResult] = useState<GeneratedEmailType | null>(null);
  const [improveLoading, setImproveLoading] = useState(false);
  const [improveError, setImproveError] = useState<string | null>(null);

  const [replyRequest, setReplyRequest] = useState<ReplyRequest>(DEFAULT_REPLY_REQUEST);
  const [replyEmail, setReplyEmail] = useState<GeneratedEmailType | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof EmailRequest, value: string) => {
    setRequest((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!request.purpose.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedEmail(null);
    try {
      const result = await geminiService.generateEmail(request);
      setGeneratedEmail(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleExampleSelect = (ex: ExampleUseCase) => {
    setRequest({
      recipient: ex.recipient,
      purpose: ex.purpose,
      tone: ex.tone,
      length: ex.length,
    });
    setError(null);
    setGeneratedEmail(null);
  };

  const handleOpenImprove = () => {
    const text = generatedEmail
      ? `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`
      : '';
    setImproveText(text);
    setImproveResult(null);
    setImproveError(null);
    setImproveOpen(true);
  };

  const handleImprove = async (text: string) => {
    setImproveLoading(true);
    setImproveError(null);
    setImproveResult(null);
    try {
      const result = await geminiService.improveEmail(text);
      setImproveResult(result);
    } catch (err) {
      setImproveError(err instanceof Error ? err.message : 'Failed to improve email.');
    } finally {
      setImproveLoading(false);
    }
  };

  const handleUseImproved = () => {
    if (improveResult) {
      setGeneratedEmail(improveResult);
      setImproveOpen(false);
    }
  };

  const handleReplyFieldChange = (field: keyof ReplyRequest, value: string) => {
    setReplyRequest((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReply = async () => {
    if (!replyRequest.receivedEmail.trim()) return;
    setReplyLoading(true);
    setReplyError(null);
    setReplyEmail(null);
    try {
      const result = await geminiService.generateReply(replyRequest);
      setReplyEmail(result);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : 'Failed to generate reply.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReplyRegenerate = () => {
    handleGenerateReply();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === 'generate'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mail className="h-4 w-4" />
              Generate Email
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === 'reply'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Reply className="h-4 w-4" />
              AI Reply
            </button>
          </div>
        </div>

        {activeTab === 'generate' && (
          <>
            <div className="mb-8">
              <Examples onSelect={handleExampleSelect} disabled={isLoading} />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <EmailForm
                request={request}
                onChange={handleFieldChange}
                onSubmit={handleGenerate}
                isLoading={isLoading}
                language={language}
                onLanguageChange={handleLanguageChange}
              />
              <GeneratedEmail
                email={generatedEmail}
                isLoading={isLoading}
                error={error}
                onRegenerate={handleRegenerate}
                onImprove={handleOpenImprove}
              />
            </div>
          </>
        )}

        {activeTab === 'reply' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ReplyForm
              request={replyRequest}
              onChange={handleReplyFieldChange}
              onSubmit={handleGenerateReply}
              isLoading={replyLoading}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
            <ReplyResult
              email={replyEmail}
              isLoading={replyLoading}
              error={replyError}
              onRegenerate={handleReplyRegenerate}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="text-center text-sm text-slate-400">
          MailMind — AI Email Generator
        </p>
      </footer>

      <ImproveModal
        open={improveOpen}
        initialText={improveText}
        isLoading={improveLoading}
        result={improveResult}
        error={improveError}
        onClose={() => setImproveOpen(false)}
        onImprove={handleImprove}
        onUseResult={handleUseImproved}
      />
    </div>
  );
}

export default App;
