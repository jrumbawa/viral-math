export const RARITIES = {
  common: { label: 'Common', badge: 'bg-green-100 text-green-800', chance: '60%' },
  rare: { label: 'Rare', badge: 'bg-sky-100 text-sky-800', chance: '30%' },
  epic: { label: 'Epic', badge: 'bg-amber-200 text-amber-900', chance: '10%' },
}

export const SQUISHIES = [
  { id: 'lemon', name: 'Sunny Lemon', emoji: '🍋', rarity: 'common' },
  { id: 'strawberry', name: 'Berry Strawberry', emoji: '🍓', rarity: 'common' },
  { id: 'panda', name: 'Pudding Panda', emoji: '🐼', rarity: 'common' },
  { id: 'frog', name: 'Mochi Frog', emoji: '🐸', rarity: 'common' },
  { id: 'bunny', name: 'Peach Bunny', emoji: '🐰', rarity: 'common' },
  { id: 'cat', name: 'Moon Cat', emoji: '🐱', rarity: 'rare' },
  { id: 'unicorn', name: 'Berry Unicorn', emoji: '🦄', rarity: 'rare' },
  { id: 'dragon', name: 'Mint Dragon', emoji: '🐲', rarity: 'rare' },
  { id: 'octopus', name: 'Bubbles Octopus', emoji: '🐙', rarity: 'rare' },
  { id: 'whale', name: 'Golden Star Whale', emoji: '🐳', rarity: 'epic' },
  { id: 'fox', name: 'Crystal Fox', emoji: '🦊', rarity: 'epic' },
  { id: 'axolotl', name: 'Rainbow Axolotl', emoji: '🦎', rarity: 'epic' },
]

/** Squishies offered for direct purchase (100 points each). */
export const DIRECT_BUY_IDS = ['bunny', 'frog', 'cat', 'unicorn', 'whale', 'fox']

export function getSquishy(id) {
  return SQUISHIES.find((s) => s.id === id)
}

/** Mystery box roll: common 60%, rare 30%, epic 10%, then a random squishy of that rarity. */
export function rollMysterySquishy(random = Math.random) {
  const roll = random()
  const rarity = roll < 0.6 ? 'common' : roll < 0.9 ? 'rare' : 'epic'
  const pool = SQUISHIES.filter((s) => s.rarity === rarity)
  return pool[Math.floor(random() * pool.length)]
}
