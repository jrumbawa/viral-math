import { useState } from 'react'
import { DIRECT_BUY_IDS, RARITIES, getSquishy, rollMysterySquishy } from '../data/squishies'

export const MYSTERY_COST = 50
export const DIRECT_COST = 100

function RarityBadge({ rarity }) {
  const r = RARITIES[rarity]
  return <span className={`rounded-full px-3 py-1 font-display text-sm font-extrabold ${r.badge}`}>{r.label}</span>
}

export function SquishyCard({ squishy, count }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-4 text-center shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
      <span className="text-6xl" role="img" aria-label={squishy.name}>{squishy.emoji}</span>
      <p className="mt-2 font-display text-xl font-extrabold text-slate-900">{squishy.name}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <RarityBadge rarity={squishy.rarity} />
        {count > 1 && <span className="rounded-full bg-slate-100 px-2.5 py-1 font-display text-sm font-extrabold text-slate-600">×{count}</span>}
      </div>
    </div>
  )
}

export default function Shop({ points, collection, onSpend, onAddSquishy, onHome, onOpenCollection }) {
  const [revealed, setRevealed] = useState(null)
  const [message, setMessage] = useState(null) // { kind: 'error' | 'success', text }

  const ownedCount = (id) => collection.filter((c) => c === id).length

  function notEnough(cost) {
    setMessage({
      kind: 'error',
      text: `Not enough points yet! You have ${points} ★, but that costs ${cost} ★. Finish a quiz to earn more — 10 points for every right answer!`,
    })
  }

  function openMysteryBox() {
    if (points < MYSTERY_COST) {
      notEnough(MYSTERY_COST)
      return
    }
    if (!onSpend(MYSTERY_COST)) {
      notEnough(MYSTERY_COST)
      return
    }
    const squishy = rollMysterySquishy()
    onAddSquishy(squishy.id)
    setRevealed(squishy)
    const count = ownedCount(squishy.id) + 1
    setMessage({
      kind: 'success',
      text: count > 1
        ? `Another ${squishy.name}! You now have ${count} of them.`
        : `A brand-new ${squishy.name} joins your collection!`,
    })
  }

  function buyDirect(squishy) {
    if (points < DIRECT_COST) {
      notEnough(DIRECT_COST)
      return
    }
    if (!onSpend(DIRECT_COST)) {
      notEnough(DIRECT_COST)
      return
    }
    onAddSquishy(squishy.id)
    setRevealed(squishy)
    const count = ownedCount(squishy.id) + 1
    setMessage({
      kind: 'success',
      text: count > 1
        ? `Another ${squishy.name}! You now have ${count} of them.`
        : `You bought ${squishy.name}! Find it in your collection.`,
    })
  }

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
          Squishy <span className="text-amber-500">Shop</span>
        </h1>
        <p className="mt-2 text-xl font-bold text-slate-600">
          Spend your ★ points on squishy toys! You have <span className="text-amber-600">{points} ★</span>
        </p>
      </div>

      {message && (
        <div
          role="alert"
          aria-live="polite"
          className={`animate-pop mx-auto mt-6 max-w-xl rounded-3xl p-5 text-center font-display text-xl font-extrabold ${
            message.kind === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {message.kind === 'error' ? '😢 ' : '🎉 '}{message.text}
        </div>
      )}

      {revealed && (
        <section className="animate-pop mx-auto mt-6 max-w-sm" aria-label="Your new squishy">
          <SquishyCard squishy={revealed} count={ownedCount(revealed.id)} />
          <button
            type="button"
            onClick={onOpenCollection}
            className="mt-4 min-h-14 w-full rounded-full bg-teal-500 font-display text-xl font-extrabold text-white shadow-[0_5px_0_#0f766e] transition hover:bg-teal-400 active:translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
          >
            See my collection →
          </button>
        </section>
      )}

      <section className="mt-8 rounded-[2rem] border-4 border-white bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8" aria-label="Mystery box">
        <p className="text-7xl" aria-hidden="true">🎁</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Mystery Box</h2>
        <p className="mx-auto mt-1 max-w-md text-lg font-bold text-slate-600">
          A surprise squishy hides inside! Common 60%, rare 30%, epic 10% — will you get lucky?
        </p>
        <button
          type="button"
          onClick={openMysteryBox}
          className="mt-5 min-h-16 w-full rounded-full bg-amber-500 px-6 font-display text-2xl font-extrabold text-white shadow-[0_6px_0_#b45309] transition hover:bg-amber-400 active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 sm:w-auto sm:min-w-72"
        >
          Open for {MYSTERY_COST} ★
        </button>
        {points < MYSTERY_COST && (
          <p className="mt-3 font-bold text-slate-500">You need {MYSTERY_COST - points} more ★ to open one.</p>
        )}
      </section>

      <section className="mt-8" aria-label="Buy a squishy">
        <h2 className="text-center font-display text-3xl font-extrabold text-slate-900">Pick Your Squishy</h2>
        <p className="mt-1 text-center text-lg font-bold text-slate-600">Choose exactly the one you want — {DIRECT_COST} ★ each.</p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {DIRECT_BUY_IDS.map((id) => {
            const squishy = getSquishy(id)
            const count = ownedCount(id)
            return (
              <div key={id} className="flex flex-col">
                <SquishyCard squishy={squishy} count={count} />
                <button
                  type="button"
                  onClick={() => buyDirect(squishy)}
                  className="mt-2 min-h-14 w-full rounded-full bg-rose-500 font-display text-xl font-extrabold text-white shadow-[0_5px_0_#be123c] transition hover:bg-rose-400 active:translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300"
                  aria-label={`Buy ${squishy.name} for ${DIRECT_COST} points`}
                >
                  Buy · {DIRECT_COST} ★
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
