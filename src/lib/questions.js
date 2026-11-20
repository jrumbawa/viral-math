/** Generate `count` multiplication questions. `twoDigit` of them are a two-digit number (11-19) times a single digit (2-5); the rest are times-table facts (2 to `maxFactor`). */
export function makeMultiplicationQuestions(count, { maxFactor = 9, twoDigit = 0 } = {}) {
  const questions = []
  const seen = new Set()
  let guard = 0
  while (questions.length < Math.min(twoDigit, count) && guard < 500) {
    guard += 1
    const a = randInt(11, 19)
    const b = randInt(2, 5)
    const key = `${a}x${b}`
    if (seen.has(key)) continue
    seen.add(key)
    questions.push({ a, b, answer: a * b })
  }
  guard = 0
  while (questions.length < count && guard < 500) {
    guard += 1
    const a = randInt(2, maxFactor)
    const b = randInt(2, maxFactor)
    const key = `${a}x${b}`
    if (seen.has(key)) continue
    seen.add(key)
    questions.push({ a, b, answer: a * b })
  }
  // Shuffle so two-digit questions are not always first.
  for (let i = questions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[questions[i], questions[j]] = [questions[j], questions[i]]
  }
  return questions
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Generate `count` subtraction questions (a up to `maxA`, answer at least 1), avoiding repeats. */
export function makeSubtractionQuestions(count, maxA = 20) {
  const questions = []
  const seen = new Set()
  let guard = 0
  while (questions.length < count && guard < 500) {
    guard += 1
    const a = randInt(4, maxA)
    const b = randInt(1, a - 1)
    const key = `${a}-${b}`
    if (seen.has(key)) continue
    seen.add(key)
    questions.push({ a, b, answer: a - b })
  }
  return questions
}

/** Generate `count` addition questions with sums up to `maxSum`, avoiding repeats. */
export function makeAdditionQuestions(count, maxSum = 20) {
  const questions = []
  const seen = new Set()
  let guard = 0
  while (questions.length < count && guard < 500) {
    guard += 1
    const a = randInt(1, maxSum - 1)
    const b = randInt(1, maxSum - a)
    const key = `${a}+${b}`
    if (seen.has(key)) continue
    seen.add(key)
    questions.push({ a, b, answer: a + b })
  }
  return questions
}
