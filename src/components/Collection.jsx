import { SQUISHIES } from '../data/squishies'
import { SquishyCard } from './Shop'

export default function Collection({ collection, onHome, onOpenShop }) {
  const owned = SQUISHIES
    .map((squishy) => ({ squishy, count: collection.filter((id) => id === squishy.id).length }))
    .filter((entry) => entry.count > 0)
  const total = collection.length

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <button
        type="button"
        onClick={onHome}
        className="mt-6 min-h-12 rounded-full bg-white px-5 font-display text-lg font-extrabold text-slate-700 shadow-[0_4px_0_#cbd5e1] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
      >
        ← Back to lessons
      </button>

      <div className="mt-6 text-center">
        <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
          My <span className="text-teal-600">Collection</span>
        </h1>
        <p className="mt-2 text-xl font-bold text-slate-600">
          {total === 0
            ? 'No squishies yet!'
            : `You have ${total} ${total === 1 ? 'squishy' : 'squishies'} — ${owned.length} different ${owned.length === 1 ? 'kind' : 'kinds'}!`}
        </p>
      </div>

      {total === 0 ? (
        <section className="mt-8 rounded-[2rem] border-4 border-white bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <p className="text-6xl" aria-hidden="true">🧸</p>
          <p className="mt-3 font-display text-2xl font-extrabold text-slate-800">Your shelf is empty</p>
          <p className="mx-auto mt-1 max-w-md text-lg font-bold text-slate-600">
            Earn ★ points in a quiz, then visit the shop to get your first squishy!
          </p>
          <button
            type="button"
            onClick={onOpenShop}
            className="mt-5 min-h-16 rounded-full bg-amber-500 px-8 font-display text-2xl font-extrabold text-white shadow-[0_6px_0_#b45309] transition hover:bg-amber-400 active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            Go to the shop →
          </button>
        </section>
      ) : (
        <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3" aria-label="Squishies you own">
          {owned.map(({ squishy, count }) => (
            <SquishyCard key={squishy.id} squishy={squishy} count={count} />
          ))}
        </section>
      )}
    </main>
  )
}
