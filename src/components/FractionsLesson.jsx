import { useRef, useState } from 'react'
import { makeFractionQuestions } from '../lib/questions'

const PRAISE = ['Great job!', 'You did it!', 'Super work!', 'Brilliant!', 'Way to go!']

function FractionBar({ total, shaded, label }) {
  return (
    <div aria-hidden="true">
      <div className="flex gap-1.5" role="img" aria-label={label}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-10 flex-1 rounded-lg border-4 sm:h-12 ${i < shaded ? 'border-lime-500 bg-lime-400' : 'border-slate-300 bg-white'}`}
          />
        ))}
      </div>
    </div>
  )
}

function FractionText({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center align-middle leading-none" aria-label={`${num} over ${den}`}>
      <span className="px-1">{num}</span>
      <span className="my-0.5 w-full border-t-4 border-current" aria-hidden="true" />
      <span className="px-1">{den}</span>
    </span>
  )
}

function ProgressDots({ total, current }) {
  return (
    <div className="flex justify-center gap-2" aria-label={`Question ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-3.5 w-3.5 rounded-full ${i < current ? 'bg-lime-400' : i === current ? 'bg-slate-800' : 'bg-slate-300'}`} />
      ))}
    </div>
  )
}

function BigButton({ children, onClick, color = 'bg-lime-500 shadow-[0_6px_0_#3f6212] hover:bg-lime-400', disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-16 w-full rounded-full px-6 font-display text-2xl font-extrabold text-white transition active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-56 ${color}`}
    >
      {children}
    </button>
  )
}

function AnswerForm({ onCheck, disabled, inputId }) {
  const [num, setNum] = useState('')
  const [den, setDen] = useState('')
  const ready = num.trim() !== '' && den.trim() !== ''
  return (
    <form
      className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault()
        if (!ready) return
        onCheck(Number(num), Number(den))
        setNum('')
        setDen('')
      }}
    >
      <div className="flex flex-col items-center" aria-label="Your fraction answer">
        <label className="sr-only" htmlFor={`${inputId}-top`}>Top number (numerator)</label>
        <input
          id={`${inputId}-top`}
          type="number"
          inputMode="numeric"
          min="0"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          disabled={disabled}
          placeholder="?"
          autoFocus
          className="h-14 w-28 rounded-3xl border-4 border-slate-300 bg-white text-center font-display text-4xl font-extrabold text-slate-900 tabular-nums focus:border-lime-400 focus:outline-none disabled:bg-slate-100"
        />
        <span className="my-1.5 h-1.5 w-28 rounded-full bg-slate-800" aria-hidden="true" />
        <label className="sr-only" htmlFor={`${inputId}-bottom`}>Bottom number (denominator)</label>
        <input
          id={`${inputId}-bottom`}
          type="number"
          inputMode="numeric"
          min="1"
          value={den}
          onChange={(e) => setDen(e.target.value)}
          disabled={disabled}
          placeholder="?"
          className="h-14 w-28 rounded-3xl border-4 border-slate-300 bg-white text-center font-display text-4xl font-extrabold text-slate-900 tabular-nums focus:border-lime-400 focus:outline-none disabled:bg-slate-100"
        />
        <span className="mt-2 text-sm font-extrabold text-slate-500">top / bottom</span>
      </div>
      <BigButton type="submit" disabled={disabled || !ready}>Check ✓</BigButton>
    </form>
  )
}

function questionPrompt(q) {
  if (q.kind === 'identify') return 'What fraction is shaded?'
  if (q.kind === 'equivalent') return `${q.givenNum}/${q.givenDen} = ?/${q.targetDen} — write the missing fraction`
  return `${q.aNum}/${q.aDen} + ${q.bNum}/${q.bDen} = ?`
}

function questionHint(q) {
  if (q.kind === 'identify') return 'Not quite — count the shaded parts for the top number and ALL the equal parts for the bottom number, then try again! You can do it 💪'
  if (q.kind === 'equivalent') return 'Not quite — the bottom number was multiplied, so multiply the top number by the same amount, then try again! You can do it 💪'
  return 'Not quite — keep the bottom number the same and add only the top numbers, then try again! You can do it 💪'
}

function QuestionVisual({ q }) {
  if (q.kind === 'identify') {
    return (
      <div className="mx-auto max-w-md">
        <FractionBar total={q.total} shaded={q.shaded} label={`${q.shaded} of ${q.total} parts shaded`} />
        <p className="mt-3 font-display text-2xl font-extrabold text-slate-600">
          {q.shaded} of {q.total} equal parts are shaded
        </p>
      </div>
    )
  }
  if (q.kind === 'equivalent') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 font-display text-5xl font-extrabold text-slate-900 sm:text-6xl">
        <FractionText num={q.givenNum} den={q.givenDen} />
        <span>=</span>
        <span className="text-lime-600">?</span>
        <span className="font-display text-3xl font-extrabold text-slate-500">/ {q.targetDen}</span>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 font-display text-5xl font-extrabold text-slate-900 sm:text-6xl">
      <FractionText num={q.aNum} den={q.aDen} />
      <span>+</span>
      <FractionText num={q.bNum} den={q.bDen} />
      <span>= ?</span>
    </div>
  )
}

export default function FractionsLesson({ onHome, onAddPoints }) {
  const [phase, setPhase] = useState('learn') // learn | practice | quiz | result
  const [practiceQs] = useState(() => makeFractionQuestions(5))
  const [quizQs, setQuizQs] = useState(() => makeFractionQuestions(10))
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [quizScore, setQuizScore] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [praise, setPraise] = useState(PRAISE[0])
  const pointsAddedRef = useRef(false)

  const questions = phase === 'practice' ? practiceQs : quizQs
  const current = questions[index]

  function startPhase(next) {
    setPhase(next)
    setIndex(0)
    setFeedback(null)
    if (next === 'quiz') {
      setQuizQs(makeFractionQuestions(10))
      setQuizScore(0)
      pointsAddedRef.current = false
    }
  }

  function handleCheck(num, den) {
    if (!current || feedback === 'correct') return
    const isCorrect = den > 0 && num * current.answerDen === current.answerNum * den
    if (phase === 'practice') {
      if (isCorrect) setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)])
      setFeedback(isCorrect ? 'correct' : 'wrong')
      return
    }
    // Quiz: no instant reveal, just move on and tally.
    const newScore = quizScore + (isCorrect ? 1 : 0)
    if (index + 1 < quizQs.length) {
      setQuizScore(newScore)
      setIndex(index + 1)
    } else {
      const earned = newScore * 10
      setQuizScore(newScore)
      setPointsEarned(earned)
      if (!pointsAddedRef.current) {
        pointsAddedRef.current = true
        onAddPoints(earned)
      }
      setPhase('result')
    }
  }

  function handleNextPractice() {
    if (index + 1 < practiceQs.length) {
      setIndex(index + 1)
      setFeedback(null)
    } else {
      startPhase('quiz')
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
      <button
        type="button"
        onClick={onHome}
        className="mt-6 min-h-12 rounded-full bg-white px-5 font-display text-lg font-extrabold text-slate-700 shadow-[0_4px_0_#cbd5e1] focus:outline-none focus-visible:ring-4 focus-visible:ring-lime-300"
      >
        ← Back to lessons
      </button>

      <div className="mt-6 text-center">
        <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Fractions <span className="text-lime-600">½</span>
        </h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Lesson steps">
          {[['learn', '1. Learn'], ['practice', '2. Practice'], ['quiz', '3. Quiz']].map(([id, label]) => (
            <span
              key={id}
              aria-current={phase === id || (phase === 'result' && id === 'quiz') ? 'step' : undefined}
              className={`rounded-full px-4 py-2 font-display text-lg font-extrabold ${
                phase === id || (phase === 'result' && id === 'quiz')
                  ? 'bg-lime-500 text-white'
                  : 'bg-white text-slate-500'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {phase === 'learn' && (
        <section className="animate-pop mt-8" aria-label="Learn fractions">
          <div className="rounded-[2rem] border-4 border-white bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
            <h2 className="font-display text-3xl font-extrabold text-slate-900">What is a fraction?</h2>
            <p className="mt-2 text-xl font-bold text-slate-600">
              A fraction is <span className="text-lime-700">part of a whole</span> split into equal parts. The <span className="text-lime-700">top number (numerator)</span> counts the parts you have, and the <span className="text-lime-700">bottom number (denominator)</span> counts all the equal parts.
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-lime-50 p-5">
                <p className="font-display text-2xl font-extrabold text-slate-800">Halves, thirds, and quarters</p>
                <p className="mt-1 text-lg font-bold text-slate-600">Split one whole bar into equal parts. Fewer parts means each part is bigger!</p>
                <div className="mt-4 grid gap-4">
                  <div>
                    <FractionBar total={2} shaded={1} label="1 of 2 parts shaded" />
                    <p className="mt-2 font-display text-xl font-extrabold text-slate-800">1/2 — one half: 1 of 2 equal parts</p>
                  </div>
                  <div>
                    <FractionBar total={3} shaded={1} label="1 of 3 parts shaded" />
                    <p className="mt-2 font-display text-xl font-extrabold text-slate-800">1/3 — one third: 1 of 3 equal parts</p>
                  </div>
                  <div>
                    <FractionBar total={4} shaded={3} label="3 of 4 parts shaded" />
                    <p className="mt-2 font-display text-xl font-extrabold text-slate-800">3/4 — three quarters: 3 of 4 equal parts</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-lime-50 p-5">
                <p className="font-display text-2xl font-extrabold text-slate-800">Equivalent fractions: 1/2 = 2/4 = 3/6</p>
                <p className="mt-1 text-lg font-bold text-slate-600">
                  Equivalent fractions look different but show the <strong>same amount</strong>. Multiply the top and bottom by the same number: 1 × 2 = 2 and 2 × 2 = 4, so 1/2 = 2/4.
                </p>
                <div className="mt-4 grid gap-3">
                  <FractionBar total={2} shaded={1} label="1 of 2 parts shaded" />
                  <FractionBar total={4} shaded={2} label="2 of 4 parts shaded" />
                  <FractionBar total={6} shaded={3} label="3 of 6 parts shaded" />
                </div>
                <p className="mt-3 text-lg font-bold text-slate-600">Every bar is half shaded — 1/2, 2/4, and 3/6 are all worth the same!</p>
              </div>

              <div className="rounded-3xl bg-amber-50 p-5">
                <p className="font-display text-2xl font-extrabold text-slate-800">Adding fractions with the same denominator: 1/4 + 2/4 = 3/4</p>
                <p className="mt-1 text-lg font-bold text-slate-600">When both fractions have the same denominator, adding is easy:</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-lg font-bold text-slate-700">
                  <li>Keep the bottom number (denominator) the same: it stays <strong>4</strong>.</li>
                  <li>Add only the top numbers (numerators): 1 + 2 = <strong>3</strong>.</li>
                  <li>Put them together: <strong>3/4</strong>. So 1/4 + 2/4 = 3/4 ✓</li>
                </ol>
                <div className="mt-4">
                  <FractionBar total={4} shaded={3} label="3 of 4 parts shaded" />
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <BigButton onClick={() => startPhase('practice')}>Let&apos;s practice →</BigButton>
            </div>
          </div>
        </section>
      )}

      {(phase === 'practice' || phase === 'quiz') && current && (
        <section className="animate-pop mt-8" aria-label={phase === 'practice' ? 'Practice questions' : 'Quiz'}>
          <div className="rounded-[2rem] border-4 border-white bg-white p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
            <ProgressDots total={questions.length} current={index} />
            <p className="mt-4 font-display text-lg font-extrabold tracking-wide text-slate-500 uppercase">
              {phase === 'practice' ? `Practice ${index + 1} of ${questions.length}` : `Quiz question ${index + 1} of ${questions.length}`}
            </p>
            <p className="mt-4 font-display text-4xl font-extrabold text-slate-900 sm:text-5xl" aria-live="polite">
              {questionPrompt(current)}
            </p>

            <div className="mt-6">
              <QuestionVisual q={current} />
            </div>

            <div className="mt-8">
              <AnswerForm key={`${phase}-${index}-${feedback === 'wrong' ? 'retry' : 'new'}`} onCheck={handleCheck} disabled={feedback === 'correct'} inputId={`${phase}-frac-answer`} />
            </div>

            {phase === 'practice' && feedback && (
              <div
                role="alert"
                className={`animate-pop mx-auto mt-6 max-w-md rounded-3xl p-5 font-display text-2xl font-extrabold ${
                  feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <p>🎉 {praise} The answer is {current.answerNum}/{current.answerDen}</p>
                    <div className="mt-4">
                      <BigButton onClick={handleNextPractice} color="bg-green-500 shadow-[0_6px_0_#15803d] hover:bg-green-400">
                        {index + 1 < practiceQs.length ? 'Next question →' : 'Start the quiz →'}
                      </BigButton>
                    </div>
                  </>
                ) : (
                  <p>{questionHint(current)}</p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {phase === 'result' && (
        <section className="animate-pop mt-8 text-center" aria-label="Quiz results">
          <div className="rounded-[2rem] border-4 border-white bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <p className="text-5xl" aria-hidden="true">{quizScore >= 8 ? '🏆' : quizScore >= 5 ? '⭐' : '🌟'}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-slate-900">Quiz complete!</h2>
            <p className="mt-3 font-display text-3xl font-extrabold text-slate-800">
              You scored {quizScore} out of {quizQs.length}
            </p>
            <p className="mt-2 text-2xl" aria-label={`${quizScore} stars earned`}>
              {Array.from({ length: quizQs.length }, (_, i) => (
                <span key={i} className={i < quizScore ? 'text-amber-400' : 'text-slate-300'}>★</span>
              ))}
            </p>
            <p className="mx-auto mt-4 w-fit rounded-full bg-amber-100 px-5 py-2 font-display text-2xl font-extrabold text-amber-800">
              +{pointsEarned} points added to your bank!
            </p>
            <p className="mt-3 text-lg font-bold text-slate-600">
              {quizScore === 10 ? 'Perfect score — amazing!' : quizScore >= 7 ? 'Great job! Almost perfect!' : quizScore >= 4 ? 'Good try! Practice makes perfect!' : 'Nice effort! Try the practice again and have another go!'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <BigButton onClick={() => startPhase('quiz')}>Play quiz again</BigButton>
              <BigButton onClick={onHome} color="bg-orange-500 shadow-[0_6px_0_#9a3412] hover:bg-orange-400">Back to lessons</BigButton>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
