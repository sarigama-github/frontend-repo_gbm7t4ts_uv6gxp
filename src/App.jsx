import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <Hero />

      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10">
        {!user ? (
          <Auth onAuthed={setUser} />
        ) : (
          <Dashboard user={user} />
        )}
      </div>

      <footer className="mt-16 py-10 text-center text-white/60">
        Built for your trading community · AI + TradingView integrations
      </footer>
    </div>
  )
}

export default App
