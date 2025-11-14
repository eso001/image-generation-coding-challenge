## AI Visual Generator — Build Rubric

1. **Layout & Information Hierarchy**
   - Single-screen composition with clear zones (header, thread, fixed prompt)
   - Consistent spacing rhythm, responsive grid that preserves intent across breakpoints
   - Visual weight prioritizes prompt input and latest image

2. **Interaction & Flow Excellence**
   - Prompt-to-image workflow frictionless; button states mirror context (Generate vs Refine vs Loading)
   - Refinements stack coherently with metadata and auto-scroll behavior
   - Clear/reset experience is discoverable, safe, and fast

3. **Visual Polish & Brand Feel**
   - Tailwind + shadcn/Radix primitives yield refined surfaces, depth, and contrast
   - Typography (Inter/Geist family) and iconography (Lucide/Heroicons) feel cohesive
   - Micro-interactions (Motion) reinforce liveliness without distraction

4. **Reliability & State Management**
   - Robust client state (history, loading, errors) synced with backend seeds/ids
   - API contracts typed, failures handled with informative toasts and retry paths
   - Backend simulates deterministic generations and maintains thread context

5. **Performance, Responsiveness & A11y**
   - Mobile-safe prompt bar (safe-area), lazy image loading, minimal layout shift
   - Keyboard and screen-reader friendly controls; aria-live feedback for status
   - No blocking interactions; heavy work off main thread where possible

6. **Delight & Finish**
   - Thoughtful empty/loading states, gradients, and subtle animations create “wow”
   - Documentation/checklist alignment proving coverage of MVP requirements
