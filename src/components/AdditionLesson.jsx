import { useRef, useState } from 'react'
import { makeAdditionQuestions } from '../lib/questions'

const EXAMPLES = [
  { a: 3, b: 2, note: 'Start with 3, add 2 more. Count them all: 1, 2, 3, 4, 5!' },
  { a: 4, b: 5, note: 'Start at 4 and count on: 5, 6, 7, 8, 9. Counting on is fast!' },
  { a: 7, b: 3, note: '7 + 3 makes 10. Friendly numbers that make 10 are easy to spot!' },
]

const PRAISE = ['Great job!', 'You did it!', 'Super work!', 'Brilliant!', 'Way to go!']

function Dots({ count, className }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`h-5 w-5 rounded-full sm:h-6 sm:w-6 ${className}`} />
      ))}
    </span>
  )
}

function ProgressDots({ total, current, doneColor }) {
  return (
    <div className="flex justify-center gap-2" aria-label={`Question ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-3.5 w-3.5 rounded-full ${i < current ? doneColor : i === current ? 'bg-slate-800' : 'bg-slate-300'}`} />
      ))}
    </div>
  )
}

function BigButton({ children, onClick, color = 'bg-orange-500 shadow-[0_6px_0_#9a3412] hover:bg-orange-400', disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-16 w-full rounded-full px-6 font-display text-2xl font-extrabold text-white transition active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-56 ${color}`}
    >
      {children}
    </button>
  )
}

function AnswerForm({ onCheck, disabled, inputId }) {
  const [value, setValue] = useState('')
  return (
    <form
      className="flex flex-col items-center justify-center gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim() === '') return
        onCheck(Number(value))
        setValue('')
      }}
    >
      <label className="sr-only" htmlFor={inputId}>Your answer</label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="?"
        autoFocus
        className="h-16 w-32 rounded-3xl border-4 border-slate-300 bg-white text-center font-display text-4xl font-extrabold text-slate-900 tabular-nums focus:border-orange-400 focus:outline-none disabled:bg-slate-100"
      />
      <BigButton type="submit" disabled={disabled || value.trim() === ''}>Check ✓</BigButton>
    </form>
  )
}

export default function AdditionLesson({ onHome, onAddPoints }) {
  const [phase, setPhase] = useState('learn') // learn | practice | quiz | result
  const [practiceQs] = useState(() => makeAdditionQuestions(5, 12))
  const [quizQs, setQuizQs] = useState(() => makeAdditionQuestions(10, 20))
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [quizScore, setQuizScore] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)
  const pointsAddedRef = useRef(false)

  const questions = phase === 'practice' ? practiceQs : quizQs
  const current = questions[index]
  const [praise, setPraise] = useState(PRAISE[0])

  function startPhase(next) {
    setPhase(next)
    setIndex(0)
    setFeedback(null)
    if (next === 'quiz') {
      setQuizQs(makeAdditionQuestions(10, 20))
      setQuizScore(0)
      pointsAddedRef.current = false
    }
  }

  function handleCheck(value) {
    if (!current || feedback === 'correct') return
    const isCorrect = value === current.answer
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
        className="mt-6 min-h-12 rounded-full bg-white px-5 font-display text-lg font-extrabold text-slate-700 shadow-[0_4px_0_#cbd5e1] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
      >
        ← Back to lessons
      </button>

      <div className="mt-6 text-center">
        <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Addition <span className="text-orange-500">+</span>
        </h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Lesson steps">
          {[['learn', '1. Learn'], ['practice', '2. Practice'], ['quiz', '3. Quiz']].map(([id, label]) => (
            <span
              key={id}
              aria-current={phase === id || (phase === 'result' && id === 'quiz') ? 'step' : undefined}
              className={`rounded-full px-4 py-2 font-display text-lg font-extrabold ${
                phase === id || (phase === 'result' && id === 'quiz')
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-slate-500'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {phase === 'learn' && (
        <section className="animate-pop mt-8" aria-label="Learn addition">
          <div className="rounded-[2rem] border-4 border-white bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
            <h2 className="font-display text-3xl font-extrabold text-slate-900">What is addition?</h2>
            <p className="mt-2 text-xl font-bold text-slate-600">
              Addition means <span className="text-orange-600">putting groups together</span> to find how many there are in all.
            </p>
            <div className="mt-6 grid gap-4">
              {EXAMPLES.map((ex) => (
                <div key={`${ex.a}+${ex.b}`} className="rounded-3xl bg-amber-50 p-5">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Dots count={ex.a} className="bg-orange-400" />
                    <span className="font-display text-3xl font-extrabold text-slate-700">+</span>
                    <Dots count={ex.b} className="bg-teal-400" />
                    <span className="font-display text-3xl font-extrabold text-slate-700">=</span>
                    <span className="font-display text-4xl font-extrabold text-slate-900">{ex.a + ex.b}</span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-extrabold text-slate-800">
                    {ex.a} + {ex.b} = {ex.a + ex.b}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-600">{ex.note}</p>
                </div>
              ))}
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
            <ProgressDots total={questions.length} current={index} doneColor={phase === 'practice' ? 'bg-orange-400' : 'bg-teal-400'} />
            <p className="mt-4 font-display text-lg font-extrabold tracking-wide text-slate-500 uppercase">
              {phase === 'practice' ? `Practice ${index + 1} of ${questions.length}` : `Quiz question ${index + 1} of ${questions.length}`}
            </p>
            <p className="mt-4 font-display text-6xl font-extrabold text-slate-900 tabular-nums sm:text-7xl" aria-live="polite">
              {current.a} + {current.b} = ?
            </p>

            <div className="mt-6 flex justify-center gap-6" aria-hidden="true">
              <Dots count={current.a} className="bg-orange-400" />
              <Dots count={current.b} className="bg-teal-400" />
            </div>

            <div className="mt-8">
              <AnswerForm key={`${phase}-${index}-${feedback === 'wrong' ? 'retry' : 'new'}`} onCheck={handleCheck} disabled={feedback === 'correct'} inputId={`${phase}-answer`} />
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
                    <p>🎉 {praise} {current.a} + {current.b} = {current.answer}</p>
                    <div className="mt-4">
                      <BigButton onClick={handleNextPractice} color="bg-green-500 shadow-[0_6px_0_#15803d] hover:bg-green-400">
                        {index + 1 < practiceQs.length ? 'Next question →' : 'Start the quiz →'}
                      </BigButton>
                    </div>
                  </>
                ) : (
                  <p>Not quite — count the dots and try again! You can do it 💪</p>
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
              <BigButton onClick={() => startPhase('quiz')} color="bg-teal-500 shadow-[0_6px_0_#0f766e] hover:bg-teal-400">Play quiz again</BigButton>
              <BigButton onClick={onHome}>Back to lessons</BigButton>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
