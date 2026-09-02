import { Mail } from 'lucide-react';

export function Header() {
  return (
    <header className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 py-14 text-center sm:py-20">
        <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-3 shadow-lg shadow-blue-500/20">
          <Mail className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          MailMind
        </h1>
        <p className="mt-2 text-lg font-medium text-blue-600">
          AI Email Generator
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 sm:text-lg">
          Create professional emails in seconds with Generative AI.
        </p>
      </div>
    </header>
  );
}
