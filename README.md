Project: AI Virtual Assistant — fullstack app (React frontend + Express/Mongo backend) that lets users create a personalized voice-enabled assistant which calls a Gemini-like LLM service to parse voice/text into structured commands.

Quick Start

Prereqs: Node 18+, npm, MongoDB, Cloudinary account, Gemini API endpoint.
Backend (from repo root):
Frontend:
Environment variables (backend .env)

PORT — server port (server.js reads process.env.PORT)
MONGO_URI — MongoDB connection string
JWT_SECRET — JWT signing secret
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — for image uploads
GEMINI — Gemini API URL (used by gemini.js)
Confirm values and domain allowlist for CORS.
Backend — key files

server.js:1 — boots app and connects DB.
app.js:1 — Express app, CORS config, JSON & cookies, mounts routers.
gemini.js:1 — posts prompts to LLM endpoint and returns raw JSON string.
db.js:1 — mongoose connect.
Routes:
auth.routes.js:1 — /api/auth register/login/logout.
user.routes.js:1 — /api/user currentuser, update, asktoassistant.
Controllers:
auth.controller.js:1 — register/login/logout, sets cookie token.
user.controller.js:1 — get current user, update assistant (image/name), askToAssistant (calls Gemini and handles typed responses).
Model:
user.model.js:1 — user schema: name, email, password, assistantName, assistantImage, history[]. Includes generateToken() and comparePassword().
Middleware:
auth.middleware.js:1 — reads JWT from cookie/authorization, sets req.userId.
multer.middleware.js:1 — stores uploaded images to ./public (then uploaded to Cloudinary).
Service:
cloudinary.js:1 — uploads file path to Cloudinary and unlinks local file.
API Reference

POST /api/auth/register
Body: { name, email, password }
Success: sets cookie token (httpOnly) and returns user object.
POST /api/auth/login
Body: { email, password }
Success: sets cookie token, returns user.
GET /api/auth/logout
Clears cookie token.
GET /api/user/currentuser
Auth required (cookie). Returns user (password removed).
POST /api/user/update
Auth required. multipart/form-data: assistantName, assistantImage (file) OR imageUrl (string).
Updates user assistantName/assistantImage and returns updated user.
POST /api/user/asktoassistant
Auth required. Body: { command }
Flow: saves command to user.history, sends prompt to Gemini via geminiResponse(command, assistantName, userName). Expects Gemini to return plain JSON object embedded in text; controller extracts JSON with regex, parses it, then maps type to actions or computed responses (get_time/date/day/month use moment).
Assistant JSON format expected from Gemini (example):
{
"type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | ...,
"userInput": "<original user input or search text>",
"response": "<short voice-friendly reply>"
}

Frontend — key files

package.json:1 — Vite + React; dev script uses vite.
main.jsx:1 — app entry, wraps with UserContext.
App.jsx:1 — routes: / home, /signup, /login, /customize, /customize2.
UserContext.jsx:1 — central client state, serverUrl points to deployed backend, fetches /api/user/currentuser, exposes getGeminiResponse(command) -> POST /api/user/asktoassistant.
Components:
SignUp.jsx:1 — register UI, POST /api/auth/register.
Login.jsx:1 — login UI, POST /api/auth/login.
Customize.jsx:1 — choose or upload assistant image.
Customize2.jsx:1 — set assistant name and POST /api/user/update.
Home.jsx:1 — main voice UI: uses Web Speech API for continuous recognition and SpeechSynthesis for speaking; on hearing assistant name it sends transcript to backend via getGeminiResponse and then performs actions (open URLs) based on type.
Notes:
UserContext.serverUrl currently hard-coded to https://ai-virtual-assistant-backend-5v5q.onrender.com. Adjust for local dev (http://localhost:8000) and ensure CORS origin in backend app.js matches.
Data model overview

user:
_id, name (string), email (unique), password (hashed), assistantName (string), assistantImage (URL string), history (array of strings), timestamps.
Assistant flow summary

Frontend records voice, waits for assistant name in transcript.
When triggered, sends command text to backend /api/user/asktoassistant.
Backend user.controller.askToAssistant:
appends command to user.history,
calls geminiResponse(command, assistantName, userName) (sends a crafted prompt to process.env.GEMINI),
extracts JSON payload from response, parses type, and returns appropriate response or computed values (date/time via moment).
Frontend receives response, speaks it with SpeechSynthesis and may open search URLs.
Security & Deployment notes

Cookies: backend sets httpOnly cookie token with sameSite: "None" and secure: true — requires HTTPS and matching domain.
CORS in app.js:1 restricts to https://ai-virtual-assistant-q7cg.onrender.com — update for local testing or other deploy targets.
auth.middleware attempts to read token from cookie or Authorization header but split('')[1] is wrong (should be .split(' ')[1]) — this is a bug to fix to support Bearer tokens.
gemini.js expects the LLM to return a JSON object embedded inside response text; ensure the prompt enforces JSON-only output (it tries to).
Multer stores uploads to ./public then Cloudinary service unlinks local file.
Known issues / recommendations

Fix auth.middleware token parse bug: replace split('')[1] with split(' ')[1].
Validate and sanitize inputs in controllers (e.g., file names, assistantName).
Improve error handling and consistent API error shapes.
Add unit/integration tests and environment-specific configs.
Consider returning structured JSON directly from Gemini (avoid regex extraction) or wrap LLM call to guarantee pure JSON.
Add CSRF protections if using cookies for auth in browsers.
Make serverUrl configurable via frontend env (e.g., .env.local) and align CORS allowed origins.
