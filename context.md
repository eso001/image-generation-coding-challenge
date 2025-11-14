Context — AI Mockup & Visual Generator (MVP)
Version: MVP v1
Scope: Single-screen image generation & refinement with bottom-fixed prompt input
Goal: Let users type a prompt, generate an image, and refine it — all from one screen with minimal UI friction.

1. Product Overview
This product is a simple, powerful AI visual generator that lets users:
Enter a text description
Generate an image or mockup
Refine that image continuously by writing additional instructions
Stay in one seamless interface with the prompt box fixed at the bottom of the screen
The MVP focuses on speed, clarity, and iteration, rather than complex controls.

2. Key Principles
- Minimal UI → Maximum creativity
Only one screen. No navigation. No clutter.
- Prompt-first interaction
The prompt box remains fixed at the bottom at all times.
- Instant refinement
Every new message builds on the currently displayed image.
- Stay out of the user's way
Users shouldn’t click through menus, dropdowns, or attributes.
Prompts alone power the generation.
- Easy reset
When users want to start fresh, one button clears everything.

3. MVP Feature List (Finalized)

- 3.1 Single-Screen Layout

All functionality happens on one page.
Sections:
Header (optional small)
Scrollable visual output area
Bottom-fixed prompt input bar

- 3.2 Prompt Input (Bottom-Fixed)

Placement:
Always anchored to the bottom of the screen
Never moves, even when images load
Includes:
Text input (multi-line optional)
Button that dynamically switches label:
Before first generated image → Generate
After image exists → Refine

Behavior:
Submitting a prompt triggers image generation
Input remains visible even while image is loading
User can keep typing while generation runs

- 3.3 First Generation Flow

User types prompt
User clicks Generate
API generates an image
Image appears immediately in the scrollable main area
Button label switches to Refine
Future prompts now operate on the last generated image

- 3.4 Refinement Flow

User writes a new comment/instruction:
This is treated as a refinement
System references the last generated image’s seed/context
A new modified image is created
New image stacks under the previous one
Each refinement adds a new image in the scroll area
Creates a visual evolution thread

- 3.5 Clear / Start New Image

A simple UI control that:
Clear chat history (includes all images, should prompt user letting them know they will lose all image data)
Keeps the prompt box
Resets button back to Generate

UI Placements:
Top right corner of scroll area for ui control panel

- 3.6 Loading State

When an image is generating:
Show a small loader/spinner in the image area
Disable the button or change text to “Generating…”
Keep the prompt box visible so users can continue typing

- 3.7 Error Handling (simple)

If the API fails → show a small toast:
“Something went wrong. Try again.”

Allow immediate retry

- 3.8 No Extra Controls in MVP

The following are explicitly excluded for MVP:
❌ Style dropdowns
❌ Color palette selectors
❌ Multi-point star/radial sliders
❌ Image attribute diagrams
❌ Multiple variations
❌ Moodboards
❌ Sidebars
❌ Multi-screen flows
❌ Advanced editing UI

All these can be achieved through prompt text until v2+.

4. User Experience (UX) Summary
Screen opens → Empty canvas
Large empty output area
Prompt bar at bottom
Button reads Generate
User types prompt → hits Generate
Loader appears
First image appears
Button reads Refine
User types follow-up instructions
New image generated
Old image replaced or stacked (depending on implementation)
User hits Clear
Canvas wiped
Prompt preserved (optional)
Button resets to Generate

5. Technical Requirements
Front-end
One-page layout
Scrollable middle section
Bottom-fixed input bar (CSS position: fixed)

React state:
currentImage
history (optional for stacked mode)
isLoading
error

Back-end
Endpoint for:
POST /generate → initial image
POST /refine → modified image based on last seed/image ID

Must store:
last image seed or reference
user thread ID (optional for MVP)
Image hosting / display
Use base64 or temp blob URLs for MVP
Add persistent hosting in later versions

6. Out-of-Scope (MVP)
These may appear in future versions but are NOT included now:
Style parameter controls
Multi-image variation output
Moodboard generator
Saved projects
Export tools
Download options (unless trivial)
Timeline view
Attribute visualizer
User accounts / authentication
Multi-model support
Sharing features
Keep the MVP tight.

7. Success Criteria (MVP)
Functional success
User can generate their first image with a prompt
User can refine that image at least once
UI remains clean, simple, and intuitive
No navigation required
UX success
Prompt box is always visible
Image generation feels responsive
Refining feels natural and conversational
Technical success
Stable generation API
Clear loading states
No crashes or broken interactions
