import { useState } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import AdditionLesson from './components/AdditionLesson'
import SubtractionLesson from './components/SubtractionLesson'
import MultiplicationLesson from './components/MultiplicationLesson'
import DivisionLesson from './components/DivisionLesson'

export default function App() {
  const [view, setView] = useState('home') // home | addition | subtraction | multiplication | division
  const [points, setPoints] = useState(0)
  const addPoints = (amount) => setPoints((p) => p + amount)

  return (
    <div className="min-h-screen bg-yellow-100 font-body text-slate-900">
      <Header points={points} onHome={() => setView('home')} />
      {view === 'home' && <Home onStartLesson={setView} />}
      {view === 'addition' && <AdditionLesson onHome={() => setView('home')} onAddPoints={addPoints} />}
      {view === 'subtraction' && <SubtractionLesson onHome={() => setView('home')} onAddPoints={addPoints} />}
      {view === 'multiplication' && <MultiplicationLesson onHome={() => setView('home')} onAddPoints={addPoints} />}
      {view === 'division' && <DivisionLesson onHome={() => setView('home')} onAddPoints={addPoints} />}
      <footer className="pb-8 text-center text-sm font-bold text-slate-500">
        Viral Math 4 Kids — learn, practice, earn stars!
      </footer>
    </div>
  )
}
