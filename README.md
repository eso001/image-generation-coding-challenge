# AI Mockup & Visual Generator (MVP)

Single-screen web workspace for prompt-based image generation and iterative refinements, powered by Nano Banana (Gemini) under the hood.

[![Watch the demo](image-demo-thumbnail.png)](image-generation-site.mp4)

---

## 1. Setup

1. **Prereqs**
   - Node.js ≥ 20 (recommended via `nvm install 20 && nvm use 20`)
   - npm ≥ 10 (ships with Node 20)

2. **Install dependencies**
   ```bash
   npm install # installs root dev deps (concurrently)
   npm install --prefix server
   npm install --prefix client
   ```

3. **Environment variables**
   - Create `server/.env` (or `.env` in repo root) with:
     ```bash
     NANO_API_KEY=your_nano_banana_or_gemini_api_key
     # optional override, defaults to gemini-2.5-flash-image
     NANO_MODEL_ID=gemini-2.5-flash-image
     PORT=4000 # optional; Express listens here
     ```
   - If you proxy to a remote API server, set `NEXT_PUBLIC_SERVER_BASE_URL` in `client/.env` (defaults to `http://localhost:4000` in dev).

4. **Run locally**
   ```bash
   npm run dev
   # starts Express on 4000 and Next.js (Vite-based dev server) on 3000 with API rewrites
   ```
   Visit `http://localhost:3000`.

---

## 2. Usage Guide

1. **Initial state**
   - Landing view shows a short hero message, empty history column, and the bottom-fixed prompt dock.

2. **Generate**
   - Type a descriptive prompt (e.g., “glass dashboard hovering above neon waves”) and press **Generate** or `⌘+Enter`.  
   - Loader animates inside a history card; once the Nano API returns, the full image displays and the button label flips to **Refine**.

3. **Refine**
   - Enter follow-up instructions (“add holographic timeline overlays”) and hit **Refine**.  
   - Backend sends prompt + latest base64 image back to the model. Each pass stacks as a new card while preserving metadata.

4. **Clear**
   - Use the **Clear** button in the top-right to wipe the thread. Confirmation dialog prevents accidental loss; front/back end both reset.

5. **Errors**
   - Any API failure surfaces a toast near the prompt bar (“Something went wrong. Try again.”). Re-submit immediately or clear/reset.

---

## 3. Architecture Notes

- **Client** (Next.js 14 + TypeScript)
  - `app/page.tsx`: single-screen layout (header, scrollable history, fixed prompt dock).
  - `components/providers/thread-provider.tsx`: React context + reducer orchestrating history, loading, errors, thread IDs, and backend calls.
  - `components/history-card.tsx`: animated cards showing loader/ready/error states, optimized via `next/image`.
  - `components/prompt-bar.tsx`: multi-line textarea + dynamic button, keyboard shortcuts, and helper copy.
  - Design system leverages Tailwind, shadcn-style primitives (custom button/textarea), Lucide icons, and framer-motion for micro-interactions.

- **Server** (Express 5)
  - `/api/generate` and `/api/refine` route through `@google/genai` (Nano Banana) using the `GoogleGenAI` SDK.
  - Thread map stores `lastImageBase64`, `mimeType`, `seed`, and iteration count per client-generated UUID.
  - `/api/clear` flushes backend context; `/api/hello` remains as a health check.
  - Response payloads are normalized to `{ imageId, imageData (data URL), seed }` so the front end can remain agnostic to provider specifics.

- **Data Flow**
  1. Client generates a unique thread ID on mount.
  2. Submit handler posts `{ prompt, threadId, lastImageId, lastSeed }` to the server.
  3. Server calls Nano Banana (with inline base image data during refinements) and returns base64 image + identifier.
  4. Client reducer resolves pending entry → displays card → updates `lastSeed/lastImageId`.

---

## 4. Focus & Trade-offs

- **Invested heavily in**:
  - UX fidelity: fixed prompt dock, animated history thread, accessible interactions, and refined dark UI polish.
  - State management clarity: deterministic thread reducer, auto-scroll, error toasts, and consistent button state logic.
  - Backend adaptability: thread-aware Nano Banana adapter with clear validation and future-ready hooks (model override, error messaging).

- **Deferred / Next steps**:
  1. Production-grade logging/observability (structured logs, tracing, retry policies).
  2. Persistent storage per user (Redis/DB) instead of in-memory thread map.
  3. Authentication and multi-user separation.
  4. Download/export UX and gallery management.
  5. Automated tests (unit + integration) once a stable CI Node version is defined.

Follow the checklist in `checklist.md` for completion status of MVP milestones.
