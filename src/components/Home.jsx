const lessons = [
  {
    id: 'addition',
    symbol: '+',
    title: 'Addition',
    tagline: 'Put numbers together and count them all!',
    example: '3 + 2 = 5',
    colors: 'bg-orange-400 shadow-[0_6px_0_#c2410c]',
    badge: 'bg-orange-100 text-orange-800',
    button: 'bg-orange-500 shadow-[0_6px_0_#9a3412] hover:bg-orange-400 focus-visible:ring-orange-300',
    available: true,
  },
  {
    id: 'subtraction',
    symbol: '−',
    title: 'Subtraction',
    tagline: 'Take numbers away and see what is left!',
    example: '5 − 2 = 3',
    colors: 'bg-teal-400 shadow-[0_6px_0_#0f766e]',
    badge: 'bg-teal-100 text-teal-800',
    button: 'bg-teal-500 shadow-[0_6px_0_#0f766e] hover:bg-teal-400 focus-visible:ring-teal-300',
    available: true,
  },
  {
    id: 'multiplication',
    symbol: '×',
    title: 'Multiplication',
    tagline: 'Count equal groups the fast way!',
    example: '3 × 4 = 12',
    colors: 'bg-rose-400 shadow-[0_6px_0_#be123c]',
    badge: 'bg-rose-100 text-rose-800',
    button: 'bg-rose-500 shadow-[0_6px_0_#be123c] hover:bg-rose-400 focus-visible:ring-rose-300',
    available: true,
  },
]

export default function Home({ onStartLesson }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <section className="pt-10 pb-8 text-center sm:pt-14">
        <h1 className="font-display text-5xl leading-[1.05] font-extrabold text-slate-900 sm:text-6xl">
          Math is a
          <span className="text-orange-500"> superpower!</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-xl font-bold text-slate-600">
          Pick a lesson, learn with fun examples, and earn stars for your points bank.
        </p>
      </section>

      <section aria-label="Lessons" className="grid gap-6 sm:grid-cols-2">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="flex flex-col rounded-[2rem] border-4 border-white bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          >
            <div className={`flex h-20 w-20 items-center justify-center rounded-3xl font-display text-5xl font-extrabold text-white ${lesson.colors}`} aria-hidden="true">
              {lesson.symbol}
            </div>
            <h2 className="mt-5 font-display text-3xl font-extrabold text-slate-900">{lesson.title}</h2>
            <p className="mt-1 text-lg font-bold text-slate-600">{lesson.tagline}</p>
            <p className={`mt-4 inline-flex w-fit rounded-full px-4 py-1.5 font-display text-xl font-extrabold ${lesson.badge}`}>
              {lesson.example}
            </p>
            {lesson.available ? (
              <button
                type="button"
                onClick={() => onStartLesson(lesson.id)}
                className={`mt-6 min-h-16 w-full rounded-full font-display text-2xl font-extrabold text-white transition active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 ${lesson.button}`}
              >
                Start learning →
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 min-h-16 w-full cursor-not-allowed rounded-full bg-slate-200 font-display text-2xl font-extrabold text-slate-500"
              >
                Coming soon 🔒
              </button>
            )}
          </article>
        ))}
      </section>

      <p className="mt-10 text-center text-lg font-bold text-slate-500">
        Finish a quiz to earn <span className="text-amber-600">★ points</span> — 10 points for every right answer!
      </p>
    </main>
  )
}
