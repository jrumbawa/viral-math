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

/** Generate `count` division questions with no remainders: pick a divisor and a quotient, then build the dividend from them. */
export function makeDivisionQuestions(count, { divisors = [2, 5, 10], maxQuotient = 10 } = {}) {
  const questions = []
  const seen = new Set()
  let guard = 0
  while (questions.length < count && guard < 500) {
    guard += 1
    const b = divisors[Math.floor(Math.random() * divisors.length)]
    const answer = randInt(2, maxQuotient)
    const a = b * answer
    const key = `${a}/${b}`
    if (seen.has(key)) continue
    seen.add(key)
    questions.push({ a, b, answer })
  }
  return questions
}

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Generate `count` fraction questions as a mix of three kinds taught in the lesson:
 * identify (what fraction is shaded), equivalent (same value, new denominator),
 * and add (adding fractions with the same denominator). Every question's answer
 * is a fraction given as answerNum / answerDen; equivalent values (e.g. 1/2 for
 * 2/4) also count as correct when checked by cross-multiplication.
 */
export function makeFractionQuestions(count) {
  const identify = shuffle([
    [1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4], [1, 6], [2, 6], [3, 6], [5, 6], [3, 8], [5, 8],
  ]).map(([shaded, total]) => ({
    kind: 'identify',
    shaded,
    total,
    answerNum: shaded,
    answerDen: total,
  }))

  const equivalent = shuffle([
    [1, 2, 4], [1, 2, 6], [1, 2, 8], [1, 3, 6], [2, 3, 6], [1, 4, 8], [3, 4, 8], [2, 4, 8],
  ]).map(([givenNum, givenDen, targetDen]) => ({
    kind: 'equivalent',
    givenNum,
    givenDen,
    targetDen,
    answerNum: givenNum * (targetDen / givenDen),
    answerDen: targetDen,
  }))

  const add = shuffle([
    [1, 4, 1, 4], [1, 4, 2, 4], [1, 3, 1, 3], [1, 6, 2, 6], [2, 6, 3, 6],
    [1, 5, 2, 5], [2, 5, 2, 5], [1, 8, 3, 8], [3, 8, 2, 8], [1, 6, 1, 6], [2, 8, 1, 8], [1, 5, 1, 5],
  ]).map(([aNum, aDen, bNum, bDen]) => ({
    kind: 'add',
    aNum,
    aDen,
    bNum,
    bDen,
    answerNum: aNum + bNum,
    answerDen: aDen,
  }))

  const pools = [identify, equivalent, add]
  const questions = []
  let round = 0
  while (questions.length < count) {
    let added = false
    for (const pool of pools) {
      if (questions.length >= count) break
      if (round < pool.length) {
        questions.push(pool[round])
        added = true
      }
    }
    if (!added) break
    round += 1
  }
  return shuffle(questions)
}

/** Format a decimal answer without trailing zeroes (0.50 -> "0.5", 0.25 -> "0.25"). */
function formatDecimal(n) {
  return String(Math.round(n * 100) / 100)
}

/**
 * Generate `count` decimal questions as a mix of the kinds taught in the lesson:
 * write (tenths/hundredths and place value as a decimal), compare (type the
 * bigger decimal), add, and subtract. Every answer is a decimal number;
 * equivalent forms (0.5 for 0.50) count as correct within a small tolerance.
 */
export function makeDecimalQuestions(count) {
  const write = shuffle([
    { prompt: 'Write 3/10 as a decimal', answer: 0.3, shaded: 3, total: 10 },
    { prompt: 'Write 7/10 as a decimal', answer: 0.7, shaded: 7, total: 10 },
    { prompt: 'Write 9/10 as a decimal', answer: 0.9, shaded: 9, total: 10 },
    { prompt: 'Write 25/100 as a decimal', answer: 0.25, shaded: 25, total: 100 },
    { prompt: 'Write 68/100 as a decimal', answer: 0.68, shaded: 68, total: 100 },
    { prompt: 'Write 4 tenths and 5 hundredths as a decimal', answer: 0.45 },
    { prompt: 'Write 8 tenths and 3 hundredths as a decimal', answer: 0.83 },
    { prompt: 'Write 3 ones, 2 tenths and 6 hundredths as a decimal', answer: 3.26 },
    { prompt: 'Write 1 one and 7 tenths as a decimal', answer: 1.7 },
    { prompt: 'Write 6 hundredths as a decimal', answer: 0.06 },
  ]).map((q) => ({ kind: 'write', ...q, answerText: formatDecimal(q.answer) }))

  const compare = shuffle([
    [0.8, 0.65], [0.45, 0.5], [0.3, 0.28], [1.2, 1.15], [0.09, 0.1], [2.4, 2.39], [0.7, 0.07], [3.05, 3.5],
  ]).map(([x, y]) => {
    const answer = Math.max(x, y)
    return {
      kind: 'compare',
      prompt: `Which is bigger: ${formatDecimal(x)} or ${formatDecimal(y)}? Type the bigger number`,
      x,
      y,
      answer,
      answerText: formatDecimal(answer),
    }
  })

  const add = shuffle([
    [1.2, 2.3], [0.4, 0.5], [2.5, 1.3], [0.25, 0.5], [3.6, 1.2], [0.7, 0.15], [1.45, 0.3], [4.2, 2.6],
  ]).map(([a, b]) => {
    const answer = Math.round((a + b) * 100) / 100
    return {
      kind: 'add',
      prompt: `${formatDecimal(a)} + ${formatDecimal(b)} = ?`,
      a,
      b,
      answer,
      answerText: formatDecimal(answer),
    }
  })

  const subtract = shuffle([
    [3.8, 1.5], [0.9, 0.4], [5.6, 2.3], [1.75, 0.5], [4.9, 1.7], [2.35, 1.1], [6.4, 3.2], [0.85, 0.35],
  ]).map(([a, b]) => {
    const answer = Math.round((a - b) * 100) / 100
    return {
      kind: 'subtract',
      prompt: `${formatDecimal(a)} − ${formatDecimal(b)} = ?`,
      a,
      b,
      answer,
      answerText: formatDecimal(answer),
    }
  })

  const pools = [write, compare, add, subtract]
  const questions = []
  let round = 0
  while (questions.length < count) {
    let added = false
    for (const pool of pools) {
      if (questions.length >= count) break
      if (round < pool.length) {
        questions.push(pool[round])
        added = true
      }
    }
    if (!added) break
    round += 1
  }
  return shuffle(questions)
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
