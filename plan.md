## Implementation Roadmap — AI Mockup & Visual Generator (MVP v1)

### 1. Objectives & Guardrails
- Deliver a single-screen experience where users generate and refine images via text prompts with minimal chrome.
- Keep the prompt input anchored to the bottom at all times; no auxiliary controls beyond Clear.
- Support initial generation, iterative refinement, simple loading/error states, and history reset.
- Defer all advanced features (styles, multi-variations, moodboards, auth, downloads) to later phases.

### 2. UX & UI Plan
- **Layout Skeleton**: Optional slim header, scrollable image thread area, bottom-fixed prompt bar.
- **Prompt Bar**: Multi-line text area + primary button whose label toggles `Generate` → `Refine`; stays visible while jobs run.
- **Image Thread**: Each generation/refinement posts a card with timestamp, prompt snippet, loader placeholder, error state, and final image.
- **Clear Control**: Top-right action in the scroll area; confirmation modal/toast before wiping history and resetting button label.
- **States**: Explicit visuals for empty canvas, loading spinner overlay, inline error toast (“Something went wrong. Try again.”).

### 3. Frontend Implementation
1. **Scaffold**
   - React single-page shell with CSS grid or flex column ensuring bottom-fixed prompt (`position: sticky/fixed`).
   - Global state via React Context or lightweight store tracking `currentImage`, `history[]`, `isLoading`, `error`.
2. **Prompt Flow**
   - Submit handler routes to `/generate` when no history, `/refine` otherwise.
   - Disable button or change label to `Generating…` while `isLoading=true`; keep textarea editable.
3. **History Rendering**
   - Append new entries on success; include prompt text and image blob/base64.
   - Decide whether to stack (preferred per spec) vs replace; implement stacking list with auto-scroll to latest.
4. **Clear Action**
   - Confirmation modal; on confirm reset state (`history=[]`, `currentImage=null`, `buttonLabel=Generate`).
5. **Error + Retry**
   - Capture API failures; show toast anchored near prompt bar; maintain last prompt so user can re-submit instantly.
6. **Responsive Polish**
   - Ensure prompt bar works on mobile viewport heights; handle keyboard overlap; keep scrollable area performant.

### 4. Backend Implementation
1. **API Surface**
   - `POST /generate`: accepts `prompt`, returns `imageId`, `imageData/base64`, `seed`.
   - `POST /refine`: accepts `prompt`, `lastImageId/seed`; returns updated image payload.
2. **Session Context**
   - Store latest `seed` or `imageId` per client (in-memory map keyed by temporary session token or client-sent thread ID).
3. **Image Service Adapter**
   - Thin wrapper over chosen AI model (e.g., GPT Image 1 or Nano Banana) handling prompt text, seed injection, timeout/retry.
4. **Asset Handling**
   - For MVP, respond with base64 data or signed temp URLs; no persistent storage required yet.
5. **Error Surfacing**
   - Standardized error object with message + retry-safe status; log failures for later observability.

### 5. Data & State Contracts
- Frontend history item: `{ id, prompt, status: 'loading'|'ready'|'error', imageData?, seed? }`.
- Backend response: `{ id, imageData, seed }` or `{ error: message }`.
- Maintain last seed/reference client-side to seed refine calls; backend cross-validates against stored session map.

### 6. Technical Considerations
- **Loading Control**: Prevent overlapping requests by queuing; allow typing during generation but block submission until completion or allow queueing with clear UI indicator (decide explicitly).
- **Accessibility**: Focus management on prompt textarea, announce status changes (aria-live region for loader/error).
- **Performance**: Lazy-load large images, revoke object URLs when clearing history.
- **Reset Flow**: Clearing should also tell backend to drop stored context for that thread.

### 8. Success Checklist
- User generates first image via prompt.
- User refines at least once with stacked visual history.
- Prompt bar never leaves viewport; loading/error states always visible.
- Clear action wipes history, leaves prompt ready for next idea.
