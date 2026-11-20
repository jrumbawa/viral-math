export default function Header({ points, onHome }) {
  return (
    <header className="sticky top-0 z-10 border-b-4 border-amber-300 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onHome}
          className="flex min-h-14 items-center gap-2.5 rounded-2xl px-2 py-1 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          aria-label="Viral Math 4 Kids — go home"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 font-display text-2xl font-extrabold text-amber-950 shadow-[0_4px_0_#d97706]">
            123
          </span>
          <span className="font-display text-xl leading-none font-extrabold text-slate-900 sm:text-2xl">
            Viral Math
            <span className="block text-sm font-bold text-teal-600 sm:text-base">4 Kids</span>
          </span>
        </button>

        <div
          className="flex min-h-14 items-center gap-2 rounded-full border-4 border-amber-300 bg-amber-100 px-4 py-2 sm:px-5"
          role="status"
          aria-label={`Points bank: ${points} points`}
        >
          <span className="text-2xl text-amber-500" aria-hidden="true">★</span>
          <span className="font-display text-2xl font-extrabold text-amber-900 tabular-nums">{points}</span>
          <span className="hidden text-sm font-extrabold text-amber-700 sm:inline">points</span>
        </div>
      </div>
    </header>
  )
}
