import { SQUISHIES } from '../data/squishies.js'

export const POINTS_KEY = 'viral-math-4-kids:points'
export const COLLECTION_KEY = 'viral-math-4-kids:collection'

const validIds = new Set(SQUISHIES.map((s) => s.id))

/** Load persisted points + collection. Any storage error or bad data falls back to a fresh start. */
export function loadPersisted(storage) {
  try {
    const rawPoints = storage.getItem(POINTS_KEY)
    const parsed = rawPoints === null ? 0 : Number.parseInt(rawPoints, 10)
    const points = Number.isFinite(parsed) && parsed > 0 ? parsed : 0

    let collection = []
    const rawCollection = storage.getItem(COLLECTION_KEY)
    if (rawCollection) {
      const parsedCollection = JSON.parse(rawCollection)
      if (Array.isArray(parsedCollection)) {
        collection = parsedCollection.filter((id) => validIds.has(id))
      }
    }
    return { points, collection }
  } catch {
    return { points: 0, collection: [] }
  }
}

let saveOk = true
const saveListeners = new Set()

/** Subscribe to save-status changes (for useSyncExternalStore). */
export function subscribeSaveStatus(listener) {
  saveListeners.add(listener)
  return () => saveListeners.delete(listener)
}

/** Whether the most recent save succeeded. */
export function getSaveStatus() {
  return saveOk
}

function setSaveOk(next) {
  if (saveOk === next) return
  saveOk = next
  saveListeners.forEach((listener) => listener())
}

/** Save points + collection. Returns false (instead of throwing) when storage is unavailable/full. */
export function savePersisted(storage, points, collection) {
  try {
    storage.setItem(POINTS_KEY, String(Math.max(0, Math.floor(points))))
    storage.setItem(COLLECTION_KEY, JSON.stringify(collection))
    setSaveOk(true)
    return true
  } catch {
    setSaveOk(false)
    return false
  }
}
