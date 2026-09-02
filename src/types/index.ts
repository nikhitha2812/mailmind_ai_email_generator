export type Tone = 'Professional' | 'Formal' | 'Friendly' | 'Casual' | 'Apologetic';

export type EmailLength = 'Short' | 'Medium' | 'Detailed';

export interface EmailRequest {
  recipient: string;
  purpose: string;
  tone: Tone;
  length: EmailLength;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface ExampleUseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
  recipient: string;
  purpose: string;
  tone: Tone;
  length: EmailLength;
}

export const TONES: Tone[] = [
  'Professional',
  'Formal',
  'Friendly',
  'Casual',
  'Apologetic',
];

export const LENGTHS: EmailLength[] = ['Short', 'Medium', 'Detailed'];

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', bcp47: 'en-US' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN' },
];

export type ReplyTone = 'Professional' | 'Formal' | 'Friendly' | 'Casual';

export const REPLY_TONES: ReplyTone[] = [
  'Professional',
  'Formal',
  'Friendly',
  'Casual',
];

export interface ReplyRequest {
  receivedEmail: string;
  tone: ReplyTone;
}

export const EXAMPLES: ExampleUseCase[] = [
  {
    id: 'job-application',
    title: 'Job Application',
    description: 'Apply for a role you are excited about',
    icon: 'Briefcase',
    recipient: 'hiring@techcorp.com',
    purpose: 'I want to apply for the Senior Software Engineer position I saw on your careers page. I have 5 years of experience in full-stack development, specializing in React and Node.js.',
    tone: 'Professional',
    length: 'Detailed',
  },
  {
    id: 'leave-request',
    title: 'Leave Request',
    description: 'Request time off from your manager',
    icon: 'CalendarDays',
    recipient: 'manager@company.com',
    purpose: 'I need to request leave from October 14 to October 18 for a family event. I will ensure all my tasks are handed over before I leave.',
    tone: 'Formal',
    length: 'Medium',
  },
  {
    id: 'project-extension',
    title: 'Project Extension',
    description: 'Ask for a deadline extension',
    icon: 'Clock',
    recipient: 'pm@company.com',
    purpose: 'I would like to request a one-week extension for the Q3 redesign project due to additional scope changes from the client.',
    tone: 'Professional',
    length: 'Medium',
  },
];
