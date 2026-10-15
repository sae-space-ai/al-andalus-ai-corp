import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

/* ═══════════════════════════════════════════════════
   AL ANDALUS AI CORP — FASE 5
   Dashboard, Graphs, Security, Team, Code Compare
   ═══════════════════════════════════════════════════ */

let lang: 'es' | 'en' = 'es';

/* ─────────────── Hooks ─────────────── */

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  return { dark, toggle: () => setDark(d => !d) };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return progress;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(end: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return val;
}

function useLanguage() {
  const [currentLang, setLang] = useState<'es' | 'en'>('es');
  useEffect(() => { lang = currentLang; }, [currentLang]);
  return { lang: currentLang, setLang };
}

/* ─────────────── Animated Section ─────────────── */

function AnimatedSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────── SVG Decorations ─────────────── */

function GeometricPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="andalusian-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M50 30 L70 50 L50 70 L30 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#andalusian-pattern)" />
    </svg>
  );
}

function Star8({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="50,20 57,40 78,40 62,53 68,73 50,62 32,73 38,53 22,40 43,40" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

function FloatingParticles({ dark }: { dark: boolean }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 4 + 2, duration: Math.random() * 10 + 10, delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className={`absolute rounded-full ${dark ? 'bg-green-400/20' : 'bg-green-500/15'}`} style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ─────────────── Scroll Progress & Back to Top ─────────────── */

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1">
      <div className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 transition-all duration-150 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${progress}%` }} />
    </div>
  );
}

function BackToTop({ dark }: { dark: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:-translate-y-1 ${dark ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
    </button>
  );
}

/* ─────────────── Navbar ─────────────── */

function Navbar({ dark, toggleTheme, lang, setLang }: { dark: boolean; toggleTheme: () => void; lang: 'es' | 'en'; setLang: (l: 'es' | 'en') => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);

  const bg = dark ? scrolled ? 'bg-green-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent' : scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent';
  const links = [
    { label: lang === 'es' ? 'Dashboard' : 'Dashboard', href: '#dashboard' },
    { label: lang === 'es' ? 'Gráfico' : 'Graph', href: '#graph' },
    { label: lang === 'es' ? 'Seguridad' : 'Security', href: '#security' },
    { label: lang === 'es' ? 'Equipo' : 'Team', href: '#team' },
    { label: lang === 'es' ? 'Precios' : 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-1 left-0 right-0 z-50 transition-all duration-500 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center shadow-lg shadow-green-700/30 group-hover:scale-110 transition-transform">
              <Star8 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-green-900'}`}>Al Andalus AI</h1>
              <p className="text-[10px] text-green-500 font-semibold tracking-[0.2em] uppercase">Corporation</p>
            </div>
          </a>
          <div className="hidden xl:flex items-center space-x-6">
            {links.map(link => (
              <a key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-green-500 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-500 after:transition-all hover:after:w-full ${dark ? 'text-green-300' : 'text-green-800'}`}>{link.label}</a>
            ))}
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${dark ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                {lang === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${dark ? 'bg-green-800 text-yellow-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                {dark ? '☀️' : '🌙'}
              </button>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-green-700/30 hover:shadow-xl hover:-translate-y-0.5">
              {lang === 'es' ? 'Comenzar' : 'Get Started'}
            </button>
          </div>
          <div className="flex xl:hidden items-center space-x-3">
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className={`px-3 py-1 rounded-full text-xs font-bold ${dark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-full ${dark ? 'bg-green-800 text-yellow-300' : 'bg-green-100 text-green-700'}`}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={dark ? 'text-white' : 'text-green-800'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className={`xl:hidden backdrop-blur-md border-t ${dark ? 'bg-green-950/95 border-green-800' : 'bg-white/95 border-green-100'}`}>
          <div className="px-4 py-4 space-y-3">
            {links.map(link => (
              <a key={link.href} href={link.href} className={`block font-medium py-2 ${dark ? 'text-green-300' : 'text-green-800'}`} onClick={() => setMobileOpen(false)}>{link.label}</a>
            ))}
            <button className="w-full bg-green-700 text-white px-5 py-2.5 rounded-full font-semibold">{lang === 'es' ? 'Comenzar' : 'Get Started'}</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── Hero ─────────────── */

function HeroSection({ dark }: { dark: boolean }) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'npx al-andalus-ai@latest setup';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) { setTypedText(fullText.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden ${dark ? 'bg-gradient-to-br from-green-950 via-green-900 to-green-950' : 'bg-gradient-to-br from-green-50 via-white to-emerald-50'}`}>
      <GeometricPattern />
      <FloatingParticles dark={dark} />
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-emerald-300/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${dark ? 'bg-green-800/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-800'}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {lang === 'es' ? 'Ingeniería Inversa con IA' : 'Reverse Engineering with AI'}
            </div>
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Descubre cómo' : 'Find out how'}
              <span className="block bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent">
                {lang === 'es' ? 'funciona el software' : 'software works'}
              </span>
            </h1>
            <p className={`text-xl max-w-lg leading-relaxed ${dark ? 'text-green-300/80' : 'text-green-700/70'}`}>
              {lang === 'es' ? 'Pregunta a tu agente de IA sobre una app, un juego o un sitio web. Al Andalus AI le da las herramientas para inspeccionar el código detrás de la respuesta.' : 'Ask your coding agent about an app, a game or a website. Al Andalus AI gives it the tools to inspect the code behind the answer.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-green-700/30 hover:shadow-2xl hover:-translate-y-1">
                {lang === 'es' ? 'Comenzar ahora' : 'Get started'}
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
              </button>
              <button className={`border-2 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-0.5 ${dark ? 'border-green-500 text-green-400 hover:bg-green-900/50' : 'border-green-700 text-green-700 hover:bg-green-50'}`}>
                {lang === 'es' ? 'Ver ejemplos' : 'See examples'} ↓
              </button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-sm ${dark ? 'bg-green-900/60 border-green-700/50' : 'bg-white/80 border-green-100'}`}>
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-xl shadow-green-700/40 rotate-12">
                <Star8 className="w-12 h-12 text-white -rotate-12" />
              </div>
              <div className="space-y-5">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className={`ml-2 font-mono text-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>al-andalus-ai</span>
                </div>
                <div className="bg-green-950 rounded-xl p-5 font-mono text-sm border border-green-800/50">
                  <p className="text-green-400">$ <span className="text-white">{typedText}<span className="animate-blink">▌</span></span></p>
                  <p className="text-green-400 mt-3">✓ {lang === 'es' ? 'Módulos detectados' : 'Modules detected'}: <span className="text-emerald-300">47</span></p>
                  <p className="text-green-400 mt-1">✓ {lang === 'es' ? 'Dependencias mapeadas' : 'Dependencies mapped'}: <span className="text-emerald-300">128</span></p>
                  <p className="text-green-400 mt-1">✓ {lang === 'es' ? 'Rutas encontradas' : 'Routes found'}: <span className="text-emerald-300">23</span></p>
                  <p className="text-yellow-300 mt-3 animate-pulse">⟳ {lang === 'es' ? 'Generando informe...' : 'Generating report...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Dashboard with Charts (NEW) ─────────────── */

function DashboardSection({ dark }: { dark: boolean }) {
  const [activeChart, setActiveChart] = useState<'area' | 'bar' | 'line' | 'pie' | 'radar'>('area');
  const { ref, inView } = useInView(0.2);

  const areaData = [
    { name: 'Ene', analisis: 400, reconstrucciones: 240 },
    { name: 'Feb', analisis: 520, reconstrucciones: 310 },
    { name: 'Mar', analisis: 680, reconstrucciones: 420 },
    { name: 'Abr', analisis: 810, reconstrucciones: 580 },
    { name: 'May', analisis: 950, reconstrucciones: 720 },
    { name: 'Jun', analisis: 1180, reconstrucciones: 890 },
    { name: 'Jul', analisis: 1420, reconstrucciones: 1050 },
  ];

  const barData = [
    { name: 'JS', valor: 420 },
    { name: 'TS', valor: 380 },
    { name: 'Py', valor: 310 },
    { name: 'C++', valor: 240 },
    { name: 'Rust', valor: 180 },
    { name: 'Go', valor: 150 },
  ];

  const pieData = [
    { name: 'Web Apps', value: 35 },
    { name: 'Mobile', value: 25 },
    { name: 'Desktop', value: 20 },
    { name: 'APIs', value: 15 },
    { name: 'Games', value: 5 },
  ];

  const radarData = [
    { subject: 'Velocidad', A: 95, fullMark: 100 },
    { subject: 'Precisión', A: 99, fullMark: 100 },
    { subject: 'Cobertura', A: 88, fullMark: 100 },
    { subject: 'Seguridad', A: 96, fullMark: 100 },
    { subject: 'Escalabilidad', A: 92, fullMark: 100 },
    { subject: 'UX', A: 90, fullMark: 100 },
  ];

  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  return (
    <section id="dashboard" ref={ref} className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Dashboard en Vivo' : 'Live Dashboard'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Métricas reales de análisis en tiempo real' : 'Real-time analysis metrics'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          {/* Chart type selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'area' as const, label: lang === 'es' ? '📈 Crecimiento' : '📈 Growth' },
              { id: 'bar' as const, label: lang === 'es' ? '📊 Lenguajes' : '📊 Languages' },
              { id: 'pie' as const, label: lang === 'es' ? '🥧 Distribución' : '🥧 Distribution' },
              { id: 'radar' as const, label: lang === 'es' ? '🎯 Rendimiento' : '🎯 Performance' },
            ].map(chart => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeChart === chart.id
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-700/30'
                  : dark ? 'bg-green-800/50 text-green-300 hover:bg-green-800' : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {chart.label}
              </button>
            ))}
          </div>

          {/* Chart container */}
          <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'area' ? (
                  <AreaChart data={inView ? areaData : []}>
                    <defs>
                      <linearGradient id="colorAnalisis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReconstrucciones" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#166534' : '#dcfce7'} />
                    <XAxis dataKey="name" stroke={dark ? '#4ade80' : '#166534'} />
                    <YAxis stroke={dark ? '#4ade80' : '#166534'} />
                    <Tooltip contentStyle={{ backgroundColor: dark ? '#14532d' : '#fff', border: '1px solid #16a34a', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="analisis" stroke="#16a34a" fillOpacity={1} fill="url(#colorAnalisis)" />
                    <Area type="monotone" dataKey="reconstrucciones" stroke="#4ade80" fillOpacity={1} fill="url(#colorReconstrucciones)" />
                  </AreaChart>
                ) : activeChart === 'bar' ? (
                  <BarChart data={inView ? barData : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#166534' : '#dcfce7'} />
                    <XAxis dataKey="name" stroke={dark ? '#4ade80' : '#166534'} />
                    <YAxis stroke={dark ? '#4ade80' : '#166534'} />
                    <Tooltip contentStyle={{ backgroundColor: dark ? '#14532d' : '#fff', border: '1px solid #16a34a', borderRadius: '12px' }} />
                    <Bar dataKey="valor" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                ) : activeChart === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={inView ? pieData : []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#16a34a"
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: dark ? '#14532d' : '#fff', border: '1px solid #16a34a', borderRadius: '12px' }} />
                  </PieChart>
                ) : (
                  <RadarChart data={inView ? radarData : []}>
                    <PolarGrid stroke={dark ? '#166534' : '#dcfce7'} />
                    <PolarAngleAxis dataKey="subject" stroke={dark ? '#4ade80' : '#166534'} />
                    <PolarRadiusAxis stroke={dark ? '#4ade80' : '#166534'} />
                    <Radar name="Al Andalus AI" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: lang === 'es' ? 'Análisis hoy' : 'Today', value: '1,247', change: '+12%', up: true },
                { label: lang === 'es' ? 'Precisión' : 'Accuracy', value: '99.2%', change: '+0.3%', up: true },
                { label: lang === 'es' ? 'Tiempo medio' : 'Avg. Time', value: '2.4s', change: '-18%', up: true },
                { label: lang === 'es' ? 'Usuarios activos' : 'Active Users', value: '847', change: '+8%', up: true },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl p-4 ${dark ? 'bg-green-800/30' : 'bg-green-50'}`}>
                  <p className={`text-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-black ${dark ? 'text-white' : 'text-green-900'}`}>{stat.value}</p>
                  <p className={`text-xs font-semibold ${stat.up ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Dependency Graph Visualizer (NEW) ─────────────── */

function DependencyGraph({ dark }: { dark: boolean }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = [
    { id: 'main', label: 'main.exe', x: 300, y: 50, type: 'entry', size: 40 },
    { id: 'auth', label: 'auth.dll', x: 150, y: 150, type: 'core', size: 35 },
    { id: 'ui', label: 'ui.dll', x: 450, y: 150, type: 'core', size: 35 },
    { id: 'crypto', label: 'crypto.dll', x: 80, y: 270, type: 'lib', size: 28 },
    { id: 'network', label: 'net.dll', x: 220, y: 270, type: 'lib', size: 28 },
    { id: 'render', label: 'render.dll', x: 380, y: 270, type: 'lib', size: 28 },
    { id: 'data', label: 'data.dll', x: 520, y: 270, type: 'lib', size: 28 },
    { id: 'config', label: 'config.json', x: 300, y: 370, type: 'data', size: 24 },
  ];

  const edges = [
    { from: 'main', to: 'auth' },
    { from: 'main', to: 'ui' },
    { from: 'auth', to: 'crypto' },
    { from: 'auth', to: 'network' },
    { from: 'ui', to: 'render' },
    { from: 'ui', to: 'data' },
    { from: 'crypto', to: 'config' },
    { from: 'network', to: 'config' },
    { from: 'data', to: 'config' },
  ];

  const getNode = (id: string) => nodes.find(n => n.id === id)!;
  const getColor = (type: string) => {
    switch (type) {
      case 'entry': return '#fbbf24';
      case 'core': return '#16a34a';
      case 'lib': return '#4ade80';
      case 'data': return '#86efac';
      default: return '#16a34a';
    }
  };

  return (
    <section id="graph" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Visualizador de Dependencias' : 'Dependency Visualizer'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Explora cómo se conectan los módulos de un programa analizado' : 'Explore how modules connect in an analyzed program'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <svg viewBox="0 0 600 420" className="w-full h-auto">
              {/* Edges */}
              {edges.map((edge, i) => {
                const from = getNode(edge.from);
                const to = getNode(edge.to);
                const isHighlighted = selectedNode === edge.from || selectedNode === edge.to;
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? '#fbbf24' : (dark ? '#4ade80' : '#16a34a')}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    opacity={isHighlighted ? 1 : 0.4}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const isSelected = selectedNode === node.id;
                return (
                  <g
                    key={node.id}
                    className="graph-node"
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  >
                    {/* Glow */}
                    {isSelected && (
                      <circle cx={node.x} cy={node.y} r={node.size + 8} fill={getColor(node.type)} opacity={0.3} className="animate-pulse-dot" />
                    )}
                    {/* Main circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size}
                      fill={getColor(node.type)}
                      stroke={isSelected ? '#fff' : 'transparent'}
                      strokeWidth={3}
                      className="transition-all duration-300"
                    />
                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      className="text-xs font-bold pointer-events-none"
                      fill={node.type === 'entry' ? '#000' : '#fff'}
                      style={{ fontSize: '10px' }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {[
                { type: 'entry', label: lang === 'es' ? 'Punto de entrada' : 'Entry point' },
                { type: 'core', label: lang === 'es' ? 'Módulo core' : 'Core module' },
                { type: 'lib', label: lang === 'es' ? 'Biblioteca' : 'Library' },
                { type: 'data', label: lang === 'es' ? 'Datos' : 'Data' },
              ].map(item => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor(item.type) }}></div>
                  <span className={`text-xs ${dark ? 'text-green-300' : 'text-green-700'}`}>{item.label}</span>
                </div>
              ))}
            </div>

            {selectedNode && (
              <div className={`mt-6 rounded-xl p-4 animate-scale-in ${dark ? 'bg-green-800/50 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                <p className={`font-bold ${dark ? 'text-white' : 'text-green-900'}`}>
                  {lang === 'es' ? 'Módulo seleccionado' : 'Selected module'}: {getNode(selectedNode).label}
                </p>
                <p className={`text-sm mt-1 ${dark ? 'text-green-400' : 'text-green-700'}`}>
                  {lang === 'es' ? `${edges.filter(e => e.from === selectedNode).length} dependencias salientes, ${edges.filter(e => e.to === selectedNode).length} entrantes` : `${edges.filter(e => e.from === selectedNode).length} outgoing, ${edges.filter(e => e.to === selectedNode).length} incoming dependencies`}
                </p>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Security Section (NEW) ─────────────── */

function SecuritySection({ dark }: { dark: boolean }) {
  const features = [
    { icon: '🔒', title: lang === 'es' ? 'Cifrado E2E' : 'E2E Encryption', desc: lang === 'es' ? 'Todos los datos se cifran con AES-256 en tránsito y en reposo.' : 'All data encrypted with AES-256 in transit and at rest.' },
    { icon: '🛡️', title: lang === 'es' ? 'Zero Trust' : 'Zero Trust', desc: lang === 'es' ? 'Arquitectura de seguridad zero-trust con verificación continua.' : 'Zero-trust security architecture with continuous verification.' },
    { icon: '🔑', title: lang === 'es' ? 'SOC 2 Type II' : 'SOC 2 Type II', desc: lang === 'es' ? 'Certificación SOC 2 Type II y cumplimiento GDPR.' : 'SOC 2 Type II certified and GDPR compliant.' },
    { icon: '🌐', title: lang === 'es' ? 'On-Premise' : 'On-Premise', desc: lang === 'es' ? 'Opción de despliegue on-premise para máximo control.' : 'On-premise deployment option for maximum control.' },
    { icon: '📊', title: lang === 'es' ? 'Auditorías' : 'Audits', desc: lang === 'es' ? 'Logs detallados y auditorías de seguridad automatizadas.' : 'Detailed logs and automated security audits.' },
    { icon: '🔐', title: lang === 'es' ? 'SSO & MFA' : 'SSO & MFA', desc: lang === 'es' ? 'Autenticación SSO y MFA obligatoria para todos los usuarios.' : 'SSO authentication and mandatory MFA for all users.' },
  ];

  return (
    <section id="security" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl mb-6 shadow-xl shadow-green-700/30">
              <span className="text-4xl">🛡️</span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Seguridad de Nivel Enterprise' : 'Enterprise-Grade Security'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Tu código y datos están protegidos con los más altos estándares' : 'Your code and data are protected with the highest standards'}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className={`group rounded-2xl p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-gradient-to-br from-white to-green-50 border-green-100 hover:border-green-400'}`}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-green-900'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Code Compare (NEW) ─────────────── */

function CodeCompareSection({ dark }: { dark: boolean }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleMove]);

  const originalCode = `// Original obfuscated code
function _(a,b){var c=a.length;
for(var i=0;i<c;i++){
a[i]=a[i]^b[i%b.length];
}return a;}`;

  const reconstructedCode = `// Reconstructed by Al Andalus AI
function xorDecrypt(data, key) {
  const length = data.length;
  for (let i = 0; i < length; i++) {
    data[i] = data[i] ^ key[i % key.length];
  }
  return data;
}

// Usage example:
const decrypted = xorDecrypt(
  encryptedBuffer,
  Buffer.from('secret-key')
);`;

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'De Ofuscado a Legible' : 'From Obfuscated to Readable'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Al Andalus AI reconstruye código ofuscado automáticamente' : 'Al Andalus AI automatically reconstructs obfuscated code'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div ref={containerRef} className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${dark ? 'border-green-700' : 'border-green-200'} h-[450px] cursor-ew-resize select-none`} onMouseDown={() => setIsDragging(true)} onTouchStart={() => setIsDragging(true)}>
            {/* Original (left) */}
            <div className="absolute inset-0 bg-gray-900 flex">
              <div className="w-full p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-400 text-xs ml-2">original.js</span>
                </div>
                <pre className="text-gray-400 whitespace-pre-wrap">{originalCode}</pre>
              </div>
            </div>
            {/* Reconstructed (right) */}
            <div className="absolute inset-0 bg-green-950 flex" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
              <div className="w-full p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-400 text-xs ml-2">reconstructed.ts</span>
                </div>
                <pre className="text-green-300 whitespace-pre-wrap">{reconstructedCode}</pre>
              </div>
            </div>
            {/* Slider */}
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{ left: `${position}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">{lang === 'es' ? 'Original' : 'Original'}</div>
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">{lang === 'es' ? 'Reconstruido' : 'Reconstructed'}</div>
          </div>
          <p className={`text-center mt-4 text-sm ${dark ? 'text-green-500' : 'text-green-600'}`}>
            ← {lang === 'es' ? 'Arrastra para comparar' : 'Drag to compare'} →
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Team Section (NEW) ─────────────── */

function TeamSection({ dark }: { dark: boolean }) {
  const team = [
    { name: 'María López', role: lang === 'es' ? 'CEO & Fundadora' : 'CEO & Founder', avatar: '👩‍💼', desc: lang === 'es' ? 'Ex-Google, experta en IA' : 'Ex-Google, AI expert' },
    { name: 'Ahmed Benali', role: lang === 'es' ? 'CTO' : 'CTO', avatar: '👨‍💻', desc: lang === 'es' ? 'PhD en Seguridad Informática' : 'PhD in Computer Security' },
    { name: 'Carlos Ruiz', role: lang === 'es' ? 'Lead Engineer' : 'Lead Engineer', avatar: '🧑‍🔬', desc: lang === 'es' ? '15 años en reverse engineering' : '15 years in reverse engineering' },
    { name: 'Lucía Martín', role: lang === 'es' ? 'Head of Product' : 'Head of Product', avatar: '👩‍🎨', desc: lang === 'es' ? 'Ex-Microsoft, UX specialist' : 'Ex-Microsoft, UX specialist' },
    { name: 'Javier Torres', role: lang === 'es' ? 'Security Lead' : 'Security Lead', avatar: '🧑‍💻', desc: lang === 'es' ? 'Ex-NSA, cryptography expert' : 'Ex-NSA, cryptography expert' },
    { name: 'Ana García', role: lang === 'es' ? 'ML Engineer' : 'ML Engineer', avatar: '👩‍🔬', desc: lang === 'es' ? 'PhD en Deep Learning' : 'PhD in Deep Learning' },
  ];

  return (
    <section id="team" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Nuestro Equipo' : 'Our Team'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Expertos apasionados por la ingeniería inversa y la IA' : 'Experts passionate about reverse engineering and AI'}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className={`team-card group rounded-2xl p-6 border text-center ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-gradient-to-br from-white to-green-50 border-green-100 hover:border-green-400 hover:shadow-xl'}`}>
                <div className="team-avatar w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-5xl shadow-lg">
                  {member.avatar}
                </div>
                <h3 className={`text-xl font-bold mb-1 ${dark ? 'text-white' : 'text-green-900'}`}>{member.name}</h3>
                <p className={`text-sm font-semibold mb-2 ${dark ? 'text-green-400' : 'text-green-600'}`}>{member.role}</p>
                <p className={`text-xs ${dark ? 'text-green-500/70' : 'text-green-700/60'}`}>{member.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Prompt Builder (NEW) ─────────────── */

function PromptBuilder({ dark }: { dark: boolean }) {
  const [target, setTarget] = useState('web-app');
  const [goal, setGoal] = useState('understand');
  const [depth, setDepth] = useState('deep');
  const [output, setOutput] = useState('');

  const generatePrompt = () => {
    const targets: Record<string, string> = {
      'web-app': lang === 'es' ? 'esta aplicación web' : 'this web application',
      'mobile-app': lang === 'es' ? 'esta app móvil' : 'this mobile app',
      'desktop-app': lang === 'es' ? 'esta aplicación de escritorio' : 'this desktop application',
      'game': lang === 'es' ? 'este juego' : 'this game',
      'binary': lang === 'es' ? 'este binario nativo' : 'this native binary',
    };
    const goals: Record<string, string> = {
      'understand': lang === 'es' ? 'entender cómo funciona' : 'understand how it works',
      'rebuild': lang === 'es' ? 'reconstruir su funcionalidad' : 'rebuild its functionality',
      'find-vuln': lang === 'es' ? 'encontrar vulnerabilidades' : 'find vulnerabilities',
      'document': lang === 'es' ? 'documentar su código' : 'document its code',
    };
    const depths: Record<string, string> = {
      'quick': lang === 'es' ? 'análisis rápido' : 'quick analysis',
      'deep': lang === 'es' ? 'análisis profundo' : 'deep analysis',
      'complete': lang === 'es' ? 'análisis completo con reconstrucción' : 'complete analysis with reconstruction',
    };

    const prompt = lang === 'es'
      ? `Usa Al Andalus AI para inspeccionar ${targets[target]}. Quiero ${goals[goal]}. Realiza un ${depths[depth]} y muéstrame el código fuente, las dependencias y las llamadas críticas.`
      : `Use Al Andalus AI to inspect ${targets[target]}. I want to ${goals[goal]}. Perform a ${depths[depth]} and show me the source code, dependencies, and critical calls.`;

    setOutput(prompt);
  };

  useEffect(() => { generatePrompt(); }, [target, goal, depth]);

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Generador de Prompts' : 'Prompt Builder'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Crea el prompt perfecto para tu agente de IA' : 'Create the perfect prompt for your AI agent'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className={`block text-sm font-bold mb-2 ${dark ? 'text-green-300' : 'text-green-800'}`}>
                  {lang === 'es' ? '🎯 Objetivo' : '🎯 Target'}
                </label>
                <select value={target} onChange={e => setTarget(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${dark ? 'bg-green-800 border-green-700 text-white' : 'bg-white border-green-200 text-green-900'}`}>
                  <option value="web-app">{lang === 'es' ? 'App Web' : 'Web App'}</option>
                  <option value="mobile-app">{lang === 'es' ? 'App Móvil' : 'Mobile App'}</option>
                  <option value="desktop-app">{lang === 'es' ? 'App Escritorio' : 'Desktop App'}</option>
                  <option value="game">{lang === 'es' ? 'Juego' : 'Game'}</option>
                  <option value="binary">{lang === 'es' ? 'Binario' : 'Binary'}</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${dark ? 'text-green-300' : 'text-green-800'}`}>
                  {lang === 'es' ? '🎯 Meta' : '🎯 Goal'}
                </label>
                <select value={goal} onChange={e => setGoal(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${dark ? 'bg-green-800 border-green-700 text-white' : 'bg-white border-green-200 text-green-900'}`}>
                  <option value="understand">{lang === 'es' ? 'Entender' : 'Understand'}</option>
                  <option value="rebuild">{lang === 'es' ? 'Reconstruir' : 'Rebuild'}</option>
                  <option value="find-vuln">{lang === 'es' ? 'Encontrar vulnerabilidades' : 'Find vulnerabilities'}</option>
                  <option value="document">{lang === 'es' ? 'Documentar' : 'Document'}</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-bold mb-2 ${dark ? 'text-green-300' : 'text-green-800'}`}>
                  {lang === 'es' ? '🔍 Profundidad' : '🔍 Depth'}
                </label>
                <select value={depth} onChange={e => setDepth(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${dark ? 'bg-green-800 border-green-700 text-white' : 'bg-white border-green-200 text-green-900'}`}>
                  <option value="quick">{lang === 'es' ? 'Rápido' : 'Quick'}</option>
                  <option value="deep">{lang === 'es' ? 'Profundo' : 'Deep'}</option>
                  <option value="complete">{lang === 'es' ? 'Completo' : 'Complete'}</option>
                </select>
              </div>
            </div>

            <div className="bg-green-950 rounded-xl p-6 font-mono text-sm border border-green-800/50">
              <p className="text-green-400 mb-2 text-xs">{lang === 'es' ? 'Prompt generado:' : 'Generated prompt:'}</p>
              <p className="text-white">{output}</p>
            </div>

            <button onClick={() => { navigator.clipboard.writeText(output); }} className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-full font-bold transition-all shadow-lg hover:-translate-y-0.5">
              📋 {lang === 'es' ? 'Copiar Prompt' : 'Copy Prompt'}
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Pricing ─────────────── */

function PricingSection({ dark }: { dark: boolean }) {
  const [annual, setAnnual] = useState(true);
  const plans = [
    { name: lang === 'es' ? 'Explorador' : 'Explorer', price: 0, features: lang === 'es' ? ['5 análisis/mes', 'Soporte email', 'Guías básicas'] : ['5 analyses/month', 'Email support', 'Basic guides'], popular: false },
    { name: lang === 'es' ? 'Profesional' : 'Professional', price: annual ? 29 : 39, features: lang === 'es' ? ['Análisis ilimitados', 'Soporte 24/7', 'API access', 'CI/CD'] : ['Unlimited analyses', '24/7 support', 'API access', 'CI/CD'], popular: true },
    { name: 'Enterprise', price: annual ? 99 : 129, features: lang === 'es' ? ['Todo de Pro', 'On-premise', 'SLA', 'Manager dedicado'] : ['Everything in Pro', 'On-premise', 'SLA', 'Dedicated manager'], popular: false },
  ];

  return (
    <section id="pricing" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{lang === 'es' ? 'Planes y Precios' : 'Plans & Pricing'}</h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className={`text-sm font-medium ${!annual ? (dark ? 'text-white' : 'text-green-900') : (dark ? 'text-green-500' : 'text-green-600')}`}>{lang === 'es' ? 'Mensual' : 'Monthly'}</span>
              <button onClick={() => setAnnual(!annual)} className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-green-600' : dark ? 'bg-green-800' : 'bg-green-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${annual ? 'left-8' : 'left-1'}`} />
              </button>
              <span className={`text-sm font-medium ${annual ? (dark ? 'text-white' : 'text-green-900') : (dark ? 'text-green-500' : 'text-green-600')}`}>{lang === 'es' ? 'Anual' : 'Annual'} <span className="text-green-500 font-bold">(-25%)</span></span>
            </div>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className={`relative rounded-3xl p-8 border-2 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'bg-gradient-to-b from-green-600 to-green-800 border-green-500 shadow-2xl shadow-green-700/30 scale-[1.02]' : dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-white border-green-100 hover:border-green-400 hover:shadow-xl'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">⭐ {lang === 'es' ? 'MÁS POPULAR' : 'MOST POPULAR'}</div>}
                <h3 className={`text-2xl font-black mb-2 ${plan.popular ? 'text-white' : dark ? 'text-white' : 'text-green-900'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : dark ? 'text-white' : 'text-green-900'}`}>${plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-green-200' : dark ? 'text-green-400' : 'text-green-600'}`}>/{lang === 'es' ? 'mes' : 'mo'}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3">
                      <svg className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span className={`text-sm ${plan.popular ? 'text-green-100' : dark ? 'text-green-300' : 'text-green-700'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3.5 rounded-full font-bold transition-all hover:-translate-y-0.5 ${plan.popular ? 'bg-white text-green-700 hover:bg-green-50 shadow-lg' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg'}`}>
                  {plan.price === 0 ? (lang === 'es' ? 'Comenzar Gratis' : 'Start Free') : (lang === 'es' ? 'Elegir Plan' : 'Choose Plan')}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ ─────────────── */

function FAQSection({ dark }: { dark: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = lang === 'es' ? [
    { q: '¿Qué es Al Andalus AI?', a: 'Es una herramienta de ingeniería inversa impulsada por IA que permite a tu agente de codificación inspeccionar, entender y reconstruir cualquier software.' },
    { q: '¿Necesito experiencia?', a: 'No. Solo necesitas un agente de codificación y hacer preguntas en lenguaje natural.' },
    { q: '¿Qué lenguajes soporta?', a: 'Binarios nativos (x64, ARM), JavaScript/TypeScript, Electron, Android, Python, C, C++, Rust y más.' },
    { q: '¿Es legal?', a: 'Sí, siempre que respetes los términos de servicio y las leyes aplicables.' },
    { q: '¿Puedo usarlo en mi empresa?', a: 'Sí. Ofrecemos planes Enterprise con despliegue on-premise y soporte dedicado.' },
  ] : [
    { q: 'What is Al Andalus AI?', a: 'It\'s an AI-powered reverse engineering tool that allows your coding agent to inspect, understand and rebuild any software.' },
    { q: 'Do I need experience?', a: 'No. You just need a coding agent and ask questions in natural language.' },
    { q: 'What languages does it support?', a: 'Native binaries (x64, ARM), JavaScript/TypeScript, Electron, Android, Python, C, C++, Rust and more.' },
    { q: 'Is it legal?', a: 'Yes, as long as you respect the terms of service and applicable laws.' },
    { q: 'Can I use it in my company?', a: 'Yes. We offer Enterprise plans with on-premise deployment and dedicated support.' },
  ];

  return (
    <section id="faq" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>FAQ</h2>
          </div>
        </AnimatedSection>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === i ? dark ? 'bg-green-900/50 border-green-600 shadow-lg' : 'bg-white border-green-400 shadow-lg' : dark ? 'bg-green-900/30 border-green-800' : 'bg-white border-green-100'}`}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                  <span className={`font-bold text-lg pr-4 ${dark ? 'text-white' : 'text-green-900'}`}>{faq.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''} ${dark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`transition-all duration-300 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <p className={`px-6 pb-6 leading-relaxed ${dark ? 'text-green-300/80' : 'text-green-700/70'}`}>{faq.a}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Newsletter ─────────────── */

function NewsletterSection({ dark }: { dark: boolean }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <FloatingParticles dark={true} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <AnimatedSection>
          <Star8 className="w-16 h-16 text-green-300/50 mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">{lang === 'es' ? 'Únete a la revolución' : 'Join the revolution'}</h2>
          <p className="text-xl text-green-200/80 mb-8">{lang === 'es' ? 'Recibe las últimas novedades directamente en tu bandeja' : 'Get the latest news directly in your inbox'}</p>
          {!subscribed ? (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={lang === 'es' ? 'tu@email.com' : 'your@email.com'} required className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white backdrop-blur-sm" />
              <button type="submit" className="bg-white text-green-800 px-8 py-3.5 rounded-full font-bold hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5">{lang === 'es' ? 'Suscribirme' : 'Subscribe'}</button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block animate-scale-in">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-white font-bold text-lg">{lang === 'es' ? '¡Bienvenido!' : 'Welcome!'}</p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer({ dark }: { dark: boolean }) {
  return (
    <footer className={`py-16 relative overflow-hidden ${dark ? 'bg-green-950 border-t border-green-800' : 'bg-green-900'}`}>
      <div className="absolute inset-0 opacity-5"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Star8 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Al Andalus AI Corp</h3>
                <p className="text-green-400 text-xs tracking-[0.2em] uppercase">{lang === 'es' ? 'Inteligencia de Ingeniería Inversa' : 'Reverse Engineering Intelligence'}</p>
              </div>
            </div>
            <p className="text-green-300/60 max-w-sm mt-4 leading-relaxed">
              {lang === 'es' ? 'Herramientas de ingeniería inversa impulsadas por IA para desarrolladores.' : 'AI-powered reverse engineering tools for developers.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">{lang === 'es' ? 'Recursos' : 'Resources'}</h4>
            <ul className="space-y-2">
              {(lang === 'es' ? ['Documentación', 'Guías', 'Blog', 'Precios'] : ['Documentation', 'Guides', 'Blog', 'Pricing']).map(l => (
                <li key={l}><a href="#" className="text-green-300/60 hover:text-white transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">{lang === 'es' ? 'Comunidad' : 'Community'}</h4>
            <ul className="space-y-2">
              {['Discord', 'GitHub', 'FAQ', lang === 'es' ? 'Contacto' : 'Contact'].map(l => (
                <li key={l}><a href="#" className="text-green-300/60 hover:text-white transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-400/50 text-sm">© 2026 Al Andalus AI Corp. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-8 h-5 bg-green-700 rounded-sm"></div>
            <div className="w-8 h-5 bg-white rounded-sm border border-green-600"></div>
            <div className="w-8 h-5 bg-green-700 rounded-sm"></div>
            <span className="text-green-400/50 text-xs ml-2">{lang === 'es' ? 'Hecho con orgullo andaluz' : 'Made with Andalusian pride'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════ */

export default function App() {
  const { dark, toggle } = useTheme();
  const { lang: currentLang, setLang } = useLanguage();
  lang = currentLang;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${dark ? 'bg-green-950 text-white' : 'bg-white text-green-900'}`}>
      <ScrollProgressBar />
      <Navbar dark={dark} toggleTheme={toggle} lang={currentLang} setLang={setLang} />
      <HeroSection dark={dark} />
      <DashboardSection dark={dark} />
      <DependencyGraph dark={dark} />
      <CodeCompareSection dark={dark} />
      <SecuritySection dark={dark} />
      <PromptBuilder dark={dark} />
      <TeamSection dark={dark} />
      <PricingSection dark={dark} />
      <FAQSection dark={dark} />
      <NewsletterSection dark={dark} />
      <Footer dark={dark} />
      <BackToTop dark={dark} />
    </div>
  );
}
