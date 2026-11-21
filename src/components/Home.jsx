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
  {
    id: 'division',
    symbol: '÷',
    title: 'Division',
    tagline: 'Share equally and make fair groups!',
    example: '12 ÷ 3 = 4',
    colors: 'bg-sky-400 shadow-[0_6px_0_#0369a1]',
    badge: 'bg-sky-100 text-sky-800',
    button: 'bg-sky-500 shadow-[0_6px_0_#0369a1] hover:bg-sky-400 focus-visible:ring-sky-300',
    available: true,
  },
  {
    id: 'fractions',
    symbol: '½',
    title: 'Fractions',
    tagline: 'Split a whole into equal parts!',
    example: '1/4 + 2/4 = 3/4',
    colors: 'bg-lime-400 shadow-[0_6px_0_#3f6212]',
    badge: 'bg-lime-100 text-lime-800',
    button: 'bg-lime-500 shadow-[0_6px_0_#3f6212] hover:bg-lime-400 focus-visible:ring-lime-300',
    available: true,
  },
]

export default function Home({ onStartLesson, onOpenShop, onOpenCollection }) {
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

      <section className="mt-8 rounded-[2rem] border-4 border-amber-300 bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8" aria-label="Shop">
        <p className="text-6xl" aria-hidden="true">🎁</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Squishy Shop</h2>
        <p className="mx-auto mt-1 max-w-md text-lg font-bold text-slate-600">
          Spend your ★ points on mystery boxes and squishy toys, then show them off in your collection!
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onOpenShop}
            className="min-h-16 rounded-full bg-amber-500 px-8 font-display text-2xl font-extrabold text-white shadow-[0_6px_0_#b45309] transition hover:bg-amber-400 active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            Visit the shop →
          </button>
          <button
            type="button"
            onClick={onOpenCollection}
            className="min-h-16 rounded-full bg-teal-500 px-8 font-display text-2xl font-extrabold text-white shadow-[0_6px_0_#0f766e] transition hover:bg-teal-400 active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
          >
            My collection
          </button>
        </div>
      </section>

      <p className="mt-10 text-center text-lg font-bold text-slate-500">
        Finish a quiz to earn <span className="text-amber-600">★ points</span> — 10 points for every right answer!
      </p>
    </main>
  )
}
