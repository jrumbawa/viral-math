import { useEffect, useState, useSyncExternalStore } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import AdditionLesson from './components/AdditionLesson'
import SubtractionLesson from './components/SubtractionLesson'
import MultiplicationLesson from './components/MultiplicationLesson'
import DivisionLesson from './components/DivisionLesson'
import Shop from './components/Shop'
import Collection from './components/Collection'
import { getSaveStatus, loadPersisted, savePersisted, subscribeSaveStatus } from './lib/storage'

export default function App() {
  const [view, setView] = useState('home') // home | addition | subtraction | multiplication | division | shop | collection
  const [initial] = useState(() => loadPersisted(window.localStorage))
  const [points, setPoints] = useState(initial.points)
  const [collection, setCollection] = useState(initial.collection)
  const saveFailed = !useSyncExternalStore(subscribeSaveStatus, getSaveStatus)

  useEffect(() => {
    savePersisted(window.localStorage, points, collection)
  }, [points, collection])

  const addPoints = (amount) => setPoints((p) => p + amount)
  const spendPoints = (amount) => {
    if (points < amount) return false
    setPoints((p) => Math.max(0, p - amount))
    return true
  }
  const addSquishy = (id) => setCollection((c) => [...c, id])
  const goHome = () => setView('home')

  return (
    <div className="min-h-screen bg-yellow-100 font-body text-slate-900">
      <Header points={points} onHome={goHome} />
      {saveFailed && (
        <div role="alert" className="bg-red-100 px-4 py-3 text-center font-display text-lg font-extrabold text-red-800">
          ⚠️ We could not save your points and squishies in this browser — they may disappear when you refresh.
        </div>
      )}
      {view === 'home' && (
        <Home onStartLesson={setView} onOpenShop={() => setView('shop')} onOpenCollection={() => setView('collection')} />
      )}
      {view === 'addition' && <AdditionLesson onHome={goHome} onAddPoints={addPoints} />}
      {view === 'subtraction' && <SubtractionLesson onHome={goHome} onAddPoints={addPoints} />}
      {view === 'multiplication' && <MultiplicationLesson onHome={goHome} onAddPoints={addPoints} />}
      {view === 'division' && <DivisionLesson onHome={goHome} onAddPoints={addPoints} />}
      {view === 'shop' && (
        <Shop
          points={points}
          collection={collection}
          onSpend={spendPoints}
          onAddSquishy={addSquishy}
          onHome={goHome}
          onOpenCollection={() => setView('collection')}
        />
      )}
      {view === 'collection' && <Collection collection={collection} onHome={goHome} onOpenShop={() => setView('shop')} />}
      <footer className="pb-8 text-center text-sm font-bold text-slate-500">
        Viral Math 4 Kids — learn, practice, earn stars!
      </footer>
    </div>
  )
}
