import type { Language } from '@/types';
import { LANGUAGES } from '@/types';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  id?: string;
}

export function LanguageSelector({ value, onChange, disabled, id }: LanguageSelectorProps) {
  const selectClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <select
      id={id ?? 'inputLanguage'}
      className={selectClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Input language"
    >
      {LANGUAGES.map((lang: Language) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName} ({lang.name})
        </option>
      ))}
    </select>
  );
}
