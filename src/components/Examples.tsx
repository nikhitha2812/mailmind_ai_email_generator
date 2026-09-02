import { Briefcase, CalendarDays, Clock } from 'lucide-react';
import type { ExampleUseCase } from '@/types';
import { EXAMPLES } from '@/types';

interface ExamplesProps {
  onSelect: (example: ExampleUseCase) => void;
  disabled: boolean;
}

const ICONS: Record<string, typeof Briefcase> = {
  Briefcase,
  CalendarDays,
  Clock,
};

export function Examples({ onSelect, disabled }: ExamplesProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-1 text-lg font-bold text-slate-900">Try an example</h2>
      <p className="mb-5 text-sm text-slate-500">
        Click a use case to auto-fill the form.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {EXAMPLES.map((ex) => {
          const Icon = ICONS[ex.icon] ?? Briefcase;
          return (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              disabled={disabled}
              className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 transition group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-800">{ex.title}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{ex.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
