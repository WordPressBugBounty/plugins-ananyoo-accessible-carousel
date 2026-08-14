=== Accessible Carousel & Slider – WCAG AA Compliant Slideshow ===
Contributors: anblik
Tags: accessibility, wcag, carousel, slider, slideshow
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 2.7.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

WCAG AA compliant carousel, slider & slideshow blocks: keyboard & screen-reader friendly, pause control, no autoplay, plus a card scroller.

== Description ==

**Accessible Carousel & Slider** gives the WordPress block editor two accessibility-first blocks — a hero carousel / slider and a native card scroller — built to WCAG Level AA. Use it as an accessible carousel, slider, or slideshow that is fully keyboard-operable, screen-reader friendly, and responsive, with an always-visible pause control and no forced autoplay. Both are real Gutenberg blocks, so there are no shortcodes and nothing is hidden from assistive technology, plus ready-made patterns you can insert and edit.

**Live demo:** [Try the accessible carousel & slider demo »](https://showcase.ananyoo.com/accessible-carousel/)

**New in this version**

* An in-editor **Accessibility check** with a live WCAG colour-contrast pass/fail readout for every colour pair, plus alt-text, heading and button-text checks — so you catch problems while you build.
* **Full keyboard control**: Left/Right arrow keys change slides and Home/End jump to the first/last slide.
* Slide changes are **announced by title** to screen readers, not just "Item 2 of 5".
* Choose **dots or a titled tab list** for slide navigation, a visible **slide counter**, and a **"Skip carousel"** link.
* **Reading-time pacing** for autoplay so a slide is never advanced before it can be read (autoplay stays off by default).
* Optional, off-by-default visitor modes: a **"View as list" reading mode** and a **dyslexia-friendly reading** toggle.
* **Windows High Contrast** (forced-colors) support throughout.

**Hero carousel** (built to the W3C/WAI Carousels tutorial): each slide has a background image and a solid "contrast box" holding a heading, a paragraph, and an optional button, placed left, right, or bottom. The solid box guarantees readable text contrast over any image. No autoplay by default; when enabled, a configurable pause/stop control is always shown.

**Card scroller**: a native CSS scroll-snap row of cards. Because it uses real browser scrolling, it works with the keyboard, touch, the scrollbar, and screen readers with no JavaScript — and nothing is hidden from assistive technology, avoiding the focusable-but-hidden trap common to multi-slide carousels. "Cards per view" is pure CSS (it steps down to 2 then 1 on smaller screens), and there is no autoplay.

**Patterns**: insert ready-made layouts (hero overlay, hero card, autoplay showcase, minimal, features row, services row) from the Accessible Carousel category, then edit freely. To save your own configured layout as a template, use WordPress's built-in "Create pattern" on the block toolbar.

**Carousel accessibility features**

* Carousel is a labelled region containing a semantic list of slides; with JavaScript off it degrades to a readable list.
* Controls are real buttons, fully keyboard operable, with no keyboard trap.
* Keyboard focus is never moved by next/previous or by auto-advance.
* A polite live region announces the new slide by title (e.g. "Slide 2 of 5: …") on user-initiated changes; auto-rotation stays silent so it does not interrupt screen reader users.
* Full keyboard control: Left/Right arrow keys change slides and Home/End jump to the first/last slide, in addition to the on-screen buttons.
* A visible "2 / 5" slide-position indicator, plus an in-editor Accessibility check that flags weak colour contrast, missing alt text and vague button text as you build.
* Choose dots or a titled tab-list for slide navigation, and a "Skip carousel" link (WCAG 2.4.1) for keyboard users.
* Optional, off-by-default visitor modes: a "View as list" reading mode and a dyslexia-friendly reading toggle.
* No autoplay by default; when enabled, a stop/start control is always provided (WCAG 2.2.2), rotation pauses on hover and focus, and reading-time pacing can give each slide enough time to be read.
* Transition animations (fade or slide) are disabled automatically under prefers-reduced-motion.
* Background images are decorative by default, with a real alt-text option when the image is meaningful.
* Solid contrast box, 44px control targets, and a high-visibility focus indicator.

**Card scroller accessibility features**

* Native CSS scroll-snap: keyboard, touch, scrollbar, and screen readers all work with no JavaScript.
* The scroll region is itself keyboard-focusable and labelled, so it can be scrolled with the arrow keys.
* Cards are a real list; nothing is set to aria-hidden, so there is no focusable-but-hidden content.
* Each card link carries hidden context (e.g. "Learn more – Design") so repeated links have distinct names (WCAG 2.4.4).
* No autoplay. Optional previous/next buttons are added only when the cards overflow, so there are never dead controls.
* "Cards per view" is responsive by CSS (desktop value, capped at 2 on tablet and 1 on mobile).

**Links**

* [Plugin home & documentation](https://ananyoo.com/ananyoo-accessible-carousel-block-plugin/)
* [Live demo](https://showcase.ananyoo.com/accessible-carousel/)
* [More accessibility plugins from Ananyoo](https://ananyoo.com/wordpress-accessibility-plugins/) — further WordPress accessibility plugins are in active development.
* [Support & contact](https://ananyoo.com/contact-us/)

**Privacy**

This plugin collects no data, contacts no external services, and adds no front-end links.

== Installation ==

1. Upload the `ananyoo-accessible-carousel` folder to `/wp-content/plugins/`, or install the ZIP through Plugins > Add New > Upload.
2. Activate the plugin.
3. Add the "Accessible Carousel" block, add slides, and set each slide's image, heading, text, button, and box position.

== Frequently Asked Questions ==

= Where is the settings page? =

There isn't one. All options live in the block's sidebar in the editor, which is the standard WordPress block approach.

= How do I use the ready-made templates? =

Open the block inserter, find the "Accessible Carousel" pattern category, and insert any pattern (hero, showcase, minimal, features row, and so on). It drops in as ordinary blocks you can edit freely. To save your own configured carousel or scroller as a reusable template, select it and choose "Create pattern" from the block toolbar — that is a built-in WordPress feature.

= When should I use the scroller instead of the carousel? =

Use the hero carousel for one large rotating slide at a time. Use the card scroller to show several cards at once (features, services, and similar) that visitors browse by scrolling. The scroller has no autoplay and uses native scrolling, which keeps it simple and accessible.

= Should I enable autoplay? =

Generally no. Auto-advancing content is a barrier for many people. When enabled, a stop control is always shown and rotation pauses on hover and focus.

= Does it work without JavaScript? =

Yes. Slides display as a stacked, readable list when JavaScript is unavailable.

== Screenshots ==

1. The hero carousel and card scroller in the editor, with their design controls in the sidebar.
2. The "Choose a layout" picker shown when you insert a block — Editorial, Soft, Minimal, or Start blank, each with a thumbnail.
3. The six bundled patterns in the "Accessible Carousel" category of the inserter.
4. A front-end hero carousel: a labelled region with prev/next, dots, and an always-present pause control when autoplay is on.
5. A front-end card scroller: a native scroll-snap row of cards, keyboard and screen-reader friendly.
6. The in-editor Accessibility check: live WCAG colour-contrast pass/fail for each colour pair, plus alt-text and heading checks, shown as you build a slide.
7. New front-end options: a titled tab navigation, a visible "2 / 5" slide counter, a "Skip carousel" link, and the optional "View as list" and "Easier reading" visitor toggles.
8. The plugin's own accessible "How to use" admin page: a keyboard- and screen-reader-friendly help screen with a visible focus ring, semantic headings and contrast-checked colours.
9. The block-editor sidebar for the carousel: choose dots or a titled tab list, reading-time pacing, and the optional "View as list" and dyslexia-friendly reading toggles under "Accessibility options".

== Changelog ==

= 2.7.5 =
* New: a "Pause on mouse hover" toggle in the Autoplay settings (on by default, so nothing changes for existing carousels). Turn it off for full-width or full-height hero carousels, where the mouse is nearly always over the slides and hover-pause would keep the rotation stopped. Requested by @tonfarbe.
* Keyboard focus-pause and the always-visible Pause/Play control are never affected by this option, so WCAG 2.2.2 (Pause, Stop, Hide) stays satisfied either way, and autoplay still never runs for visitors who prefer reduced motion.
* No breaking changes; existing carousels render exactly as before.

= 2.7.4 =
* Fix: with autoplay on, the stop/start control now reads "Pause" from the moment the carousel loads. Earlier it wrongly read "Play" until the first hover, even though the slideshow was already rotating. Props @tonfarbe for the report.
* Fix: moving the mouse over the carousel (arrows, dots or the slide itself) no longer flips the Pause/Play control. Hovering still quietly pauses the rotation (WCAG 2.2.2), but the control now shows only the state the visitor chose and changes only when the visitor acts on a control.
* Fix: clicking "Pause" while the mouse was inside the carousel could restart the slideshow instead of stopping it (same root cause). The control now toggles the visitor's chosen state reliably.
* Improvement: auto-rotation no longer resumes on mouse-leave while keyboard focus is still inside the carousel.
* No breaking changes; existing carousels render exactly as before.

= 2.7.3 =
* Fix: mobile control layout. On narrow screens the titled-tab navigation now gets its own full-width row beneath the arrows and counter instead of being squeezed into a cramped column, and the control bar reflows gracefully instead of letting the counter, dots and play button collide.
* No breaking changes; existing carousels render exactly as before.

= 2.7.2 =
* Fix: the "Skip carousel" link is now hidden off-screen instead of with opacity, so its full white-on-navy contrast is reported correctly by automated tools (it was a false "low contrast" flag; the link was always readable on focus). Behaviour for keyboard and screen-reader users is unchanged.
* No breaking changes; existing carousels render exactly as before.

= 2.7.1 =
* Fix: the visible "2 / 5" slide counter now sits in its own solid navy pill, so it passes WCAG 1.4.3 contrast on any background, including the overlay layout where it previously relied on white text over a light page (WCAG 1.4.3).
* Fix: the counter now stays visible under Windows High Contrast / forced-colors, using the system Canvas and CanvasText colours with a border.
* No breaking changes; existing carousels render exactly as before.

= 2.7.0 =
* New: full keyboard navigation for the carousel — Left/Right arrow keys move between slides and Home/End jump to the first and last slide (WAI-ARIA Authoring Practices). Typing in a field is never hijacked.
* New: slide-change announcements now speak the slide's own title (for example "Slide 2 of 5: Designed to WCAG 2.2 AA") instead of just a number, so the change is meaningful (WCAG 4.1.3).
* New: choose your slide navigation — keep the compact dots, or switch to a titled tab list that shows each slide's heading (easier to recognise). Dots stay the default.
* New: reading-time pacing for autoplay — when autoplay is on, each slide can stay long enough to read its own text (about 200 words a minute) instead of a fixed interval, so nothing advances too soon (WCAG 2.2.2). Autoplay itself stays off by default.
* New (opt-in): a visitor "View as list" reading mode that unfolds the carousel into a plain vertical list for people who prefer to read everything at once.
* New (opt-in): a visitor "Easier reading" toggle that increases letter, word and line spacing and left-aligns the carousel text for dyslexia-friendly reading.
* The two visitor modes are off by default and their small extra script/styles apply only when a site owner switches them on, so the default carousel stays lean.
* No breaking changes; existing carousels render exactly as before.

= 2.6.0 =
* New: a live "Accessibility check" panel in the editor for the Hero Slide and Scroller Card blocks. It checks, as you edit, the WCAG colour contrast of every colour pair (text on box/card background, heading on background, and button text on its button), whether the image has alt text or is marked decorative, whether the heading is filled in, and whether the button/link text is meaningful (WCAG 2.4.4). Each result is shown with an icon, wording and colour, so it never relies on colour alone (WCAG 1.4.1).
* New: the colour-contrast check uses the correct WCAG 1.4.3 threshold automatically — 3:1 for large or bold headings, 4.5:1 for body text.
* New: a visible "2 / 5" slide-position indicator on the carousel, alongside the existing screen-reader announcement (helps low-vision and cognitive users). It is aria-hidden to avoid a double announcement.
* New: a "Skip carousel" link (hidden until focused) so keyboard users can jump past the carousel (WCAG 2.4.1 Bypass Blocks).
* New: Windows High Contrast / forced-colors support for the carousel, card scroller and the admin page — focus rings, the active dot and controls stay visible when the OS overrides colours.
* Backend: the plugin's "How to use" admin page no longer adds a second banner landmark, and every link that opens a new tab now says so to screen-reader users (WCAG G201).
* No breaking changes; existing carousels and cards render exactly as before.

= 2.5.6 =
* New: added a "Settings" link on the Plugins screen that opens the plugin's Accessible Carousel dashboard, next to the existing "How to use" link.
* Readme: the description now reads "WCAG AA" instead of "WCAG 2.2 AA", so the conformance wording does not need editing when a newer WCAG version is published. Specific success-criterion numbers are unchanged.
* Internal: synced the four block.json versions to the plugin version (they had lagged at 2.4.3).

= 2.5.5 =
* Previous/next arrows are now crisp inline SVG chevrons (using currentColor, so they follow the theme colour and Windows High Contrast mode) instead of thin text glyphs.
* Pause/Play button has a fixed minimum width, so the label swap no longer shifts the dot navigation (better stability for screen-magnifier users).
* Overlay layout: the card background variable is neutralised, so the grey card colour can no longer show through overlay carousels, including in the small-screen styles.


= 2.5.4 =
* Accessibility (WCAG 2.4.3 Focus Order / 4.1.2 Name, Role, Value): in the card scroller, pressing Previous or Next now moves keyboard focus onto the card that has just scrolled into view (the leading-edge card in the scroll direction) and announces that card's own heading and text — replacing the previous polite "Showing items N to M of TOTAL: titles" summary. Each card is a list item that names itself via aria-labelledby (its heading and description), so the focus move reads the right content, and the card shows a clear focus outline. The cards remain a list, so "list, N items" is still announced.
* No settings or visual-design changes.

= 2.5.3 =
* Accessibility (WCAG 2.4.3 Focus Order): in the card scroller, the Previous/Next buttons are now placed AFTER the cards in the DOM and rendered below them, so keyboard focus lands on the visible cards first and reaches the buttons last — focus order, DOM order and visual order now all agree.
* Accessibility (WCAG 4.1.3 Status Messages): activating Previous or Next now announces the cards that have scrolled into view through a polite live region (for example, "Showing items 4 to 6 of 8: Build, Extend, Audit"), so screen-reader users hear what changed. Announcements fire only on a button press, not on every manual scroll. No settings or visual-design changes beyond the buttons moving below the cards.

= 2.5.2 =
* Accessibility (WCAG 2.4.3 Focus Order): in the card scroller, only the cards currently visible in the viewport are now in the keyboard tab order. Cards scrolled off-screen have their focusable contents set to tabindex="-1" and are restored as they scroll into view (via the Previous/Next buttons or the focusable scroll region). Uses IntersectionObserver, with a safe fallback that keeps every card tabbable where it is unavailable. Nothing is hidden from screen-reader browse mode. No settings or visual changes.

= 2.5.1 =
* Accessibility (WCAG 2.4.3 Focus Order): in the card scroller the Previous/Next buttons now sit visually ABOVE the cards, matching their position in the tab order. In 2.4.4 the buttons were moved first in the tab order but kept below the cards, so keyboard focus jumped to the lower buttons before the cards — a focus/visual order mismatch. They are now reached first AND shown first. No settings change.

= 2.5.0 =
* New: added an "Accessible Carousel" admin menu with an About / how-to page (hero header, list of blocks, insertion steps, accessibility summary and links). Block plugins have no global settings, so this page is informational only.
* New: the plugin's blocks are now grouped under an "Ananyoo Accessible Blocks" category in the editor inserter for easier discovery.
* New: added "How to use", "Live demo" and "Support" links on the Plugins screen.
* No changes to the blocks themselves or to front-end output.

= 2.4.4 =
* Accessibility (WCAG 2.4.3 Focus Order): in the card scroller, the Previous/Next buttons are now placed before the scroll viewport in the DOM, so keyboard focus reaches them before tabbing through the card content. Their on-screen position is unchanged (kept via CSS flex order). No settings or visual changes.

= 2.4.3 =
* Listing and editor naming refresh for discoverability: the plugin is now presented as "Accessible Carousel & Slider", with updated tags, a clearer short description, a live demo link, and a Links section. In the editor the two main blocks are now titled "Accessible Carousel" and "Accessible Card Scroller", and the pattern category is "Accessible Carousel". No functional or markup changes — block names and saved content are unaffected.

= 2.4.2 =
* Added a translation template (languages/ananyoo-accessible-carousel.pot) and a Domain Path header, so the plugin is ready for translation. Readme: added a Screenshots section and an Upgrade Notice. No functional changes.

= 2.4.1 =
* The "Choose a layout" picker now shows a small visual thumbnail for each look (Editorial, Soft, Minimal, Start blank) so the choice is clearer. Thumbnails are inline SVG — no extra files.

= 2.4.0 =
* New: inserting a bare Carousel or Card Scroller now shows a "Choose a layout" picker — pick Editorial, Soft, Minimal, or Start blank, and the block fills with that look (built from the same design attributes as the patterns; everything stays editable). Inserting a pattern still works as before.

= 2.3.1 =
* Fixed: scroller card body text could inherit an oversized base font from some themes. Cards now use a sensible default text size (still overridable with the block's Typography control); headings are unaffected.

= 2.3.0 =
* Redesigned the bundled patterns into six designed starting points — three hero looks and three card looks (Editorial, Soft, Minimal) — under the "Ananyoo Carousel" category. Each is built entirely from the blocks' own design controls (no extra CSS), uses a neutral palette with every colour pair at 4.5:1 or better, and ships with tiny self-contained placeholder images you replace with your own.

= 2.2.1 =
* Added a Button size control (Small / Medium / Large) to the call to action in both the carousel slide and the scroller card, alongside the existing shape and colour controls. Every size keeps a valid target size; medium matches the previous default.

= 2.2.0 =
* New: design controls for the hero carousel slide, matching the scroller. The "Slide design" panel adds heading size, text size, and a call to action that can be a button or a text link, with button shape (square, rounded, pill). The Colours panel now covers box background, text, heading, and button background/text. Defaults preserve the previous look (the CTA stays a button), the heading level stays constrained, the image stays decorative by default, and the solid box still guarantees contrast.

= 2.1.0 =
* New: design controls for the Card Scroller. Each card now supports background, text colour, typography, border and spacing through the standard block panels, plus a "Card design" panel for heading size/colour and the call to action — switch it between a text link and a button, and set the button's colour and shape (square, rounded or pill). Defaults stay neutral, the heading level stays constrained, the image stays decorative by default, and the link keeps its hidden context for distinct names (WCAG 2.4.4).
* New: the scroller container supports a background colour and padding via the standard block panels.

= 2.0.2 =
* Fixed (accessibility): the carousel button inside a non-current (or mid-transition) slide is no longer reachable by keyboard while its slide is aria-hidden. Focusable controls in hidden slides are now removed from the tab order and restored when the slide is shown, resolving a WCAG 4.1.2 (Name, Role, Value) failure flagged as "aria-hidden element must not contain focusable elements."

= 2.0.1 =
* Fixed: carousel pagination dots now use a 24x24 pixel tap target (the visible dot is drawn inside it), meeting WCAG 2.5.8 Target Size (Minimum). The dots looked the same but the clickable area was previously smaller than 24px.

= 2.0.0 =
* New block: Ananyoo Accessible Card Scroller — a native CSS scroll-snap row of cards (with a child Scroller Card block). Works with keyboard, touch and screen readers without JavaScript; nothing is hidden from assistive tech; "cards per view" is responsive by CSS; no autoplay. Optional previous/next buttons are injected only when the cards overflow.
* New: ready-made patterns under the "Ananyoo Carousel" category — Hero (overlay), Hero (card), Showcase (autoplay), Minimal, Features row, and Services row. Insert and edit; save your own with WordPress's built-in Create pattern.
* The scroller's previous/next buttons load their own small script and stylesheet, so they are only added on pages that use the block.

= 1.7.0 =
* New: the pause/stop control now has block options for its button label (used as both the visible text and the screen reader name, so they always match — WCAG 2.5.3), its position in the control bar (left, center, or right), and its size (small, medium, large; all keep a 44px minimum target). The control is still always shown whenever autoplay is on (WCAG 2.2.2); these options only customise it.
* Fixed: the pause button's accessible name no longer differs from its visible text. Previously the visible "Pause"/"Play" text did not appear in the descriptive aria-label, which fails WCAG 2.5.3 (Label in Name). The visible label is now the accessible name.
* Internal: corrected the ANACB_VERSION constant (was out of step with the plugin header) and synced block versions.

= 1.6.0 =
* Maintenance: passed Plugin Check across all categories; coding-standards and prefix clean-up (aac_/AAC_/$anacb_).

= 1.5.7 =
* Default card background is now a light grey (#cccccc) so the carousel stands out on white pages, with control colours adjusted to keep AA contrast. Mobile: removed the white gap between image and text box, and kept the arrows, dots and play/pause on a single row.

= 1.5.6 =
* Fixed: on mobile, overlay carousels now sit inside the same contained card shell (padding, background, rounded corners, shadow) as the card layout, so the image, text, and controls are visually grouped instead of appearing detached.

= 1.5.5 =
* Fixed: call-to-action button now sets an explicit font size so it no longer inherits an oversized base font from some themes. Mobile control hover states corrected for readable contrast, and the CTA is sized down slightly on small screens.

= 1.5.4 =
* Improved mobile accessibility: on screens 600px and below, the overlay layout now reverts to the card layout (image on top, solid text bar beneath using the slide's own colours, controls in a bar below). This removes text/control overlap on small screens and guarantees readable contrast. The overlay look is retained on larger screens.

= 1.5.3 =
* Fixed: on mobile, overlay-layout prev/next arrows moved from the vertical centre to the bottom of the slide so they no longer overlap the heading/text. The text box now uses the full width in the upper area.

= 1.5.2 =
* Fixed: in the overlay layout, the text box could overlap the previous/next arrows on some widths (desktop and mobile). The box now reserves clearance so the arrows and text never collide.

= 1.5.1 =
* Reverted demo-specific styling that had been added in 1.5.0 (grey card background, darkened borders, fixed gaps). The plugin now ships with neutral defaults so it inherits the active theme; any demo-specific styling belongs in site CSS, not the plugin.

= 1.5.0 =
* (superseded) Introduced demo-specific styling defaults — reverted in 1.5.1.

= 1.4.1 =
* Fixed the Overlay layout breaking out of its container and stretching full browser width.

= 1.4.0 =
* Width and height are no longer fixed. The carousel fills its container by default, with optional Maximum width and Slide height fields per carousel.

= 1.3.0 =
* Added a Layout style option per carousel: Card (controls below the image) and Overlay (controls over the image).

= 1.2.0 =
* Card layout: contained, centered card with controls in a bar below the image; full-width caption bar over the image.

= 1.1.0 =
* Transitions follow the W3C technique: the incoming slide is kept aria-hidden until the CSS transition ends. Added a reduced-motion bypass and a reveal safety net.

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 2.5.6 =
Adds a Settings link on the Plugins screen plus small readme and versioning tidy-ups. No changes to the blocks or your content.

= 2.4.3 =
Naming and listing refresh (now "Accessible Carousel & Slider") plus a live demo link. No functional changes; your existing blocks and content are unaffected.

= 2.4.2 =
Adds a translation template and listing polish. Includes everything from 2.x: the card scroller block, design controls for both blocks, designed patterns, and the on-insert layout picker.

= 1.0.0 =
Initial release.
