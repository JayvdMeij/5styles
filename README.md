# Poster Language — Five poster styles every designer should know

A one-page visual guide to poster design, built in Astro. Five classic poster
styles (Swiss Grid, Constructivist, Psychedelic, Brutalist and Zine Xerox),
each drawn entirely in code as its own component, with the anatomy of a good
poster, eight rules and a short timeline of the styles.

**Live:** [YOUR LIVE URL]

## Stack

- [Astro](https://astro.build): static, component-based, zero JavaScript by default
- TypeScript for the scripts
- [GSAP](https://gsap.com) + ScrollTrigger for the entrance, parallax and scroll animations
- Plain CSS with design tokens as custom properties

## Structure

```text
src/
├── components/
│   ├── posters/        one component per poster style, drawn in HTML and CSS
│   └── ...             Header, Footer, Button, Card, PosterCard, Marquee
├── layouts/            BaseLayout: meta, fonts, global styles
├── pages/index.astro   the page and its content
├── scripts/motion.ts   all GSAP animation in one place
└── styles/tokens.css   colours, fonts and spacing as CSS variables
```

Colours and type live as custom properties on `:root` in
`src/styles/tokens.css`. Change `--paper`, `--ink` or `--accent` there and the
whole page follows.

## Motion and accessibility

All animation is set up in `src/scripts/motion.ts`. It does not run when the
visitor has `prefers-reduced-motion` turned on, and hover effects only run on
devices with a precise pointer.

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in ./dist
```