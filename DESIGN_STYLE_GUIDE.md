# Seerr Design Style Guide

A comprehensive visual design system for the Seerr project, documenting UI components, color schemes, typography, spacing, and design patterns.

## Table of Contents

- [Design Tokens](#design-tokens)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
  - [Buttons](#buttons)
  - [Badges](#badges)
  - [Alerts](#alerts)
  - [Form Elements](#form-elements)
  - [Modals](#modals)
  - [Selectors](#selectors)
- [Layout Patterns](#layout-patterns)
- [Media Components](#media-components)
- [Interactive States](#interactive-states)
- [Responsive Design](#responsive-design)
- [Animations & Transitions](#animations--transitions)

## Design Tokens

### Core Design Principles
- **Dark Theme**: Primary dark UI with high contrast for accessibility
- **Modern Aesthetic**: Clean, minimal interface with subtle gradients
- **Media-Focused**: Optimized for displaying movie/TV content
- **Responsive**: Mobile-first approach with adaptive layouts

### Brand Colors
```css
/* Primary Brand Gradient */
.text-overseerr {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  background-clip: text;
  color: transparent;
}

/* Indigo to Purple gradient for special text/logos */
```

## Color System

### Primary Palette
```css
/* Indigo - Primary Interactive */
--indigo-400: #818cf8;  /* Hover states */
--indigo-500: #6366f1;  /* Primary actions */
--indigo-600: #4f46e5;  /* Active states */
```

### Status Colors
```css
/* Success - Green */
--green-500: #10b981;   /* Success states */
--green-100: #dcfce7;   /* Success text */

/* Warning - Yellow */
--yellow-500: #f59e0b;  /* Warning states */
--yellow-100: #fef3c7;  /* Warning text */

/* Danger - Red */
--red-500: #ef4444;     /* Error states */
--red-600: #dc2626;     /* Error backgrounds */
--red-100: #fee2e2;     /* Error text */
```

### Gray Scale
```css
/* Background Grays */
--gray-900: #111827;    /* Main background */
--gray-800: #1f2937;    /* Card backgrounds */
--gray-700: #374151;    /* Input backgrounds, borders */
--gray-600: #4b5563;    /* Secondary buttons */
--gray-500: #6b7280;    /* Borders, dividers */

/* Text Grays */
--gray-100: #f9fafb;    /* Primary white text */
--gray-200: #e5e7eb;    /* Secondary white text */
--gray-300: #d1d5db;    /* Body text */
--gray-400: #9ca3af;    /* Muted text */
```

## Typography

### Font Family
```css
/* Primary font stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Text Hierarchy
```css
/* Headings */
.heading {
  @apply text-2xl font-bold leading-8 text-gray-100;
}

/* Titles */
h1 {
  @apply text-2xl font-bold xl:text-4xl;
}

/* Body Text */
.description {
  @apply mt-1 max-w-4xl text-sm leading-5 text-gray-400;
}

/* Labels */
label, .group-label {
  @apply mb-1 block text-sm font-bold leading-5 text-gray-400;
}
```

### Text Colors by Context
```css
/* Primary text (high contrast) */
.text-primary { @apply text-gray-100; }

/* Secondary text (medium contrast) */
.text-secondary { @apply text-gray-300; }

/* Muted text (low contrast) */
.text-muted { @apply text-gray-400; }

/* Special text (brand gradient) */
.text-brand { @apply text-overseerr; }
```

## Spacing & Layout

### Spacing Scale
```css
/* Consistent spacing using Tailwind scale */
--space-xs: 0.25rem;    /* 4px - px-1, py-1 */
--space-sm: 0.5rem;     /* 8px - px-2, py-2 */
--space-md: 1rem;       /* 16px - px-4, py-4 */
--space-lg: 1.5rem;     /* 24px - px-6, py-6 */
--space-xl: 2rem;       /* 32px - px-8, py-8 */
```

### Layout Containers
```css
/* Form sections */
.section {
  @apply mt-6 mb-10 text-white;
}

/* Form rows */
.form-row {
  @apply mt-6 max-w-6xl sm:mt-5 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4;
}

/* Actions area */
.actions {
  @apply mt-8 border-t border-gray-700 pt-5 text-white;
}
```

## Components

### Buttons

#### Button Types & States
```css
/* Base Button Styles */
.btn-base {
  @apply inline-flex items-center justify-center border leading-5 font-medium rounded-md focus:outline-none transition ease-in-out duration-150 cursor-pointer disabled:opacity-50 whitespace-nowrap;
}
```

#### Primary Button
```css
.btn-primary {
  @apply text-white border border-indigo-500 bg-indigo-600 bg-opacity-80 hover:bg-opacity-100 hover:border-indigo-500 focus:border-indigo-700 focus:ring-indigo active:bg-opacity-100 active:border-indigo-700;
}
```

#### Secondary/Default Button  
```css
.btn-default {
  @apply text-gray-200 bg-gray-800 bg-opacity-80 border-gray-600 hover:text-white hover:bg-gray-700 hover:border-gray-600 group-hover:text-white group-hover:bg-gray-700 group-hover:border-gray-600 focus:border-blue-300 focus:ring-blue active:text-gray-200 active:bg-gray-700 active:border-gray-600;
}
```

#### Danger Button
```css
.btn-danger {
  @apply text-white bg-red-600 bg-opacity-80 border-red-500 hover:bg-opacity-100 hover:border-red-500 focus:border-red-700 focus:ring-red active:bg-red-700 active:border-red-700;
}
```

#### Success Button
```css
.btn-success {
  @apply text-white bg-green-500 bg-opacity-80 border-green-500 hover:bg-opacity-100 hover:border-green-400 focus:border-green-700 focus:ring-green active:bg-opacity-100 active:border-green-700;
}
```

#### Warning Button
```css
.btn-warning {
  @apply text-white border border-yellow-500 bg-yellow-500 bg-opacity-80 hover:bg-opacity-100 hover:border-yellow-400 focus:border-yellow-700 focus:ring-yellow active:bg-opacity-100 active:border-yellow-700;
}
```

#### Ghost Button
```css
.btn-ghost {
  @apply text-white bg-transparent border-gray-600 hover:border-gray-200 focus:border-gray-100 active:border-gray-100;
}
```

#### Button Sizes
```css
/* Small Button */
.btn-sm {
  @apply px-2.5 py-1.5 text-xs;
}

/* Medium Button (Default) */
.btn-md {
  @apply px-4 py-2 text-sm;
}

/* Large Button */
.btn-lg {
  @apply px-6 py-3 text-base;
}
```

#### Server Type Buttons
```css
.server-type-button {
  @apply rounded-md border border-gray-500 bg-gray-700 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-gray-500;
}
```

### Badges

#### Base Badge Style
```css
.badge-base {
  @apply px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap;
}
```

#### Badge Variants
```css
/* Default/Primary Badge */
.badge-default {
  @apply bg-indigo-500 bg-opacity-80 border border-indigo-500 text-indigo-100;
}

/* Success Badge */
.badge-success {
  @apply bg-green-500 bg-opacity-80 border border-green-500 text-green-100;
}

/* Warning Badge */
.badge-warning {
  @apply bg-yellow-500 bg-opacity-80 border-yellow-500 border text-yellow-100;
}

/* Danger Badge */
.badge-danger {
  @apply bg-red-600 bg-opacity-80 border-red-500 border text-red-100;
}

/* Light Badge */
.badge-light {
  @apply bg-gray-700 text-gray-300;
}

/* Dark Badge */
.badge-dark {
  @apply bg-gray-900 text-gray-400;
}
```

### Alerts

#### Alert Structure
```html
<div class="alert alert-warning">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Icon -->
    </div>
    <div class="ml-3">
      <div class="alert-title">Title</div>
      <div class="alert-content">Content</div>
    </div>
  </div>
</div>
```

#### Alert Types
```css
/* Base Alert */
.alert {
  @apply mb-4 rounded-md p-4;
}

/* Warning Alert */
.alert-warning {
  @apply border border-yellow-500 backdrop-blur bg-yellow-400 bg-opacity-20;
}
.alert-warning .alert-title {
  @apply text-yellow-100;
}
.alert-warning .alert-content {
  @apply text-yellow-300;
}

/* Info Alert */
.alert-info {
  @apply border border-indigo-500 backdrop-blur bg-indigo-400 bg-opacity-20;
}
.alert-info .alert-title {
  @apply text-gray-100;
}
.alert-info .alert-content {
  @apply text-gray-300;
}

/* Error Alert */
.alert-error {
  @apply bg-red-600;
}
.alert-error .alert-title {
  @apply text-red-100;
}
.alert-error .alert-content {
  @apply text-red-300;
}
```

### Form Elements

#### Input Fields
```css
/* Base Input Styles */
input[type='text'], 
input[type='password'], 
select, 
textarea {
  @apply block w-full min-w-0 flex-1 rounded-md border border-gray-500 bg-gray-700 text-white transition duration-150 ease-in-out sm:text-sm sm:leading-5;
}

/* Input with Action Button */
input.rounded-l-only {
  @apply rounded-r-none;
}

/* Short Input */
input.short {
  @apply w-20;
}
```

#### Checkboxes
```css
input[type='checkbox'] {
  @apply h-6 w-6 rounded-md text-indigo-600 transition duration-150 ease-in-out;
}
```

#### Slide Toggle
```css
.slide-toggle {
  @apply relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center pt-2 focus:outline-none;
}

.slide-toggle-bg {
  @apply absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out;
}

.slide-toggle-bg.active {
  @apply bg-indigo-500;
}

.slide-toggle-bg.inactive {
  @apply bg-gray-700;
}

.slide-toggle-thumb {
  @apply absolute left-0 inline-block h-5 w-5 rounded-full border border-gray-200 bg-white shadow transition-transform duration-200 ease-in-out;
}

.slide-toggle-thumb.active {
  @apply translate-x-5;
}

.slide-toggle-thumb.inactive {
  @apply translate-x-0;
}
```

#### Input Action Buttons
```css
button.input-action {
  @apply relative -ml-px inline-flex items-center border border-gray-500 bg-indigo-600 bg-opacity-80 px-3 py-2 text-sm font-medium leading-5 text-white last:rounded-r-md sm:px-3.5;
}

button.input-action:not([disabled]) {
  @apply transition duration-150 ease-in-out hover:bg-opacity-100 active:bg-gray-100 active:text-gray-700;
}

button.input-action[disabled] {
  filter: grayscale(100%);
}
```

### Modals

#### Modal Container
```css
.modal-backdrop {
  @apply fixed top-0 bottom-0 left-0 right-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-70;
}

.modal-content {
  @apply hide-scrollbar relative inline-block w-full overflow-auto bg-gray-800 px-4 pt-4 pb-4 text-left align-bottom shadow-xl ring-1 ring-gray-700 transition-all sm:my-8 sm:max-w-3xl sm:rounded-lg sm:align-middle;
  max-height: calc(100% - env(safe-area-inset-top) * 2);
}
```

#### Modal Header
```css
.modal-title {
  @apply text-overseerr truncate pb-0.5 text-2xl font-bold leading-6;
}

.modal-subtitle {
  @apply truncate text-lg font-semibold leading-6 text-gray-200;
}
```

#### Modal Actions
```css
.modal-actions {
  @apply relative mt-5 flex flex-row-reverse justify-center sm:mt-4 sm:justify-start;
}
```

### Selectors

#### React Select Styling
```css
.react-select-container {
  @apply w-full;
}

.react-select-container .react-select__control {
  @apply rounded-md border border-gray-500 bg-gray-700 text-white hover:border-gray-500;
}

.react-select-container .react-select__control--is-focused {
  @apply rounded-md border border-gray-500 bg-gray-700 text-white shadow;
}

.react-select-container .react-select__menu {
  @apply bg-gray-700 text-gray-300;
}

.react-select-container .react-select__option--is-focused {
  @apply bg-gray-600 text-white;
}

.react-select-container .react-select__multi-value {
  @apply rounded-md border border-gray-500 bg-gray-800;
}

.react-select-container .react-select__multi-value__label {
  @apply text-white;
}

.react-select-container .react-select__multi-value__remove {
  @apply cursor-pointer rounded-r-md hover:bg-red-700 hover:text-red-100;
}
```

#### Watch Provider Selector
```css
.provider-icons {
  grid-template-columns: repeat(auto-fill, minmax(3.5rem, 1fr));
}

.provider-container {
  @apply w-full cursor-pointer rounded-lg ring-1 transition;
}

.provider-container.active {
  @apply bg-gray-600 ring-indigo-500 hover:bg-gray-500;
}

.provider-container.inactive {
  @apply bg-gray-700 ring-gray-500 hover:bg-gray-600;
}
```

## Layout Patterns

### Card Grids
```css
/* Vertical Cards (Posters) */
ul.cards-vertical {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fill, minmax(9.375rem, 1fr));
}

/* Horizontal Cards (Banners) */
ul.cards-horizontal {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr));
}
```

### Content Sliders
```css
.slider-header {
  @apply relative mt-6 mb-4 flex;
}

.slider-title {
  @apply inline-flex items-center text-xl font-bold leading-7 text-gray-300 sm:truncate sm:text-2xl sm:leading-9;
}

a.slider-title {
  @apply transition duration-300 hover:text-white;
}
```

## Media Components

### Media Page Layout
```css
.media-page {
  @apply relative -mx-4 bg-cover bg-center px-4;
  margin-top: calc(-4rem - env(safe-area-inset-top));
  padding-top: calc(4rem + env(safe-area-inset-top));
}

.media-header {
  @apply flex flex-col items-center pt-4 xl:flex-row xl:items-end;
}

.media-poster {
  @apply w-32 overflow-hidden rounded shadow md:w-44 md:rounded-lg md:shadow-2xl xl:mr-4 xl:w-52;
}

.media-title {
  @apply mt-4 flex flex-1 flex-col text-center text-white xl:mr-4 xl:mt-0 xl:text-left;
}

.media-title > h1 {
  @apply text-2xl font-bold xl:text-4xl;
}

.media-attributes {
  @apply mt-1 flex flex-wrap items-center justify-center space-x-1 text-xs text-gray-300 sm:text-sm xl:mt-0 xl:justify-start xl:text-base;
}
```

### Media Facts & Ratings
```css
.media-facts {
  @apply rounded-lg border border-gray-700 bg-gray-900 text-sm font-bold text-gray-300 shadow;
}

.media-fact {
  @apply flex justify-between border-b border-gray-700 px-4 py-2 last:border-b-0;
}

.media-fact-value {
  @apply ml-2 text-right text-sm font-normal text-gray-400;
}

.media-ratings {
  @apply flex items-center justify-center space-x-5 border-b border-gray-700 px-4 py-2 font-medium last:border-b-0;
}

.media-rating {
  @apply flex items-center space-x-1;
}
```

## Interactive States

### Hover Effects
```css
/* Link Hover */
a {
  @apply transition duration-300 hover:text-white hover:underline;
}

/* Button Hover */
button:hover {
  @apply transition duration-150 ease-in-out;
}

/* Card Hover */
.card:hover {
  @apply transform scale-105 transition duration-300;
}
```

### Focus States
```css
/* Focus Ring */
:focus {
  @apply outline-none ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-800;
}

/* Button Focus */
button:focus {
  @apply focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
```

### Active States
```css
/* Button Active */
button:active {
  @apply transform scale-95 transition duration-75;
}

/* Selected State */
.selected {
  @apply bg-indigo-600 text-white;
}
```

## Responsive Design

### Breakpoints (Tailwind CSS)
```css
/* Small devices (640px and up) */
@media (min-width: 640px) { /* sm: */ }

/* Medium devices (768px and up) */
@media (min-width: 768px) { /* md: */ }

/* Large devices (1024px and up) */
@media (min-width: 1024px) { /* lg: */ }

/* Extra large devices (1280px and up) */
@media (min-width: 1280px) { /* xl: */ }
```

### Mobile-First Patterns
```css
/* Typography scaling */
.responsive-title {
  @apply text-2xl font-bold xl:text-4xl;
}

/* Layout stacking */
.responsive-flex {
  @apply flex flex-col items-center xl:flex-row xl:items-end;
}

/* Spacing adjustments */
.responsive-spacing {
  @apply mt-4 xl:mr-4 xl:mt-0;
}
```

### Safe Area Support
```css
/* iOS Safe Area handling */
html {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) calc(4rem + env(safe-area-inset-bottom)) env(safe-area-inset-left);
}

.searchbar {
  padding-top: env(safe-area-inset-top);
  height: calc(4rem + env(safe-area-inset-top));
}

.sidebar {
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
}
```

## Animations & Transitions

### Standard Transitions
```css
/* Default transition timing */
.transition-standard {
  @apply transition duration-150 ease-in-out;
}

/* Slow transition for hover effects */
.transition-slow {
  @apply transition duration-300;
}

/* Fast transition for clicks */
.transition-fast {
  @apply transition duration-75;
}
```

### Loading States
```css
/* Loading spinner */
.loading-spinner {
  @apply animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500;
}

/* Skeleton loading */
.skeleton {
  @apply animate-pulse bg-gray-700 rounded;
}
```

### Modal Animations
```css
/* Modal entrance */
.modal-enter {
  @apply transition duration-300;
  transform: scale(0.75);
  opacity: 0;
}

.modal-enter-active {
  transform: scale(1);
  opacity: 1;
}

/* Modal exit */
.modal-exit {
  @apply transition-opacity duration-300;
  opacity: 1;
}

.modal-exit-active {
  opacity: 0;
}
```

### Backdrop Effects
```css
/* Glassmorphism effect for alerts */
.glass-effect {
  @apply backdrop-blur bg-opacity-20;
}

/* Background gradients */
.gradient-overlay {
  background-image: linear-gradient(180deg, rgba(31, 41, 55, 0.75) 0%, rgba(31, 41, 55, 1) 100%);
}
```

## Accessibility

### Screen Reader Support
```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Focus Management
```css
/* High contrast focus indicators */
:focus-visible {
  @apply outline-none ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-800;
}

/* Skip links */
.skip-link {
  @apply absolute -top-10 left-6 bg-indigo-600 px-4 py-2 text-white transition-all focus:top-6;
}
```

### Color Contrast
- All text meets WCAG AA contrast requirements
- Interactive elements have minimum 3:1 contrast ratio
- Focus indicators are clearly visible against all backgrounds

---

## Usage Guidelines

### Component Consistency
1. **Always use the defined component classes** rather than creating custom styles
2. **Follow the established color patterns** for semantic meaning
3. **Maintain consistent spacing** using the defined scale
4. **Use appropriate typography hierarchy** for content organization

### Performance Considerations
1. **Leverage Tailwind's utility-first approach** for optimal CSS bundle size
2. **Use transitions sparingly** and only where they enhance UX
3. **Optimize images** and use appropriate formats for media content
4. **Test on various devices** to ensure responsive behavior

### Customization
When extending the design system:
1. **Follow existing patterns** and naming conventions
2. **Maintain accessibility standards** in all custom components
3. **Test thoroughly** across different browsers and devices
4. **Document any additions** to this style guide

This design system provides a solid foundation for building consistent, accessible, and beautiful user interfaces in the Seerr application.