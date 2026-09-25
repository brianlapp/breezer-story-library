---
name: "Breezer’s bookshelf"
description: "A playful print-inspired shelf with quiet, comfortable reading pages."
colors:
  ink: "#342047"
  grape: "#45256e"
  paper: "#f9f6ff"
  pink: "#f6b6d2"
  green: "#e7f685"
  orange: "#ffb078"
  muted: "#665673"
  line: "#d9cde5"
  shelf: "#eee8f6"
  focus: "#b33168"
  chapter-active: "#912758"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(2.8rem, 5.8vw, 5.4rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(2rem, 3.3vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-.035em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-.035em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  reading:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "1.22rem"
    fontWeight: 400
    lineHeight: 1.85
  emphasis:
    fontFamily: "Georgia, serif"
    fontWeight: 400
rounded:
  control: "8px"
  cover: "2px 10px 10px 2px"
spacing:
  small: ".5rem"
  medium: "1rem"
  roomy: "1.5rem"
  section: "2rem"
  wide: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.grape}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: ".9rem 1.4rem"
  button-primary-hover:
    backgroundColor: "#633394"
  search-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "7px"
    padding: ".65rem .9rem"
  navigation:
    backgroundColor: "{colors.grape}"
    textColor: "{colors.paper}"
  book-cover:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cover}"
    padding: "1.5rem"
    height: "370px"
  chapter-row:
    textColor: "{colors.ink}"
    padding: "1rem 0"
  reading-size:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "5px"
    padding: ".4rem"
---

# Design System: Breezer’s bookshelf

## Overview

**Creative North Star: "Cut-paper record sleeves"**

Grape ink, candy-colored paper, heavy titles, and cutout shapes give the library the character of a small independent print collection. The world is playful and personal, with type and simple geometry doing the illustration work.

Browsing is expressive; reading is spacious and still. The same ink and paper continue through both, while Georgia prose gives chapters a familiar book-like rhythm. System fonts are intentional: no external font service is required.

**Key Characteristics:**
- Chunky sans-serif titles with occasional italic serif emphasis.
- Colored covers, offset paper shadows, and geometric cutouts.
- Quiet serif reading with adjustable type and a narrow measure.
- Visible keyboard focus and reduced-motion support.

## Colors

The palette pairs deep purple ink with pale paper and three warm, bright cover colors.

### Primary
- **Grape:** The masthead, primary actions, title emphasis, and recurring cover artwork.

### Secondary
- **Bubblegum pink, acid green, and tangerine:** The three cover choices and sculptural book spines. Pink also supports the closing invitation; green highlights the resume link and public-content notice.

### Neutral
- **Ink:** Default text, including text on colored covers.
- **Paper:** The main canvas, light control surfaces, and reversed masthead/action text.
- **Shelf:** A slightly deeper lavender surface for the collection, quotations, and code examples.
- **Muted:** Supporting descriptions, metadata, sample labels, and reading tools.
- **Line:** Dividers separating contents, reading controls, navigation, and footer.
- **Focus and chapter-active:** Distinct berry tones for keyboard focus and current/hovered chapter links.

**The Ink on Paper Rule.** Keep chapter prose on the pale reading canvas; use the bright cover palette for browsing and supporting notices.

## Typography

**Display and interface font:** Arial, Helvetica, sans-serif.
**Reading font:** Georgia, Times New Roman, serif.
**Emphasis font:** Georgia, serif, in italic.

The hierarchy is deliberately broad rather than a mathematical scale. Large, tightly tracked headings establish personality, while compact sans-serif metadata stays subordinate to generous serif prose. Base heading roles are recorded above; page titles adapt to their available width.

### Hierarchy
- **Display:** Fluid large headings; bold with tight tracking. Mobile hero type is explicitly set to 3.5rem with unit line height.
- **Headline:** Section names and supporting page headings.
- **Title:** Story names below covers; mobile story titles increase to 1.8rem.
- **Body:** Interface copy and supporting text; descriptions generally use the muted color.
- **Reading:** A maximum 68ch measure, with a default 1.22rem size and 1.85 line height. Mobile defaults to 1.12rem and 1.8 line height. Large and Larger settings use 1.4rem and 1.6rem respectively.
- **Labels:** Compact sans-serif metadata, generally .7rem–.9rem. Sample labels are bold and .72rem; decorative cover labels are smaller.

**The Two Speeds Rule.** Use the bold sans-serif voice to choose a story and the quieter serif voice to read it.

## Layout

Wide surfaces use fluid horizontal gutters around a centered content area. Header, footer, shelf, and closing section align through 5vw gutters and a 1280px inner-width calculation; the hero has its own 1440px maximum. Mobile content generally uses 6vw gutters.

The shelf uses three equal columns with a 2.5rem gap, narrowing that gap at 950px. At 650px and below, it becomes a single column, the search field moves below the section heading, and the hero and book introduction stack vertically. The mobile cover remains large enough to feel like a printed object.

Reading uses a sidebar and article grid: a 245px contents column, a 4rem gap, and a 760px maximum article width. At 950px the contents column and gap narrow; at 650px the layout becomes a single column with a native collapsible chapter list above the text. Reading controls remain compact and visible. Print styling removes site navigation and reading controls and renders plain prose.

Spacing is a practical rem-based rhythm, with repeated half-, one-, one-and-a-half-, two-, and three-rem intervals. It is not a strict spacing-only scale; contextual values remain in the stylesheet.

## Elevation & Depth

Depth belongs to the paper objects. Book covers and decorative spines use small, hard-edged offset shadows; ordinary reading surfaces use background tone and fine dividers. Cover links lift gently on hover. There is no general-purpose elevated-card system.

### Shadow Vocabulary
- **Cover paper offset** (`7px 8px 0 #34204714`): Separates book covers from the shelf.
- **Spine paper offset** (`6px 8px 0 #34204712`): Separates the stacked decorative book spines.

**The Paper Object Rule.** Reserve offset shadows and rotation for the book-like artwork; keep the prose column visually still.

## Shapes

Controls and supporting panels have modest rounded corners. Covers use a flatter left edge and softer right corners, with a fine inset line suggesting a spine. The hero spines repeat that asymmetric book silhouette. Recurring cover artwork uses circles, rings, squares, and leaf-like cuts; star and arrow glyphs provide small print-like accents.

## Components

### Buttons

Confident, compact grape actions with pale text. Primary links use an 8px radius, a minimum 48px height, bold .95rem text, and room for a trailing arrow. Hover lightens the grape background. Keyboard focus uses the shared 3px berry outline with a 5px offset.

### Inputs / Fields

The search is a visible labeled native search input on paper, with a fine purple border and a minimum 44px height. Placeholder text uses the muted color. Reading size uses a native select with the same paper-and-ink treatment. Both keep the shared visible focus outline.

### Navigation

The masthead combines the heavy lowercase wordmark with compact bold links. Hover turns masthead links acid green. Mobile preserves both links in a smaller inline arrangement. Story contents use divided rows with a number, title, and optional reading time; the current chapter and hover state use berry text. Previous/next chapter navigation is a two-column text layout separated from the article by a line.

### Cards / Containers

Story entries are open compositions: a colored cover, metadata, title, description, sample label, and underlined reading action. There is no enclosing card border. Covers carry the shadow and shape treatment. Supporting quotations, code examples, and notices use tinted flat surfaces with modest rounded corners.

### Book covers

Covers are typographic objects, not photographs: large short-line titles, compact collection labels, and cutout geometry. Pink, green, and orange each select a related artwork variation. Their default 370px height adapts at the responsive breakpoints; book-detail covers are larger. Hover movement lasts .2s with `cubic-bezier(.16,1,.3,1)`. Reduced-motion preferences remove transitions and smooth scrolling.

### Reader

Chapter prose supports headings, quotations, scene breaks, images, tables, and code blocks. Images stay within the text width; wide code and tables can scroll. Scene breaks use three small stars. The text-size selection persists where browser storage is available; reading remains usable without storage.

## Do's and Don'ts

### Do:
- **Do** keep the playful cover system and the quiet prose system recognizable as one palette.
- **Do** use the established native font stacks and text-size options.
- **Do** retain visible keyboard focus, meaningful labels, and reduced-motion behavior.
- **Do** keep sample labels visible next to sample stories and chapters.

### Don't:
- **Don't** extend cover rotations or offset shadows into the reading text.
- **Don't** make decorative cover labels carry essential story information by themselves.
- **Don't** replace readable text with artwork or hide navigation behind decoration.
