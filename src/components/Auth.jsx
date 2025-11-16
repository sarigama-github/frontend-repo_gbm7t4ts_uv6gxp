import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/${mode === 'login' ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { email, password }
            : { name, email, password }
        )
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Auth failed')
      localStorage.setItem('token', data.token)
      onAuthed(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md w-full mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setMode('login')} className={`px-4 py-2 rounded ${mode==='login'?'bg-sky-600 text-white':'bg-white/10 text-white/70'}`}>Login</button>
        <button onClick={() => setMode('signup')} className={`px-4 py-2 rounded ${mode==='signup'?'bg-sky-600 text-white':'bg-white/10 text-white/70'}`}>Sign up</button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm text-white/70 mb-1">Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} required className="w-full px-3 py-2 rounded bg-white/10 text-white outline-none border border-white/10" />
          </div>
        )}
        <div>
          <label className="block text-sm text-white/70 mb-1">Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-white/10 text-white outline-none border border-white/10" />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-white/10 text-white outline-none border border-white/10" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-sky-600 hover:bg-sky-500 transition text-white font-semibold py-2 rounded">
          {loading ? 'Please wait...' : (mode==='login' ? 'Login' : 'Create account')}
        </button>
      </form>
    </div>
  )
}
