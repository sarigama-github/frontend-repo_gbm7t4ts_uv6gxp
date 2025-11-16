import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#0b1220] to-[#0b1220]">
      <div className="absolute inset-0 opacity-80">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-sky-300 border border-sky-400/30">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
          Live trading analysis platform
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          Holographic Insights for Your Trades
        </h1>
        <p className="mt-4 text-sky-100/80 max-w-2xl mx-auto">
          Upload charts, get AI analysis, and track setups with an embedded TradingView experience.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b1220]" />
    </section>
  )
}
