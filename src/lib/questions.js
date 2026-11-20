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
