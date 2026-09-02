import type { GeneratedEmail, EmailRequest, ReplyRequest } from '@/types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function buildGeneratePrompt(req: EmailRequest): string {
  return `You are an expert email writing assistant. Write a complete email based on the following details.

Recipient: ${req.recipient || 'the recipient'}
Purpose: ${req.purpose}
Tone: ${req.tone}
Length: ${req.length}

CRITICAL: The user may write the purpose in any language (English, Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, etc.). Understand their intent regardless of the input language. The generated email must ALWAYS be written in professional English.

Requirements:
- Write a clear, well-structured email.
- The tone must be ${req.tone.toLowerCase()}.
- The length should be ${req.length.toLowerCase()}${
    req.length === 'Short'
      ? ' (2-4 sentences in the body)'
      : req.length === 'Medium'
        ? ' (1-2 short paragraphs)'
        : ' (2-3 well-developed paragraphs)'
  }.
- Include an appropriate subject line.
- Do not include any placeholder text like [Your Name]; instead use a sensible sign-off.
- Do not include any preamble or explanation. Only return the email.
- The entire email (subject and body) must be in English.

Return your response as a JSON object with exactly two fields:
{
  "subject": "<the email subject in English>",
  "body": "<the email body in English, starting with the greeting and ending with the sign-off>"
}`;
}

function buildImprovePrompt(emailText: string): string {
  return `You are an expert email editor. Improve the following email for clarity, tone, professionalism, and flow. Keep the original intent and recipient. Do not add unnecessary length unless it improves the email.

Email to improve:
"""
${emailText}
"""

Return your response as a JSON object with exactly two fields:
{
  "subject": "<the improved subject, or the original if no subject was provided>",
  "body": "<the improved email body>"
}`;
}

function buildReplyPrompt(req: ReplyRequest): string {
  return `You are an expert email writing assistant. Write a reply to the following email.

Email received:
"""
${req.receivedEmail}
"""

CRITICAL: The received email may be in any language (English, Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, etc.). Understand the content regardless of the input language. The generated reply must ALWAYS be written in professional English.

Requirements:
- Write a relevant reply that directly addresses the content of the received email.
- The tone must be ${req.tone.toLowerCase()}.
- Keep the reply concise and to the point (1-2 short paragraphs).
- Include an appropriate subject line (use "Re:" followed by a suitable subject).
- Do not include any placeholder text like [Your Name]; instead use a sensible sign-off.
- Do not include any preamble or explanation. Only return the email.
- The entire reply (subject and body) must be in English.

Return your response as a JSON object with exactly two fields:
{
  "subject": "<the reply subject in English>",
  "body": "<the reply body in English, starting with the greeting and ending with the sign-off>"
}`;
}

async function callGemini(prompt: string): Promise<GeneratedEmail> {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your environment variables to enable AI email generation.'
    );
  }

  const response = await fetch(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let message = `Gemini API request failed (${response.status})`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed?.error?.message) message = parsed.error.message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('The AI returned an empty response. Please try again.');
  }

  return parseEmailResponse(text);
}

function stripCodeFences(raw: string): string {
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n([\s\S]*?)\n```$/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }
  return cleaned;
}

function parseEmailResponse(raw: string): GeneratedEmail {
  const cleaned = stripCodeFences(raw);

  try {
    const parsed = JSON.parse(cleaned) as Partial<GeneratedEmail>;
    if (parsed.subject && parsed.body) {
      return {
        subject: String(parsed.subject),
        body: String(parsed.body),
      };
    }
    console.error('[MailMind] JSON parsed but missing fields:', parsed);
  } catch (err) {
    console.error('[MailMind] JSON.parse failed, falling back to text extraction.', err);
    console.error('[MailMind] Raw AI response:', raw);
  }

  const fallback = extractFromPlainText(raw);
  if (fallback) {
    console.warn('[MailMind] Using fallback text extraction:', fallback);
    return fallback;
  }

  throw new Error('Could not parse the AI response. Please try again.');
}

function extractFromPlainText(text: string): GeneratedEmail | null {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) return null;

  let subject = '';
  let bodyStartIndex = 0;

  const subjectMatch = text.match(/^(?:Subject|subject|SUBJECT)\s*:\s*(.+)$/m);
  if (subjectMatch) {
    subject = subjectMatch[1].trim();
    const subjectLineIndex = lines.findIndex((l) =>
      l.toLowerCase().startsWith('subject:')
    );
    bodyStartIndex = subjectLineIndex >= 0 ? subjectLineIndex + 1 : 1;
  } else {
    subject = lines[0].replace(/^(?:Subject|subject|SUBJECT)\s*:\s*/, '');
    bodyStartIndex = 1;
  }

  const body = lines.slice(bodyStartIndex).join('\n').trim();
  if (!subject && !body) return null;

  return {
    subject: subject || '(No subject)',
    body: body || text.trim(),
  };
}

export const geminiService = {
  async generateEmail(req: EmailRequest): Promise<GeneratedEmail> {
    return callGemini(buildGeneratePrompt(req));
  },

  async improveEmail(emailText: string): Promise<GeneratedEmail> {
    return callGemini(buildImprovePrompt(emailText));
  },

  async generateReply(req: ReplyRequest): Promise<GeneratedEmail> {
    return callGemini(buildReplyPrompt(req));
  },
};
