# mailmind_ai_email_generator
# 📧 MailMind – AI Email Generator & Writing Assistant

MailMind is a **Generative AI-powered email assistant** that helps users create, improve, and reply to emails quickly using Google's Gemini API.

The application allows users to provide simple instructions and generate professional, personalized email content using AI.

## ✨ Features

### 1. AI Email Generator

Generate complete emails by providing:

* Recipient
* Email purpose
* Tone
* Email length

### 2. 🔄 Regenerate Email

Generate a different version of an existing AI-generated email.

### 3. ✏️ Improve Email

Improve an existing email by making it:

* More professional
* Clearer
* Grammatically correct
* Better structured

### 4. ↩️ AI Reply Generator

Paste an email you received and let AI generate an appropriate reply based on the selected tone.

### 5. 📋 Copy to Clipboard

Copy generated emails and replies with one click.

### 6. 🎭 Multiple Tones

Supports:

* Professional
* Formal
* Friendly
* Casual
* Apologetic

### 7. 📏 Multiple Lengths

Supports:

* Short
* Medium
* Detailed

## 🤖 Generative AI

MailMind uses the **Google Gemini API** to dynamically generate email content.

Unlike traditional email templates, MailMind does not simply return predefined text. The Gemini model understands the user's instructions and generates new content based on:

* User requirements
* Recipient
* Tone
* Length
* Email context

## 🛠️ Technologies Used

* React
* TypeScript
* Vite
* Tailwind CSS
* Google Gemini API
* JavaScript/TypeScript
* Git & GitHub

## 🏗️ Application Flow

```text
User Input
    ↓
React Frontend
    ↓
Gemini Service
    ↓
Google Gemini API
    ↓
AI Generated Response
    ↓
Email / Reply Display
    ↓
Copy / Regenerate / Improve
```

## 📁 Project Structure

```text
src/
├── components/
├── services/
│   └── geminiService.ts
├── pages/
├── types/
├── App.tsx
└── main.tsx

.env
.env.example
```

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd mailmind
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Start the application

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Environment Variables

| Variable              | Description           |
| --------------------- | --------------------- |
| `VITE_GEMINI_API_KEY` | Google Gemini API key |

**Never commit your `.env` file or expose your API key in GitHub.**

Make sure `.env` is included in `.gitignore`.

## 🧪 Example

### Input

```text
Recipient: HR Manager
Purpose: Apply for Java Developer position
Tone: Professional
Length: Medium
```

### Output

MailMind uses Gemini to generate a personalized professional email based on the provided information.

## 🎯 Future Improvements

* User authentication
* Email history
* Database integration
* Multiple AI model support
* Gmail integration
* Outlook integration
* AI-powered subject suggestions
* Multilingual email generation
* Server-side API integration for improved API-key security

## 👩‍💻 Author

**Nikhitha Siddabattula**

## 📄 License

This project is created for educational and portfolio purposes.

