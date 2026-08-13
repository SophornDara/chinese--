# Scientific Calculator

A single-page calculator web app built with **Vue 3** (Composition API, `<script setup>`), **Tailwind CSS**, and **mathjs**. Everything runs client-side — no backend, no API keys. Deployable as a fully static site to GitHub Pages, Netlify, or Vercel.

## Features

- **Basic mode** — `+ − × ÷`, `%`, parentheses, decimal point, `C`, `AC`, backspace, sign toggle, and memory functions (`M+`, `M−`, `MR`, `MC`)
- **Scientific mode** — `sin / cos / tan`, inverses (`sin⁻¹ / cos⁻¹ / tan⁻¹`), `ln`, `log`, `eˣ`, `10ˣ`, powers (`x²`, `x³`, `xʸ`), roots (`√x`, `∛x`), constants (`π`, `e`), factorial (`n!`), and a **Deg / Rad** toggle
- **Calculus mode** — symbolic derivative of a function of `x` (via mathjs `derivative`), and a **definite integral** approximated with **Simpson's rule** (N = 2000 subintervals)
- **Live preview** — the result updates as you type; `=` commits the calculation
- **History panel** — stores past calculations (expression + result), persists in `localStorage`, click an entry to reuse it
- **Keyboard support** — digits, `.`, `+ − * /`, `^`, `!`, `%`, `( )`, `Enter`/`=` to evaluate, `Backspace` to delete, `Escape` to clear, plus `p`/`e`/`s`/`c`/`t`/`n`/`l`/`a` shortcuts for π, e, and trig/log functions
- **Graceful errors** — divide-by-zero, overflow, and invalid expressions show `Error` instead of crashing
- **Dark mode** — class-based toggle via Tailwind's `dark:` variant (respects system preference on first load)
- **Responsive** — mobile-first layout (works at 375px) with a side-by-side history panel on larger screens (1024px+)

## Tech stack

- [Vue 3](https://vuejs.org/) — Composition API, `<script setup>`
- [Vite](https://vitejs.dev/) — build tool, `base: './'` for static hosting on subpaths
- [Tailwind CSS v3](https://tailwindcss.com/) — utility classes only, `darkMode: 'class'`
- [mathjs](https://mathjs.org/) — expression parsing/evaluation, symbolic derivatives, and the function evaluations used by the Simpson's rule integrator

## Project structure

```
src/
├── main.js                  # App entry
├── App.vue                  # Root component
├── style.css                # Tailwind directives
├── lib/
│   └── calc.js              # mathjs instances, evaluation, formatting, integration
└── components/
    ├── Calculator.vue       # Main component (state, keyboard, logic, layout)
    ├── Display.vue          # Expression + result display
    ├── ButtonGrid.vue       # Basic mode button grid (+ memory buttons)
    ├── ScientificPanel.vue  # Scientific functions and deg/rad toggle
    ├── CalculusPanel.vue    # Derivative + integral tools
    └── HistoryPanel.vue     # Persistent history sidebar
```

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## Deploying

The build output in `dist/` is fully static. Because `base` is set to `'./'`, it works on GitHub Pages project pages, Netlify, and Vercel with no extra configuration.

- **Netlify / Vercel** — connect the repo, build command `npm run build`, output directory `dist`.
- **GitHub Pages** — push `dist/` (or run `npm run build` in CI) and serve it from the workflow.

## Notes

- The `%` key is treated as a percent operator (`50%` → `0.5`, `200 + 10%` → `200.1`).
- The deg/rad toggle affects the calculator's `sin`/`cos`/`tan` and inverses. Calculus functions always use radians (standard mathematical convention).
- History and theme preference are stored in `localStorage` and persist across reloads."# -" 
