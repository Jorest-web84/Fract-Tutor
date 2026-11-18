# Frac-Ground — a fraction lesson

A phone-first, frontend-only maths tutorial for adding fractions with different denominators. The interface uses short, guided steps inspired by familiar language-learning lesson pacing, with original copy and artwork.

## Run it locally

1. Install Node.js 20 or later.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local address Vite prints.
4. Run `npm run build` to create a production build in `dist/`.

## Lesson content

Edit `src/content/fractions.lesson.json` to change the explanations, examples, hints, feedback, or accepted answers. The lesson has four required stages: explain, worked example, guided practice, and independent practice. The answer checking in `src/lib/answer-checker.ts` reads accepted values and mistake-specific feedback from that file.

For typed practice, learners can use ordinary notation (`2/6 + 3/6`) or tap the `a/b` key to insert a slash. Each line is checked before the next line appears. Hints are available at every practice step. The tutor is text-only on purpose: the small original face is a quiet visual cue, while all teaching words remain readable on screen.

## Design notes

See [`docs/design-notes.md`](docs/design-notes.md) for the design decisions and remaining project handoff checks.
