import { useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import AdditionLesson from './components/AdditionLesson'

export default function App() {
  const [view, setView] = useState('home') // home | addition
  const [points, setPoints] = useState(0)

  return (
    <div className="min-h-screen bg-yellow-100 font-body text-slate-900">
      <Header points={points} onHome={() => setView('home')} />
      {view === 'home' ? (
        <Home onStartAddition={() => setView('addition')} />
      ) : (
        <AdditionLesson
          onHome={() => setView('home')}
          onAddPoints={(amount) => setPoints((p) => p + amount)}
        />
      )}
      <footer className="pb-8 text-center text-sm font-bold text-slate-500">
        Viral Math 4 Kids — learn, practice, earn stars!
      </footer>
    </div>
  )
}
