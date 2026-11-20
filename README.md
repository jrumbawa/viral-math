# Viral Math 4 Kids

A bright, kid-friendly math app built with React + Vite + Tailwind CSS.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## What's built so far

- Home page with a points bank in the header (starts at 0 on your first visit)
- Lesson cards for Addition, Subtraction, Multiplication, and Division, all playable
- Each lesson: worked examples, one-at-a-time practice with instant
  feedback, and a 10-question quiz that scores you and adds points
  (10 points per correct answer) to the bank
- Subtraction teaching includes a step-by-step borrowing example (32 − 15)
- Multiplication teaching includes times tables and a two-digit ×
  one-digit example (23 × 3), which also appear in its quiz
- Division teaching covers sharing and grouping, dividing by 2, 5, and 10,
  and simple division with no remainders
- A Squishy Shop linked from the home page: a 50-point mystery box revealing
  a random collectible squishy (common/rare/epic), or buy a chosen squishy
  directly for 100 points. The balance never goes below 0, and you get a
  friendly message when you don't have enough points yet
- A Collection page showing every squishy you own (duplicates counted)
- Points and your collection persist in `localStorage`, so they survive a refresh

## Other commands

```bash
npm run build    # production build
npm run preview  # preview the production build
```
