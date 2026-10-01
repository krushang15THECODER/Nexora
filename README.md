<div align="center">
  <h1>🌟 Nexora</h1>
  <p>A Full-Stack AI Chat Application integrated with OpenRouter.</p>
</div>

## 📖 Overview
Nexora is a modern, responsive AI chat platform that allows users to interact with multiple AI models through a sleek interface. It features robust authentication, real-time message handling, smart context summarization, and token usage tracking to ensure efficient API usage.

## 🚀 Key Features
- **User Authentication:** Secure JWT-based login and registration using bcrypt.
- **AI Integration:** Seamlessly connect with multiple AI models via OpenRouter.
- **Smart Context Management:** Automatically summarizes older messages to manage context windows efficiently and save tokens (via `summaryService`).
- **Rate Limiting & Token Tracking:** Redis-backed token usage tracking to enforce limits over specific time windows.
- **Modern UI:** Built with React, Vite, and TailwindCSS for a premium and highly responsive user experience.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router v7
- **Markdown Rendering:** React Markdown & Remark GFM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Caching & Rate Limiting:** Redis
- **AI Gateway:** OpenRouter SDK / OpenAI SDK
- **Security:** bcrypt, jsonwebtoken (JWT), Zod for data validation

## 🔄 Application Flow (Request Lifecycle)

1. **User Authentication:** 
   - Users register/login through the Auth APIs.
   - The backend validates credentials and issues an HttpOnly JWT cookie for secure sessions, mitigating XSS risks.
2. **Chat Initialization:**
   - User starts a new chat on the frontend, selecting their preferred AI model.
   - The backend initializes a new Chat document in MongoDB and assigns a generated topic.
3. **Messaging Flow & Context Aggregation:**
   - The user sends a message, which the frontend dispatches to the `/msg/:chatId` endpoint.
   - The backend validates the input and constructs the AI prompt (`utils/chatContext.js`).
   - *Optimization Step:* If the chat history is extensive, the `summaryService` dynamically compresses past context to minimize token overhead and keep within model limits.
   - The payload is routed through `openRouterServices.js` to the target LLM.
   - The AI's response is received, saved to MongoDB as an assistant message, and returned to the client.
4. **Token Management & Rate Limiting:**
   - After each LLM interaction, the exact prompt/completion token usage is logged.
   - Redis tracks the user's token consumption using atomic increments (`INCRBY`).
   - If usage exceeds the configured `TOKEN_LIMIT` within the `TOKEN_WINDOW_SECONDS`, subsequent requests are rate-limited with a `429 Too Many Requests` response.

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Redis server running
- OpenRouter API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd gpt
   ```

2. **Backend Setup**
   ```bash
   # Install dependencies
   npm install

   # Start the development server (runs on port 3000 by default)
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install

   # Start the frontend dev server
   npm run dev
   ```

### Environment Variables
Create a `.env` file in the root directory with the following keys:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
TOKEN_LIMIT=100000 
TOKEN_WINDOW_SECONDS=86400
NODE_ENV=development
```

## 📐 Architecture Decisions for Interviewers

- **Why Redis for Rate Limiting?** Redis is used for extremely fast, in-memory tracking of token usage. It naturally supports key expiration (TTL), making it perfect for sliding-window rate limiting (e.g., max 100k tokens per 24 hours).
- **Why OpenRouter?** OpenRouter provides a unified API interface for various LLMs (GPT-4, Claude 3, Llama, etc.). This allows Nexora to offer extensive model choices to the user without needing to implement or maintain multiple provider-specific SDKs.
- **Smart Summarization (The Context Window Problem):** LLMs have maximum context windows and charge per token. To prevent chat history from growing infinitely and consuming massive tokens, the application asynchronously triggers a summarization of older messages, replacing large blocks of history with a dense, context-rich summary.
- **Security Posture:** JWTs are intentionally stored in `HttpOnly` cookies rather than `localStorage` to protect user sessions from Cross-Site Scripting (XSS) attacks. CORS is strictly configured to only allow the designated frontend origins.
