import { useEffect, useState, useRef } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard({ user }) {
  const [charts, setCharts] = useState([])
  const [title, setTitle] = useState('')
  const [symbol, setSymbol] = useState('BTCUSD')
  const [timeframe, setTimeframe] = useState('1D')
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyses, setAnalyses] = useState([])
  const fileRef = useRef()

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  const fetchCharts = async () => {
    const res = await fetch(`${API_BASE}/charts`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setCharts(await res.json())
  }
  const fetchAnalyses = async () => {
    const res = await fetch(`${API_BASE}/analyses`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setAnalyses(await res.json())
  }

  useEffect(() => {
    fetchCharts(); fetchAnalyses()
  }, [])

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const uploadChart = async (e) => {
    e.preventDefault()
    if (!fileRef.current?.files?.[0]) return
    setUploading(true)
    try {
      const image_base64 = await toBase64(fileRef.current.files[0])
      const res = await fetch(`${API_BASE}/charts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, symbol, timeframe, notes, image_base64 })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setCharts((prev) => [data, ...prev])
      setTitle(''); setNotes('')
    } catch(err) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const analyze = async (chartId) => {
    const res = await fetch(`${API_BASE}/analyze/${chartId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) return alert(data.detail || 'Analysis failed')
    setAnalyses((prev)=>[data, ...prev])
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-6">Welcome, {user.name}</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Upload Chart</h3>
            <form onSubmit={uploadChart} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 rounded bg-white/10 text-white border border-white/10" />
                <input value={symbol} onChange={e=>setSymbol(e.target.value)} placeholder="Symbol" className="px-3 py-2 rounded bg-white/10 text-white border border-white/10" />
                <input value={timeframe} onChange={e=>setTimeframe(e.target.value)} placeholder="Timeframe" className="px-3 py-2 rounded bg-white/10 text-white border border-white/10" />
                <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="col-span-2 px-3 py-2 rounded bg-white/10 text-white border border-white/10" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="block w-full text-white/80" />
              <button disabled={uploading} className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded">
                {uploading ? 'Uploading...' : 'Save chart'}
              </button>
            </form>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">TradingView</h3>
            <div className="rounded-lg overflow-hidden">
              <iframe
                title="TradingView"
                src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(timeframe)}&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&locale=en&enable_publishing=false&hideideas=true`}
                className="w-full h-[380px]"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Your Charts</h3>
            <div className="space-y-4">
              {charts.length === 0 && <p className="text-white/60">No charts yet.</p>}
              {charts.map((c)=> (
                <div key={c.id} className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{c.title} • {c.symbol} • {c.timeframe}</p>
                      {c.notes && <p className="text-white/60 text-sm">{c.notes}</p>}
                    </div>
                    <button onClick={()=>analyze(c.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded">Analyze</button>
                  </div>
                  <img src={c.image_base64} alt={c.title} className="w-full rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">AI Analyses</h3>
            <div className="space-y-4">
              {analyses.length === 0 && <p className="text-white/60">No analyses yet.</p>}
              {analyses.map((a)=> (
                <div key={a.id} className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <p className="text-white/80 text-sm">{new Date(a.created_at).toLocaleString()}</p>
                  <p className="text-white font-medium mt-1">{a.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.signals.map((s,i)=> (
                      <span key={i} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full border border-white/10">{s}</span>
                    ))}
                  </div>
                  <span className="mt-2 inline-block text-xs px-2 py-1 rounded bg-sky-600/20 text-sky-300 border border-sky-700/30">Risk: {a.risk_level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
