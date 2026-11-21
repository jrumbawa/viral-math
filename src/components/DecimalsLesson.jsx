import { useRef, useState } from 'react'
import { makeDecimalQuestions } from '../lib/questions'

const PRAISE = ['Great job!', 'You did it!', 'Super work!', 'Brilliant!', 'Way to go!']

function DecimalGrid({ total, shaded }) {
  if (total === 100) {
    return (
      <div className="mx-auto grid max-w-56 grid-cols-10 gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-4 w-full rounded-sm border-2 sm:h-5 ${i < shaded ? 'border-amber-500 bg-amber-400' : 'border-slate-300 bg-white'}`} />
        ))}
      </div>
    )
  }
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-10 flex-1 rounded-lg border-4 sm:h-12 ${i < shaded ? 'border-amber-500 bg-amber-400' : 'border-slate-300 bg-white'}`} />
      ))}
    </div>
  )
}

function ProgressDots({ total, current }) {
  return (
    <div className="flex justify-center gap-2" aria-label={`Question ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-3.5 w-3.5 rounded-full ${i < current ? 'bg-amber-400' : i === current ? 'bg-slate-800' : 'bg-slate-300'}`} />
      ))}
    </div>
  )
}

function BigButton({ children, onClick, color = 'bg-amber-500 shadow-[0_6px_0_#b45309] hover:bg-amber-400', disabled, type = 'button' }) {
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
        inputMode="decimal"
        step="any"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="0.0"
        autoFocus
        className="h-16 w-40 rounded-3xl border-4 border-slate-300 bg-white text-center font-display text-4xl font-extrabold text-slate-900 tabular-nums focus:border-amber-400 focus:outline-none disabled:bg-slate-100"
      />
      <BigButton type="submit" disabled={disabled || value.trim() === ''}>Check ✓</BigButton>
    </form>
  )
}

function questionHint(q) {
  if (q.kind === 'write') return 'Not quite — the first digit after the point is tenths and the second is hundredths. Think about the parts and try again! You can do it 💪'
  if (q.kind === 'compare') return 'Not quite — compare the tenths first, and remember a longer decimal is not always bigger (0.5 = 0.50). Try again! You can do it 💪'
  if (q.kind === 'add') return 'Not quite — line up the decimal points, add the hundredths and tenths, then the ones. Try again! You can do it 💪'
  return 'Not quite — line up the decimal points, subtract the hundredths and tenths, then the ones. Try again! You can do it 💪'
}

function QuestionVisual({ q }) {
  if (q.kind === 'write' && q.total) {
    return (
      <div className="mx-auto max-w-md">
        <DecimalGrid total={q.total} shaded={q.shaded} />
        <p className="mt-3 font-display text-2xl font-extrabold text-slate-600">
          {q.shaded} of {q.total} equal parts are shaded
        </p>
      </div>
    )
  }
  if (q.kind === 'compare') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3" aria-hidden="true">
        <span className="rounded-3xl bg-amber-100 px-6 py-3 font-display text-5xl font-extrabold text-slate-900">{q.x}</span>
        <span className="font-display text-3xl font-extrabold text-slate-500">vs</span>
        <span className="rounded-3xl bg-amber-100 px-6 py-3 font-display text-5xl font-extrabold text-slate-900">{q.y}</span>
      </div>
    )
  }
  if (q.kind === 'add' || q.kind === 'subtract') {
    return (
      <p className="font-display text-xl font-extrabold text-slate-500">Hint: line up the decimal points, column by column!</p>
    )
  }
  return (
    <p className="font-display text-xl font-extrabold text-slate-500">Hint: first place after the point is tenths, second is hundredths!</p>
  )
}

export default function DecimalsLesson({ onHome, onAddPoints }) {
  const [phase, setPhase] = useState('learn') // learn | practice | quiz | result
  const [practiceQs] = useState(() => makeDecimalQuestions(5))
  const [quizQs, setQuizQs] = useState(() => makeDecimalQuestions(10))
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
      setQuizQs(makeDecimalQuestions(10))
      setQuizScore(0)
      pointsAddedRef.current = false
    }
  }

  function handleCheck(value) {
    if (!current || feedback === 'correct') return
    const isCorrect = Number.isFinite(value) && Math.abs(value - current.answer) < 0.001
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
          Decimals <span className="text-amber-600">0.1</span>
        </h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Lesson steps">
          {[['learn', '1. Learn'], ['practice', '2. Practice'], ['quiz', '3. Quiz']].map(([id, label]) => (
            <span
              key={id}
              aria-current={phase === id || (phase === 'result' && id === 'quiz') ? 'step' : undefined}
              className={`rounded-full px-4 py-2 font-display text-lg font-extrabold ${
                phase === id || (phase === 'result' && id === 'quiz')
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-slate-500'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {phase === 'learn' && (
        <section className="animate-pop mt-8" aria-label="Learn decimals">
          <div className="rounded-[2rem] border-4 border-white bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
            <h2 className="font-display text-3xl font-extrabold text-slate-900">What is a decimal?</h2>
            <p className="mt-2 text-xl font-bold text-slate-600">
              A decimal uses a <span className="text-amber-700">decimal point</span> to show parts smaller than one whole. Digits after the point are tenths and hundredths — like slices of a whole split into 10 or 100 equal parts.
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-amber-50 p-5">
                <p className="font-display text-2xl font-extrabold text-slate-800">Tenths and hundredths, and place value: 2.47</p>
                <p className="mt-1 text-lg font-bold text-slate-600">
                  Place value tells you what each digit is worth. In 2.47, the digits shrink by tens as you move right past the point.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center" aria-label="Place value chart for 2.47">
                  {[['Ones', '2', '2 ones'], ['Tenths', '4', '4 tenths = 0.4'], ['Hundredths', '7', '7 hundredths = 0.07']].map(([place, digit, meaning]) => (
                    <div key={place} className="rounded-2xl bg-white p-3">
                      <p className="font-display text-sm font-extrabold tracking-wide text-slate-500 uppercase">{place}</p>
                      <p className="font-display text-4xl font-extrabold text-slate-900">{digit}</p>
                      <p className="text-sm font-bold text-slate-600">{meaning}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4">
                  <div>
                    <DecimalGrid total={10} shaded={3} />
                    <p className="mt-2 font-display text-xl font-extrabold text-slate-800">0.3 — three tenths: 3 of 10 equal parts</p>
                  </div>
                  <div>
                    <DecimalGrid total={100} shaded={37} />
                    <p className="mt-2 text-center font-display text-xl font-extrabold text-slate-800">0.37 — thirty-seven hundredths: 3 tenths and 7 hundredths</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-amber-50 p-5">
                <p className="font-display text-2xl font-extrabold text-slate-800">Comparing decimals: 0.6 is bigger than 0.45</p>
                <p className="mt-1 text-lg font-bold text-slate-600">
                  Comparing decimals starts at the left. Line up the points and compare place by place — a longer decimal is not always bigger!
                </p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-lg font-bold text-slate-700">
                  <li>Ones are the same: 0 and 0.</li>
                  <li>Compare the tenths: 6 tenths is more than 4 tenths.</li>
                  <li>So <strong>0.6 &gt; 0.45</strong>. Trick: 0.6 is the same as 0.60 — add a zero to make the lengths match!</li>
                </ol>
              </div>

              <div className="rounded-3xl bg-amber-50 p-5">
                <p className="font-display text-2xl font-extrabold text-slate-800">Adding and subtracting decimals: 1.4 + 2.3 = 3.7 and 3.8 − 1.5 = 2.3</p>
                <p className="mt-1 text-lg font-bold text-slate-600">The golden rule for adding and subtracting decimals: always line up the decimal points!</p>
                <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-lg font-bold text-slate-700">
                  <li>Add the tenths: 4 + 3 = <strong>7 tenths</strong>, then the ones: 1 + 2 = <strong>3</strong>. So 1.4 + 2.3 = <strong>3.7</strong> ✓</li>
                  <li>Subtract the tenths: 8 − 5 = <strong>3 tenths</strong>, then the ones: 3 − 1 = <strong>2</strong>. So 3.8 − 1.5 = <strong>2.3</strong> ✓</li>
                  <li>Keep the decimal point in the same column in your answer.</li>
                </ol>
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
              {current.prompt}
            </p>

            <div className="mt-6">
              <QuestionVisual q={current} />
            </div>

            <div className="mt-8">
              <AnswerForm key={`${phase}-${index}-${feedback === 'wrong' ? 'retry' : 'new'}`} onCheck={handleCheck} disabled={feedback === 'correct'} inputId={`${phase}-dec-answer`} />
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
                    <p>🎉 {praise} The answer is {current.answerText}</p>
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
