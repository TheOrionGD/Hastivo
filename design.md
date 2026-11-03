# HASTIVO --- Editorial / Swiss Grid Design System

**Document:** `design.md`\
**Product:** Hastivo --- bidirectional Indian Sign Language (ISL)
communication\
**Status:** Design and frontend implementation specification\
**Scope:** All client-side routes, shared components, interaction
states, responsive behaviour, themes, motion, accessibility and visual
QA.

------------------------------------------------------------------------

## 1. Purpose and governing principles

This document defines the single visual and interaction system for the
Hastivo client application. It is the implementation contract for
designers and frontend engineers.

The product must use a **genuine Editorial / Swiss International
Typographic design language**: typography-led hierarchy, asymmetric but
disciplined grids, strong alignment, intentional whitespace, thin
structural rules and direct presentation of information.

This is not a generic SaaS dashboard, a sci-fi HUD, or a collection of
cards.

### 1.1 Non-negotiable principles

1.  **Typography carries hierarchy.** Use scale, weight, line length and
    spacing before adding containers or decoration.
2.  **Grid before decoration.** Every region aligns to a shared
    responsive grid and baseline rhythm.
3.  **Prefer open layouts.** Use whitespace and dividers instead of
    enclosing every section in a card.
4.  **Purpose-specific composition.** Routes share tokens and
    components, not identical page templates.
5.  **Function over ornament.** Every visual element must communicate
    structure, state, or action.
6.  **Preserve the application.** Replace the old visual system, not
    backend services, data contracts, route permissions, or working
    interaction logic.
7.  **Accessible by construction.** Contrast, keyboard use, reduced
    motion, semantic structure and assistive technology support are
    requirements, not polish.
8.  **Truthful system status.** Never display a service as healthy,
    connected, private, or verified unless the application has actually
    measured that state.

### 1.2 Reference hierarchy

When design decisions conflict, use this order:

1.  This design system and the approved Hastivo brand/theme
    specification.
2.  The approved Hastivo initialization-screen reference for its
    specific composition.
3.  Route-specific functional requirements.
4.  Existing implementation, only where it contains required behaviour
    or technical constraints.

Do not copy text baked into a background image. All interface text must
be real, selectable, accessible HTML. Background imagery must not
contain duplicate headings, labels, or buttons.

------------------------------------------------------------------------

## 2. Product and route scope

The route inventory below contains **31 routes** supplied for this
project. Do not silently add, rename, merge or omit routes. If the
actual `routeRegistry.js` differs, reconcile the registry with the
product owner before changing paths.

### 2.1 Public routes

  --------------------------------------------------------------------------
  Route                      Screen                  Primary purpose
  -------------------------- ----------------------- -----------------------
  `/`                        Splash / initialization Real environment
                                                     diagnostics and avatar
                                                     selection

  `/landing`                 Landing page            Explain Hastivo and its
                                                     capabilities

  `/onboarding`              Onboarding              Teach navigation,
                                                     permissions and core
                                                     workflows

  `/signin`                  Sign in                 Authenticate citizens
                                                     and administrators

  `/register`                Register                Create an account and
                                                     set initial preferences

  `/forgot-password`         Forgot password         Request a secure reset
                                                     link

  `/reset-password`          Reset password          Set a password using a
                                                     valid token

  `/verify-email`            Email verification      Verify account email

  `/terms`                   Terms & conditions      Legal terms and user
                                                     guidance

  `/privacy`                 Privacy policy          Explain data,
                                                     camera/microphone and
                                                     encryption practices

  `/help`                    Help & support          FAQs, troubleshooting
                                                     and feedback

  `/about`                   About Hastivo           Product architecture
                                                     and specifications

  `/camera-permission`       Camera permission guide Explain and test camera
                                                     access

  `/microphone-permission`   Microphone permission   Explain and test
                             guide                   microphone access
  --------------------------------------------------------------------------

### 2.2 Citizen routes

  -----------------------------------------------------------------------
  Route                   Screen                  Primary purpose
  ----------------------- ----------------------- -----------------------
  `/dashboard`            Citizen dashboard       Entry point to
                                                  communication workflows

  `/text-to-sign`         Text-to-Sign            Convert text or speech
                                                  into ISL avatar
                                                  animation

  `/sign-to-text`         Sign-to-Text            Recognize
                                                  camera-captured ISL and
                                                  produce text/speech

  `/conversation`         Real-time conversation  Bidirectional sign and
                                                  speech communication

  `/history`              Conversation history    Search, replay and
                                                  export previous
                                                  sessions

  `/profile`              User profile            Manage personal and
                                                  account information

  `/settings`             Settings                Configure theme,
                                                  avatar, audio and
                                                  accessibility
  -----------------------------------------------------------------------

### 2.3 Administrator routes

  ----------------------------------------------------------------------------
  Route                      Screen                  Primary purpose
  -------------------------- ----------------------- -------------------------
  `/admin`                   Administrator dashboard Platform health, activity
                                                     and safety overview

  `/admin/moderation`        AI moderation alerts    Review automated safety
                                                     alerts

  `/admin/flagged-content`   Flagged content review  Inspect evidence and
                                                     record moderation
                                                     decisions

  `/admin/restrictions`      User restrictions       Apply and review account
                                                     restrictions

  `/admin/users`             User management         Search and manage user
                                                     accounts and roles

  `/admin/audit`             Audit records           Review chronological
                                                     administrative/security
                                                     events

  `/admin/telemetry`         Admin telemetry         Monitor measured service
                                                     and rendering performance

  `/admin/service-config`    Service configuration   Manage approved service
                                                     configuration
  ----------------------------------------------------------------------------

### 2.4 Diagnostic and specialist routes

  ------------------------------------------------------------------------
  Route                    Screen                  Primary purpose
  ------------------------ ----------------------- -----------------------
  `/avatar-test`           Avatar diagnostics      Inspect rig, joints,
                                                   blendshapes and
                                                   animation performance

  `/vocabulary-explorer`   ISL vocabulary explorer Search, inspect and
                                                   preview ISL signs
  ------------------------------------------------------------------------

### 2.5 Route and access rules

-   Public routes must not require authentication.
-   Citizen routes require an authenticated citizen session.
-   Administrator routes require a verified administrator role/claim
    enforced by the backend, not merely hidden navigation.
-   Specialist routes must follow the access policy already defined by
    the application. Do not assume they are public or admin-only without
    checking the route registry.
-   Preserve existing redirects, deep links, role checks and not-found
    behaviour.
-   Do not invent new route paths to solve a layout problem.

------------------------------------------------------------------------

## 3. Brand identity and colour system

The five brand colours are locked. They must not be changed by theme
switching or user accent preferences.

### 3.1 Immutable brand palette

  -----------------------------------------------------------------------
  Token                   Hex                     Role
  ----------------------- ----------------------- -----------------------
  `--brand-coral`         `#FF6F61`               Primary action and
                                                  important emphasis

  `--brand-blue`          `#6FA3EF`               Secondary actions,
                                                  links in dark theme,
                                                  information

  `--brand-amber`         `#FFC107`               Attention, warnings and
                                                  highlights

  `--brand-charcoal`      `#2E2E2E`               Brand identity and text
                                                  on brand fills

  `--brand-grey`          `#D1CFCF`               Neutral brand grey and
                                                  decorative dividers
  -----------------------------------------------------------------------

### 3.2 Theme tokens

**Light theme**

  Token                  Value
  ---------------------- -----------
  `--bg`                 `#FFFFFF`
  `--bg-secondary`       `#F5F6F8`
  `--surface`            `#FFFFFF`
  `--surface-elevated`   `#F5F6F8`
  `--text`               `#2E2E2E`
  `--text-secondary`     `#62666D`
  `--border`             `#D1CFCF`
  `--link-text`          `#2A63C0`
  `--focus-ring`         `#2E2E2E`

**Dark theme**

  Token                  Value
  ---------------------- -----------
  `--bg`                 `#17191E`
  `--bg-secondary`       `#1E2229`
  `--surface`            `#242830`
  `--surface-elevated`   `#2E333D`
  `--text`               `#FFFFFF`
  `--text-secondary`     `#C3C7CE`
  `--border`             `#41444B`
  `--link-text`          `#6FA3EF`
  `--focus-ring`         `#6FA3EF`

Brand-role tokens remain the same in both themes:

-   `--accent-primary: var(--brand-coral)`
-   `--accent-secondary: var(--brand-blue)`
-   `--highlight: var(--brand-amber)`
-   `--on-brand: var(--brand-charcoal)`

### 3.3 Colour usage and contrast rules

-   Use coral for primary actions and selected brand emphasis, not as a
    general-purpose text colour.
-   Use blue for secondary actions, links and information. In light
    theme, use `--link-text` for link text; raw brand blue does not
    provide sufficient contrast on white.
-   Use amber for warnings and attention states. Never rely on amber
    alone to communicate status.
-   Text on coral, blue or amber fills must use charcoal (`#2E2E2E`),
    never white.
-   Brand colours must not be used as small text in light theme unless a
    separately verified accessible token is provided.
-   Use `--border` for decorative dividers. Use a higher-contrast
    boundary for form controls and interactive component edges.
-   Status must never rely on colour alone. Pair colour with a text
    label and/or icon.
-   Meet WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text and
    meaningful UI boundaries/graphics.
-   Do not introduce arbitrary gradients. If a route uses the approved
    coral/blue avatar lighting, keep it inside the avatar visual stage
    and ensure interface text remains readable.

### 3.4 CSS token foundation

``` css
:root {
  /* Locked brand colours */
  --brand-coral: #FF6F61;
  --brand-blue: #6FA3EF;
  --brand-amber: #FFC107;
  --brand-charcoal: #2E2E2E;
  --brand-grey: #D1CFCF;
  --on-brand: #2E2E2E;

  /* Stable brand roles */
  --accent-primary: var(--brand-coral);
  --accent-secondary: var(--brand-blue);
  --highlight: var(--brand-amber);

  /* Light theme */
  --bg: #FFFFFF;
  --bg-secondary: #F5F6F8;
  --surface: #FFFFFF;
  --surface-elevated: #F5F6F8;
  --text: #2E2E2E;
  --text-secondary: #62666D;
  --border: #D1CFCF;
  --link-text: #2A63C0;
  --focus-ring: #2E2E2E;

  --font-sans: Inter, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  --rule-width: 1px;
  --motion-fast: 150ms;
  --motion-base: 300ms;
  --motion-slow: 500ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}

:root[data-theme="dark"] {
  --bg: #17191E;
  --bg-secondary: #1E2229;
  --surface: #242830;
  --surface-elevated: #2E333D;
  --text: #FFFFFF;
  --text-secondary: #C3C7CE;
  --border: #41444B;
  --link-text: var(--brand-blue);
  --focus-ring: var(--brand-blue);
}
```

No component may hard-code a brand or theme hex value. Components must
consume tokens.

------------------------------------------------------------------------

## 4. Typography system

Typography is the primary layout tool. Use a neutral grotesk sans-serif
for interface text and a restrained monospace face only for technical
metadata, protocol identifiers, timestamps and diagnostic values.

### 4.1 Type scale

Use fluid sizing where supported, with the following desktop targets:

  Style token      Desktop target     Weight Typical use
  -------------- ---------------- ---------- --------------------
  `display-xl`         112--144px   700--800 Splash wordmark
  `display-lg`          76--104px   700--800 Landing hero
  `heading-xl`           56--72px   650--750 Page title
  `heading-lg`           40--48px   600--700 Major section
  `heading-md`           28--36px   600--700 Subsection
  `heading-sm`           20--24px        600 Workspace heading
  `body-lg`                  18px   400--500 Introductory copy
  `body`                     16px        400 Standard body
  `body-sm`                  14px   400--500 Supporting copy
  `meta`                 11--12px   500--600 Uppercase metadata

These are target ranges, not permission to make every page oversized.
Use display typography only where hierarchy requires it.

### 4.2 Typography rules

-   Keep paragraph measure around 55--75 characters for comfortable
    reading.
-   Use sentence case for ordinary headings and controls.
-   Use uppercase with measured tracking for short metadata labels, not
    for long paragraphs.
-   Do not use monospace for all text; that creates a terminal aesthetic
    rather than an editorial product.
-   Avoid excessive letter spacing on large display headings.
-   Keep line-height tight for display headings (approximately
    0.95--1.1) and comfortable for body copy (approximately 1.45--1.65).
-   Use font weights and size before using colour to distinguish
    hierarchy.
-   Do not simulate the wordmark with a raster image containing
    duplicate text. Render the wordmark as live text or a proper vector
    logo asset.

### 4.3 Hastivo wordmark

-   Render "Sign" in the primary text colour and "ora" in coral.
-   Keep the wordmark on a shared baseline.
-   Use the approved brand typeface/logo asset if one exists.
-   Do not stretch the wordmark or use arbitrary transforms to imitate a
    reference.
-   On splash and landing pages, the wordmark may be oversized. In
    application navigation, use a compact brand lockup.

------------------------------------------------------------------------

## 5. Grid, layout and spacing

### 5.1 Responsive grid

  -----------------------------------------------------------------------
  Breakpoint              Grid                    Layout guidance
  ----------------------- ----------------------- -----------------------
  Wide desktop `>=1440px` 12 columns              Full editorial
                                                  composition; max
                                                  content width around
                                                  1600px

  Desktop `1024–1439px`   12 columns              Reduce outer margins
                                                  and display scale

  Tablet `768–1023px`     8 columns               Reflow asymmetric
                                                  spans; stack dense
                                                  workspaces

  Mobile `<768px`         4 columns               Single-column reading
                                                  flow; compact controls
  -----------------------------------------------------------------------

Suggested desktop margins: 48--64px. Suggested gutters: 24--32px. Tablet
and mobile spacing must scale down without compressing controls below
usable dimensions.

### 5.2 Layout rules

-   Establish one page-level grid and align headings, content, dividers
    and controls to it.
-   Use asymmetric spans intentionally: for example 7/5, 8/4 or 5/7,
    depending on content.
-   Use vertical rules only when they clarify distinct editorial
    regions.
-   Use horizontal rules to divide sections, tables and timelines.
-   Do not put a border around every section.
-   Avoid nested bordered containers.
-   Keep content aligned to consistent left/right edges.
-   Do not use absolute positioning for the whole page. Reserve it for
    decorative marks, controlled overlays and avatar-stage annotations.
-   Let content determine section height. Do not force all screens to
    fill space with decoration.

### 5.3 Cardless by default

The product is cardless by default.

Prefer: - Open sections. - Numbered editorial regions. - Flat data
rows. - Table-like structures. - Timelines. - Dividers. - Typographic
metrics. - Dedicated media workspaces.

A surface/container may be used when it materially improves grouping,
focus, containment or interaction---for example a modal, a video stage,
a code/diagnostic viewport, or a form field. Do not prohibit useful
containment; prohibit decorative card proliferation.

------------------------------------------------------------------------

## 6. Navigation architecture — floating command deck only

### 6.1 Absolute shell constraint

The entire client application must use a **headerless, navbar-free,
menubar-free and sidebar-free navigation architecture**. This applies to
all 31 routes: public, authentication, citizen, administrator and
specialist screens.

Do not render any of the following as persistent application chrome:

- Top header, app bar, masthead or toolbar containing navigation.
- Horizontal navigation bar or tab bar used to switch routes.
- Desktop or mobile sidebar, drawer or hamburger navigation menu.
- Menubar, breadcrumb navigation or footer link directory.
- Duplicate route links embedded in page chrome.

Do not preserve an existing header/sidebar merely because it is already
implemented. Remove or bypass the existing navigation shell and replace
it with the floating command-deck model described below. Keep page-level
content such as a screen title, status, back action within a workflow,
form controls and contextual actions; these are content controls, not a
global navigation bar.

The page canvas itself must remain editorial and open. Reserve the
necessary safe area for the floating deck without shrinking the main
content into a dashboard template.

### 6.2 Floating command deck — the only global route navigation

Build one reusable **Floating Command Deck** component and mount it at
the application root. It is the sole global mechanism for navigating
between routes. It must feel like a compact, floating tool palette, not
a conventional navigation bar or a large modal menu.

**Default closed state**

- Display a small floating launcher near the lower-right edge on LTR
  layouts and lower-left edge on RTL layouts, respecting safe-area insets.
- The launcher is a restrained circular or compact geometric control
  with a command/compass glyph and a visible keyboard hint (`⌘K` on
  macOS, `Ctrl K` elsewhere).
- It must float above page content with a subtle shadow and thin border;
  do not place it inside a card, footer, header or fixed bottom bar.
- It must not obscure camera controls, signing hands, captions, form
  submit actions or the avatar's active signing area. Allow per-route
  safe-position overrides and a user-accessible reposition option.

**Expanded deck state**

- Activating the launcher or pressing `Ctrl+K` / `Cmd+K` opens a compact
  floating deck anchored near the launcher, with a restrained overlay
  that does not visually replace the page.
- The deck contains searchable route commands grouped by access context:
  Public, Citizen, Administrator and Specialist. Show only routes the
  current session is permitted to access. The backend remains the
  authority for authorization.
- Each route is represented by a distinct simple icon plus a short
  **initial/monogram label** (normally one or two characters) and a
  readable route name. Initials are a visual shorthand, never the only
  accessible label.
- Use a disciplined grid of icon-command items, thin separators and
  typography-led labels. No nested cards, gradients, decorative tiles
  or oversized menu panels.
- Include a search input that filters route names and relevant keywords
  immediately. Support arrow-key navigation, Enter to open, Escape to
  close, and clear focus indication.
- Show the current route as selected using a small coral marker or
  typographic state, not a large filled tile.

### 6.3 Drag-to-center navigation interaction

The signature interaction is **drag an icon-command from the floating
deck and drop it into a central navigation target**:

1. When the deck opens, reveal a subtle central drop target in the
   viewport. It must be visually clear but must not cover or disable
   essential page controls.
2. The user can drag any permitted route icon from the deck toward this
   central target.
3. While dragging, show the dragged icon/monogram, a route-name label
   and a restrained target highlight. Do not use a full-screen animated
   transition or excessive particle effects.
4. On a valid drop, navigate to the selected route using the existing
   router. Close the deck and clean up drag state.
5. On an invalid drop, return the icon to its original position and
   provide a subtle, accessible explanation. Do not navigate.
6. On touch devices, support long-press then drag, with a tap-to-select
   and explicit **Open** action as the non-drag alternative.
7. The drag interaction must not be the only way to navigate. Every
   command must also be reachable through click/tap, keyboard selection
   and screen-reader controls. Provide a clearly visible selected-command
   state and an Enter/Open action.
8. Use pointer events with correct pointer capture and cancellation.
   Handle pointer-up outside the target, Escape, route changes, lost
   focus and component unmount without leaving a stuck overlay or drag
   state.

The center target is an interaction affordance, not a permanent logo or
content panel. Keep it hidden when the deck is closed.

### 6.4 Route-aware command catalogue

Use the route registry as the source of truth. Do not hardcode a second,
divergent route list inside the deck. Each command should derive its
route, label, icon, initials, keywords, access requirement and optional
keyboard shortcut from a central command definition associated with the
existing route registry.

- Public and authentication commands are available without a session.
- Citizen commands appear only for an authenticated citizen session.
- Administrator commands appear only when the verified session has the
  required administrator role.
- Specialist commands follow the access policy already defined by the
  application; do not infer permissions from route names.
- Preserve deep links, redirects, route guards, not-found handling and
  existing route paths.
- If a route is unavailable to the current user, do not show it as an
  enabled command. Do not treat hiding a command as authorization.
- When the user is inside a multi-step flow, provide a contextual Back
  action where the router/history supports it. Back is not a replacement
  global navigation menu.

### 6.5 Screen-specific behaviour

- **Splash (`/`)**: no persistent header or navigation chrome. The
  floating launcher may remain hidden until initialization completes;
  if shown, it exposes only routes allowed by the current session.
- **Landing and informational routes**: no public header, nav links or
  footer navigation. Use in-content calls to action and the floating
  command deck for route changes.
- **Onboarding**: use in-flow Previous, Next and Skip controls. These
  control the onboarding sequence and are not global navigation.
- **Authentication and recovery**: no header, sidebar or menu. Use
  contextual links only when essential to complete or recover the
  authentication task; global route discovery remains in the deck.
- **Citizen dashboard and workspaces**: no persistent route tabs or
  sidebar. The page content itself should prioritize the active task.
- **Translation and conversation screens**: the command deck must
  automatically move away from the camera preview, avatar stage,
  recognized signing region, captions and primary recording controls.
  Provide a one-action hide control during active capture/signing.
- **Administrator screens**: no admin sidebar or top admin bar. Admin
  commands are grouped in the floating deck and are visible only to
  authorized administrator sessions.
- **Avatar test and vocabulary explorer**: preserve the full viewport
  for the rig, controls and sign preview; position or temporarily hide
  the deck when it overlaps a critical manipulation region.

### 6.6 Footer policy

Do not use the footer as a secondary navigation system. If a route needs
legal, version or ownership information, render a minimal non-navigation
footer containing only relevant static metadata (for example copyright,
version and accessibility statement). Do not include route directories,
module link columns or repeated navigation links. Preserve any existing
route-specific footer exclusions where they are functionally required.

### 6.7 Implementation and accessibility requirements

- Implement the deck as one shared component, not separate route-level
  copies.
- Use the existing router and route registry; do not implement direct
  `window.location` navigation if the application uses a client router.
- Keep the deck state independent of the 3D avatar render loop. Opening,
  filtering or dragging the deck must not trigger unnecessary avatar
  rerenders or reset animation state.
- Use semantic buttons for commands and a labelled search field.
- Support keyboard-only use, screen readers, visible focus, Escape to
  close, and a logical focus return to the launcher.
- Respect `prefers-reduced-motion`; the deck must remain fully usable
  with transitions disabled.
- Meet WCAG 2.1 AA contrast and target-size expectations. Do not encode
  permission or selection state by colour alone.
- Support RTL layout, mirrored launcher placement and correct Urdu
  reading order. Do not mirror recognizable icon shapes unnecessarily.
- Persist only non-sensitive preferences such as launcher position or
  deck density. Never persist session tokens or permission decisions in
  client storage through this component.
- Add automated tests for route visibility by role, keyboard operation,
  pointer drag/drop, touch fallback, invalid drops, focus restoration,
  responsive placement and route navigation.

**Acceptance rule:** if a screenshot shows a persistent header, navbar,
menubar, sidebar, hamburger navigation, footer route directory or
another global route-navigation surface outside the Floating Command
Deck, the implementation fails this design specification.

------------------------------------------------------------------------

## 7. Core component specifications

Components should expose semantic variants and states, not
route-specific hard-coded styling.

### 7.1 Buttons

-   Primary: coral fill with charcoal text.
-   Secondary: transparent/neutral surface with visible border and text.
-   Tertiary: text action with underline or clear hover/focus
    affordance.
-   Destructive: explicit danger treatment with text label; do not rely
    on colour alone.
-   Minimum interactive target: 44×44 CSS px where practical.
-   Preserve visible focus rings.
-   Include disabled, loading and pressed states.
-   Avoid pill buttons by default; use restrained geometry consistent
    with editorial forms.

### 7.2 Inputs and forms

-   Use persistent labels; placeholders are supplementary, never the
    only label.
-   Use high-contrast boundaries for input controls.
-   Show validation close to the relevant field.
-   Provide clear required/optional status.
-   Provide visible focus, disabled, invalid and success states.
-   Keep field spacing consistent and group fields with headings or
    dividers rather than cards.
-   Password visibility must be keyboard accessible.
-   Do not expose authentication tokens or secret configuration in the
    UI.

### 7.3 Tables and data rows

-   Use semantic tables for genuinely tabular data.
-   Use editorial data rows for queues and lists.
-   Keep column headings clear and sortable controls labelled.
-   Support responsive horizontal scrolling or an accessible stacked
    representation.
-   Include loading, empty, error and populated states.
-   Pagination and filtering must be real controls if displayed.

### 7.4 Status indicators

Every status includes a text label and, where useful, an icon: -
Connected / Disconnected - Ready / Initializing / Failed - Verified /
Pending - Warning / Critical - Active / Suspended

Do not use colour-only dots as the sole status indicator.

### 7.5 Dialogs and notifications

-   Dialogs must have accessible names, focus management, Escape
    handling where safe, and return focus to the invoking control.
-   Confirm irreversible actions.
-   Notifications must not obscure primary controls or
    camera/translation content.
-   Use concise language and expose status to assistive technology.

### 7.6 AvatarStage

The 3D avatar is a functional visual workspace, not a decorative
screenshot.

Requirements: - Preserve the existing Three.js / React Three Fiber
rendering path and avatar asset. - Preserve the shared humanoid rig and
animation clips. - Keep both hands, fingers, wrists and facial
expression visible when signing requires them. - Use a stage background
and lighting that respond to theme tokens. - Provide loading, ready,
paused, unavailable and error states. - Do not replace the live avatar
with a static image. - Pause rendering when the browser tab is hidden
where technically safe. - Provide a reduced-motion/low-performance path
that does not block core functionality.

------------------------------------------------------------------------

## 8. Route-specific composition guidance

Shared design language does not mean identical templates. Use these
route-specific priorities.

### 8.1 Splash `/`

Composition: - Minimal protocol header. - Oversized Hastivo wordmark and
editorial statement on the left. - Startup diagnostics integrated into
the left content region. - Large avatar stage in the central-right
region. - Narrow annotation rail on the far right. - Bottom actions
aligned to the left content grid.

The approved reference composition is the visual target for this route.
Do not turn it into a three-equal-column dashboard. Keep all text live
in HTML and ensure the background visual contains no duplicate baked-in
text.

Diagnostics must reflect actual checks: WebGL availability, media API
availability, backend reachability and available avatar assets. Do not
hard-code a 5/5 success state.

### 8.2 Landing `/landing`

-   Editorial hero with strong brand statement and meaningful product
    demonstration.
-   Explain bidirectional communication in clear sections.
-   Show Text-to-Sign, Sign-to-Text and conversation workflows.
-   Use avatar imagery or live preview only where it supports the
    explanation.
-   Include accessibility, privacy and technology sections.
-   End with a clear registration/sign-in action.
-   Avoid a long grid of feature cards.

### 8.3 Onboarding `/onboarding`

-   One focused step at a time.
-   Large step number and clear title.
-   Short explanation with an illustration or live demonstration.
-   Progress indicator and Previous / Next / Skip.
-   Keyboard Left/Right support where appropriate.
-   Keep permission requests contextual and explain why access is
    needed.
-   Do not ask for camera/microphone access before it is relevant.

### 8.4 Authentication and account recovery

Routes: `/signin`, `/register`, `/forgot-password`, `/reset-password`,
`/verify-email`.

-   Keep forms narrow and readable.
-   Use clear headings and one primary action.
-   Preserve error, loading, success and token-expired states.
-   Do not imply a password reset or email verification succeeded until
    the backend confirms it.
-   Do not reveal whether an email exists when that would enable account
    enumeration.

### 8.5 Legal and informational pages

Routes: `/terms`, `/privacy`, `/about`, `/help`.

-   Use long-form editorial reading layouts.
-   Include a table of contents for long documents.
-   Use readable line length and heading hierarchy.
-   Use a search/filter area on Help.
-   Do not fabricate legal claims, data practices, architecture or
    certifications.

### 8.6 Permission guides

Routes: `/camera-permission`, `/microphone-permission`.

-   Explain purpose, browser/OS steps and troubleshooting.
-   Show the current permission state only if measured.
-   Provide a user-triggered test action.
-   Include unsupported-browser and permission-denied states.
-   Never repeatedly trigger permission prompts without user action.

### 8.7 Citizen dashboard `/dashboard`

-   Personalized greeting and concise status.
-   Clear entry points to Text-to-Sign, Sign-to-Text and Conversation.
-   Recent conversations as an archive/list, not a card wall.
-   Communication metrics only when backed by real data.
-   Recent activity and avatar status.
-   Use typographic metrics and editorial sections.

### 8.8 Text-to-Sign `/text-to-sign`

Primary hierarchy: 1. Large avatar stage. 2. Text/speech input
workspace. 3. Language and translation controls. 4. Playback timeline
and current-word progress. 5. Translation history or supporting context.

Requirements: - Keep avatar large enough for hand and facial grammar to
be read. - Highlight the current word in amber during playback,
consistent with project motion guidance. - Support pause, replay, speed
and stop. - Show processing and failure states. - Preserve text and
speech input behaviour. - No global footer on this route, per supplied
project specification.

### 8.9 Sign-to-Text `/sign-to-text`

Primary hierarchy: 1. Large live camera preview. 2. Recognition state
and capture controls. 3. Recognized text/transcript. 4. Confidence and
uncertainty information. 5. Speech output controls.

Requirements: - Camera preview must be the dominant media workspace. -
Landmark overlays should be legible and not obscure the hands. -
Uncertain recognition must be communicated honestly. - Provide camera
selection and permission/error states. - No global footer on this route,
per supplied project specification.

### 8.10 Real-time conversation `/conversation`

-   Make both communication directions immediately understandable.
-   Provide camera/sign capture, speech input, avatar output and
    transcript.
-   Show independent state for each direction.
-   Make microphone/camera active state explicit.
-   Provide start, pause, end and connection recovery controls.
-   Do not use decorative animations that obscure the transcript or
    signs.

### 8.11 History, profile and settings

`/history`: searchable chronological archive, date/type filters,
replay/export/delete actions and empty state.

`/profile`: personal details, account state, role and verification
status. Separate editable data from read-only account metadata.

`/settings`: grouped preferences for theme, avatar, signing speed,
audio, language, accessibility and notifications. Use clear current
values and immediate feedback for saved settings.

### 8.12 Administrator screens

`/admin`: operational overview using measured metrics and restrained
charts.

`/admin/moderation`: queue with severity, context, source, status and
review action.

`/admin/flagged-content`: evidence-first review workspace; show original
context, model explanation, confidence if available, and explicit
decision controls.

`/admin/restrictions`: searchable user selection, restriction type,
reason, duration, confirmation and history.

`/admin/users`: searchable, filterable semantic table with account
status and role. Sensitive actions require confirmation and
authorization.

`/admin/audit`: chronological, filterable audit log. Records should be
presented as immutable if the backend guarantees immutability; do not
claim immutability based only on UI.

`/admin/telemetry`: API latency, WebGL frame rate, errors and resource
metrics only where telemetry is actually collected. Show time range,
units, last updated and unavailable state.

`/admin/service-config`: validated configuration form. Keep secrets
masked and never expose backend secrets to the browser. Separate public
runtime configuration from server-only secrets.

### 8.13 Specialist screens

`/avatar-test`: - Avatar is the dominant stage. - Group controls into
skeleton/joints, facial blendshapes, animation playback and performance
diagnostics. - Provide 11 facial blendshape controls only if those 11
controls exist in the actual rig. - Show frame rate/draw calls only when
measured. - Avoid overwhelming the stage with every control at once; use
tabs or collapsible editorial sections.

`/vocabulary-explorer`: - Searchable vocabulary index. -
Category/alphabetical navigation. - Selected sign detail. - Large avatar
playback stage. - Gesture description and related signs. - Clear
no-results and unavailable-animation states.

------------------------------------------------------------------------

## 9. Motion and transitions

Motion should be short, purposeful and non-blocking. The supplied
project specification calls for a gaming-inspired but restrained motion
language.

### 9.1 Motion tokens

  Token               Duration
  ----------------- ----------
  `--motion-fast`        150ms
  `--motion-base`        300ms
  `--motion-slow`        500ms

Use one shared easing curve: `cubic-bezier(0.2, 0, 0, 1)`.

### 9.2 Interaction guidance

-   Route change: approximately 200ms exit fade and 350ms enter
    transition with a subtle 16px upward movement.
-   Splash: logo fades/scales in; avatar entrance and presentation
    animation may take about 4--5 seconds, but must be skippable by
    click or Enter.
-   Onboarding: horizontal transition around 350ms; progress and
    keyboard controls remain available.
-   Sign-in/register switch: approximately 300ms.
-   Text-to-Sign: avatar crossfades between signs; current word follows
    playback progress.
-   Sign-to-Text: landmark overlays follow camera frames; captions
    appear without blocking interaction.
-   Conversation: each direction animates independently; microphone
    listening state may pulse subtly.
-   Theme switch: approximately 250ms colour transition.
-   Notifications: short entrance; moderation alerts may pulse once, not
    continuously.
-   Loading: use skeletons for layout and an avatar thinking pose only
    when that pose exists.

### 9.3 Performance and reduced motion

-   Animate transform and opacity wherever possible.
-   Avoid animating layout dimensions, filters or large shadows
    continuously.
-   Respect `prefers-reduced-motion`: remove parallax, zoom and sliding
    transitions; use a simple fade or no animation.
-   Keep every screen usable if animation fails.
-   Never block input during transitions.
-   Pause the 3D scene and scroll-driven landing sequence when the tab
    is hidden, where technically safe.
-   Monitor frame rate on mid-range hardware.

------------------------------------------------------------------------

## 10. Accessibility and internationalization

### 10.1 Accessibility baseline

-   Target WCAG 2.1 AA.
-   Use semantic landmarks, headings, buttons, links, forms and tables.
-   All interactive elements must be keyboard operable.
-   Focus must be visible and never removed.
-   Provide accessible names for icon-only controls.
-   Associate field labels and error text programmatically.
-   Announce important asynchronous status changes using appropriate
    live regions.
-   Do not rely on colour, motion, sound or position alone.
-   Provide captions/transcripts where audio content is presented.
-   Keep camera and avatar stages accompanied by text controls and
    status.
-   Ensure zoom/reflow does not hide controls or content.
-   Respect reduced motion and operating-system contrast preferences
    where supported.

### 10.2 Urdu and RTL

-   Support all existing interface languages.
-   Urdu must use true RTL layout, not merely right-aligned text.
-   Mirror directional layout and navigation where appropriate.
-   Do not reverse non-directional brand marks, numbers, technical
    identifiers or avatar movement controls unless the interaction
    requires it.
-   Use logical CSS properties (`margin-inline`, `padding-inline`,
    `inset-inline`) rather than left/right-only assumptions.
-   Verify mixed-direction text, URLs, timestamps and technical values.

### 10.3 Camera and microphone privacy

-   Request device permission only after a clear user action and
    explanation.
-   Show active capture state clearly.
-   Stop media tracks when the user ends capture or leaves the relevant
    workflow, unless a documented session requires otherwise.
-   Do not make privacy claims that are not verified by the actual
    implementation.
-   Never put secrets, private keys or backend credentials in the React
    renderer.

------------------------------------------------------------------------

## 11. Theme behaviour and persistence

-   Default theme for first-time anonymous users follows
    `prefers-color-scheme`.
-   User-selected theme is persisted in the user preference store so it
    survives sign-in on another device.
-   Apply a local preference before first paint where possible to avoid
    a flash of the wrong theme.
-   Use one theme provider and the `data-theme` attribute on the root
    element.
-   Theme changes update all CSS tokens and the avatar scene.
-   Theme switching must never alter the locked brand palette.
-   Accent selection, if present, is a separate preference and must not
    overwrite brand tokens.

------------------------------------------------------------------------

## 12. Technical implementation boundaries

This is a presentation-system replacement, not a backend rewrite.

### 12.1 Preserve

-   Existing route registry and route semantics.
-   Authentication and role enforcement.
-   API contracts and backend integrations.
-   WebSocket communication.
-   Database models and data flows.
-   Camera and microphone capture.
-   MediaPipe processing.
-   Three.js avatar rendering, rig and animation clips.
-   Speech recognition and playback integrations.
-   Translation logic and moderation logic.
-   Existing state management and event handlers where valid.

### 12.2 Replace or refactor

-   Obsolete page templates.
-   Card-heavy layout patterns.
-   Conflicting global styles.
-   Duplicated theme values.
-   Inconsistent typography and spacing.
-   Old visual components that cannot support the new design.
-   Presentation/business-logic coupling where separation is required.

### 12.3 Architecture expectations

-   Centralize design tokens.
-   Build reusable semantic components.
-   Keep route-level composition separate from reusable primitives.
-   Keep business logic out of purely presentational components.
-   Avoid one giant stylesheet and route-specific override chains.
-   Avoid two competing design systems.
-   Avoid introducing a new UI framework unless there is a clear
    technical need.
-   Use existing project dependencies where suitable.
-   Do not add fake data to make a screen appear complete.
-   Provide loading, error, empty and permission-denied states for
    data-dependent views.

### 12.4 Security boundary

Frontend configuration may contain only values intended to be public.
Server secrets remain in backend services or the secure desktop main
process. Do not expose MongoDB credentials, Firebase Admin private keys,
API secrets, JWT signing secrets, internal service tokens or encryption
keys in client code, browser storage, logs or screenshots.

------------------------------------------------------------------------

## 13. Responsive behaviour

### Desktop

-   Use the full 12-column grid.
-   Preserve asymmetric compositions.
-   Keep large media workspaces large.
-   Use generous but controlled whitespace.
-   Avoid stretching body text across the full viewport.

### Tablet

-   Recalculate column spans.
-   Stack or reorder media and controls based on task priority.
-   Keep primary actions visible.
-   Reduce display sizes without collapsing hierarchy.
-   Do not squeeze a desktop three-region layout into narrow columns.

### Mobile

-   Use a four-column base grid.
-   Convert reading pages to a single-column flow.
-   Keep primary controls reachable.
-   Use compact navigation appropriate to the route.
-   Preserve avatar hand visibility and camera preview usability.
-   Use horizontal overflow only for content that genuinely requires it,
    with clear affordance.
-   Ensure dialogs and forms fit the viewport and remain scrollable.

Responsive layouts must be designed per route, not produced by uniformly
shrinking desktop screenshots.

------------------------------------------------------------------------

## 14. Content and data integrity

-   Use real application data where available.
-   Clearly label sample/demo data if a design prototype requires it.
-   Do not invent service uptime, translation accuracy, latency, user
    counts, moderation outcomes or hardware status.
-   Do not present an AI confidence score unless the recognition system
    provides one.
-   Distinguish "not measured", "unavailable", "loading" and "zero".
-   Use plain language for citizen-facing copy.
-   Use precise technical labels for admin/diagnostic screens.
-   Avoid unsupported certification or privacy claims.

------------------------------------------------------------------------

## 15. Design QA and acceptance criteria

A route is not complete because it uses the right colours. It must meet
layout, usability, accessibility and functional requirements.

### 15.1 Visual QA

For every route, verify: - Grid alignment and consistent margins. -
Correct typographic hierarchy. - Appropriate line length and line
breaks. - Intentional whitespace. - Dividers aligned to the grid. - No
unnecessary card wrappers. - Correct theme token usage. - No duplicated
background/foreground text. - No clipped content or overlapping
controls. - Responsive composition at desktop, tablet and mobile sizes.

### 15.2 Functional QA

Verify: - Route access and redirects. - Role permissions. - Form
validation. - Loading/error/empty states. - Camera and microphone
permission flows. - Translation and playback controls. - WebSocket
reconnect and disconnect states. - Avatar selection and animation. -
Search, filters, pagination and exports. - Admin confirmation flows. -
Theme persistence. - Keyboard operation and focus management.

### 15.3 Performance QA

-   Check avatar rendering on mid-range devices.
-   Avoid unnecessary rerenders of the 3D scene.
-   Pause hidden-tab rendering where appropriate.
-   Keep motion GPU-friendly.
-   Lazy-load heavy route assets when appropriate.
-   Avoid loading all route media on initial page load.
-   Monitor layout shift and input responsiveness.

### 15.4 Release gate

The design system is accepted only when: 1. All 31 supplied routes are
accounted for. 2. Every route uses the shared token system. 3. Route
compositions are purpose-specific. 4. The cardless editorial approach is
used by default. 5. Both themes work. 6. RTL and responsive behaviour
are verified. 7. Accessibility checks pass. 8. Existing application
behaviour remains intact. 9. No secrets or unsupported claims are
exposed. 10. Visual screenshots and regression results are reviewed.

------------------------------------------------------------------------

## 16. Implementation checklist

### Foundation

-   [ ] Audit current route registry and route permissions.
-   [ ] Audit existing CSS, component library and theme implementation.
-   [ ] Create central colour, type, spacing, grid and motion tokens.
-   [ ] Implement light/dark theme provider.
-   [ ] Implement responsive grid primitives.
-   [ ] Implement typography and divider primitives.
-   [ ] Implement shared accessible controls.

### Shells and routes

-   [ ] Remove persistent headers, navbars, menubars, sidebars and footer route directories from every client route.
-   [ ] Implement one shared Floating Command Deck as the sole global route-navigation interface.
-   [ ] Implement searchable icon/initial commands, keyboard/touch alternatives and drag-to-center navigation.
-   [ ] Verify route visibility against the route registry and authenticated role claims.
-   [ ] Rebuild all 14 public routes.
-   [ ] Rebuild all 7 citizen routes.
-   [ ] Rebuild all 8 administrator routes.
-   [ ] Rebuild both specialist routes.

### Integration

-   [ ] Preserve authentication and authorization.
-   [ ] Preserve API and WebSocket contracts.
-   [ ] Preserve camera/microphone processing.
-   [ ] Preserve avatar rig, assets and animations.
-   [ ] Verify translation and conversation workflows.
-   [ ] Verify admin operations.

### Quality

-   [ ] Test desktop, tablet and mobile.
-   [ ] Test Light and Dark themes.
-   [ ] Test Urdu RTL.
-   [ ] Test keyboard-only operation.
-   [ ] Test reduced motion.
-   [ ] Test contrast and focus visibility.
-   [ ] Capture and review screenshots for every route.
-   [ ] Run functional regression tests.
-   [ ] Document known gaps and unsupported features.

------------------------------------------------------------------------

## 17. Final directive

**Decommission the old frontend visual system and implement this design
system as the single source of truth for the Hastivo client
application.**

Do not simply reskin the old dashboard, add an editorial theme over
card-based templates, persistent navigation chrome, or force every route into one layout.

Preserve the real application functionality and rebuild the presentation
layer around the principles in this document.

The result must be a coherent, accessible, responsive,
production-oriented Editorial / Swiss Grid product: typography-led,
grid-structured, asymmetric where useful, restrained in colour, cardless
by default, and purpose-built for Indian Sign Language communication.
