import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════
   AL ANDALUS AI CORP — FASE 2
   ═══════════════════════════════════════════════════ */

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

/* ─────────────── Animated Section Wrapper ─────────────── */

function AnimatedSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
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
          <line x1="0" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
          <line x1="100" y1="0" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
          <line x1="0" y1="100" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
          <line x1="100" y1="100" x2="50" y2="50" stroke="currentColor" strokeWidth="0.3" />
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

function ArabesqueDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <svg width="300" height="30" viewBox="0 0 300 30" className="text-green-600/30">
        <path d="M0 15 Q25 0 50 15 Q75 30 100 15 Q125 0 150 15 Q175 30 200 15 Q225 0 250 15 Q275 30 300 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="150" cy="15" r="4" fill="currentColor" />
        <circle cx="75" cy="15" r="2" fill="currentColor" />
        <circle cx="225" cy="15" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ─────────────── Floating Particles ─────────────── */

function FloatingParticles({ dark }: { dark: boolean }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute rounded-full ${dark ? 'bg-green-400/20' : 'bg-green-500/15'}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────── Scroll Progress Bar ─────────────── */

function ScrollProgressBar({ dark }: { dark: boolean }) {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1">
      <div
        className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 transition-all duration-150 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ─────────────── Back to Top ─────────────── */

function BackToTop({ dark }: { dark: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:-translate-y-1 ${dark ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
      aria-label="Volver arriba"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

/* ─────────────── Navbar ─────────────── */

function Navbar({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const bg = dark
    ? scrolled ? 'bg-green-950/95 backdrop-blur-md shadow-lg shadow-green-900/20' : 'bg-transparent'
    : scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent';

  const links = ['Características', 'Cómo Funciona', 'Dino Lab', 'Calculadora', 'Precios', 'FAQ'];

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

          <div className="hidden lg:flex items-center space-x-6">
            {links.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className={`text-sm font-medium transition-colors hover:text-green-500 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-green-500 after:transition-all hover:after:w-full ${dark ? 'text-green-300' : 'text-green-800'}`}>
                {item}
              </a>
            ))}
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${dark ? 'bg-green-800 text-yellow-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} aria-label="Cambiar tema">
              {dark ? '☀️' : '🌙'}
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-green-700/30 hover:shadow-xl hover:-translate-y-0.5">
              Comenzar
            </button>
          </div>

          <div className="flex lg:hidden items-center space-x-3">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${dark ? 'bg-green-800 text-yellow-300' : 'bg-green-100 text-green-700'}`}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={dark ? 'text-white' : 'text-green-800'}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className={`lg:hidden backdrop-blur-md border-t ${dark ? 'bg-green-950/95 border-green-800' : 'bg-white/95 border-green-100'}`}>
          <div className="px-4 py-4 space-y-3">
            {links.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className={`block font-medium py-2 ${dark ? 'text-green-300' : 'text-green-800'}`} onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
            <button className="w-full bg-green-700 text-white px-5 py-2.5 rounded-full font-semibold">Comenzar</button>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.06]">
        <svg viewBox="0 0 700 400" className={`w-full h-full ${dark ? 'text-green-300' : 'text-green-800'}`}>
          <path d="M150 400 L150 200 Q150 80 250 80 L450 80 Q550 80 550 200 L550 400" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M200 400 L200 220 Q200 120 300 120 L400 120 Q500 120 500 220 L500 400" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M250 400 L250 240 Q250 160 350 160 Q450 160 450 240 L450 400" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="350" cy="60" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${dark ? 'bg-green-800/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-800'}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Ingeniería Inversa con IA
            </div>

            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] ${dark ? 'text-white' : 'text-green-900'}`}>
              Descubre cómo
              <span className="block bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent">
                funciona el software
              </span>
            </h1>

            <p className={`text-xl max-w-lg leading-relaxed ${dark ? 'text-green-300/80' : 'text-green-700/70'}`}>
              Pregunta a tu agente de IA sobre una app, un juego o un sitio web.
              Al Andalus AI le da las herramientas para inspeccionar el código detrás de la respuesta.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-green-700/30 hover:shadow-2xl hover:-translate-y-1">
                Comenzar ahora
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
              </button>
              <button className={`border-2 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-0.5 ${dark ? 'border-green-500 text-green-400 hover:bg-green-900/50' : 'border-green-700 text-green-700 hover:bg-green-50'}`}>
                Ver ejemplos ↓
              </button>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                {['bg-green-400', 'bg-emerald-500', 'bg-green-600', 'bg-teal-500'].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 ${dark ? 'border-green-900' : 'border-white'} shadow-md`}></div>
                ))}
              </div>
              <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                <span className="font-bold">2,500+</span> desarrolladores confían en nosotros
              </p>
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
                  <p className="text-green-400">$ <span className="text-white">{typedText}<span className="animate-pulse">▌</span></span></p>
                  <p className="text-green-400 mt-3">✓ Módulos detectados: <span className="text-emerald-300">47</span></p>
                  <p className="text-green-400 mt-1">✓ Dependencias mapeadas: <span className="text-emerald-300">128</span></p>
                  <p className="text-green-400 mt-1">✓ Rutas encontradas: <span className="text-emerald-300">23</span></p>
                  <p className="text-green-400 mt-1">✓ Funciones críticas: <span className="text-emerald-300">89</span></p>
                  <p className="text-yellow-300 mt-3 animate-pulse">⟳ Generando informe...</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ n: '47', l: 'Módulos' }, { n: '128', l: 'Dependencias' }, { n: '89', l: 'Funciones' }].map((s, i) => (
                    <div key={i} className={`rounded-xl p-3 text-center ${dark ? 'bg-green-800/50' : 'bg-green-50'}`}>
                      <p className="text-2xl font-black text-green-500">{s.n}</p>
                      <p className={`text-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Stats Section (NEW) ─────────────── */

function StatsSection({ dark }: { dark: boolean }) {
  const { ref, inView } = useInView(0.3);
  const devs = useCountUp(2500, 2000, inView);
  const projects = useCountUp(15000, 2500, inView);
  const languages = useCountUp(42, 1500, inView);
  const accuracy = useCountUp(99, 2000, inView);

  const stats = [
    { value: devs, suffix: '+', label: 'Desarrolladores', icon: '👨‍💻' },
    { value: projects, suffix: '+', label: 'Proyectos Analizados', icon: '📊' },
    { value: languages, suffix: '', label: 'Lenguajes Soportados', icon: '🌐' },
    { value: accuracy, suffix: '%', label: 'Precisión de Análisis', icon: '🎯' },
  ];

  return (
    <section ref={ref} className={`py-20 relative ${dark ? 'bg-green-900/30' : 'bg-gradient-to-r from-green-700 to-green-800'}`}>
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{s.icon}</div>
              <p className="text-4xl sm:text-5xl font-black text-white mb-1">
                {s.value.toLocaleString()}{s.suffix}
              </p>
              <p className="text-green-200/70 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Features ─────────────── */

function FeaturesSection({ dark }: { dark: boolean }) {
  const features = [
    { icon: '🔍', title: 'Inspección Profunda', desc: 'Tu agente puede seguir el código, explicar funcionalidades y ayudarte a reconstruirlas.' },
    { icon: '⚡', title: 'Análisis en Tiempo Real', desc: 'Observa el comportamiento del software mientras se ejecuta y captura datos dinámicos.' },
    { icon: '🏗️', title: 'Reconstrucción Asistida', desc: 'Reconstruye funcionalidades completas a partir del análisis del código fuente.' },
    { icon: '🔐', title: 'Binarios Nativos', desc: 'Inspecciona funciones, strings, referencias y relaciones de llamadas en ejecutables.' },
    { icon: '🌐', title: 'JavaScript & Electron', desc: 'Mapea módulos, rutas, IPC y dependencias nativas desde un archivo ASAR.' },
    { icon: '🎯', title: 'Navegador & Runtime', desc: 'Captura actividad del navegador o proceso y compara resultados entre ejecuciones.' },
  ];

  return (
    <section id="características" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Herramientas Poderosas</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              Todo lo que necesitas para entender, analizar y reconstruir cualquier software
            </p>
          </div>
        </AnimatedSection>
        <ArabesqueDivider />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className={`group rounded-2xl p-8 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600 hover:shadow-green-900/30' : 'bg-gradient-to-br from-white to-green-50 border-green-100 hover:border-green-400'}`}>
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className={`text-xl font-bold mb-3 transition-colors ${dark ? 'text-white group-hover:text-green-400' : 'text-green-900 group-hover:text-green-600'}`}>{f.title}</h3>
                <p className={`leading-relaxed ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It Works ─────────────── */

function HowItWorksSection({ dark }: { dark: boolean }) {
  const steps = [
    { n: '01', t: 'Pregunta sobre una funcionalidad', d: 'Dale a tu agente un programa o página y una pregunta.', icon: '💬' },
    { n: '02', t: 'Inspecciona el programa', d: 'Al Andalus AI devuelve código, referencias y observaciones en tiempo real.', icon: '🔬' },
    { n: '03', t: 'Explícalo y prueba un cambio', d: 'Tu agente usa los hallazgos para explicar o reconstruir la funcionalidad.', icon: '🚀' },
  ];

  return (
    <section id="cómo-funciona" className="py-24 bg-gradient-to-b from-green-800 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg viewBox="0 0 1200 120" className="w-full h-32 text-green-950" preserveAspectRatio="none">
          <path d="M0 120 L0 80 Q100 20 200 80 Q300 20 400 80 Q500 20 600 80 Q700 20 800 80 Q900 20 1000 80 Q1100 20 1200 80 L1200 120 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">¿Cómo Funciona?</h2>
            <p className="text-xl text-green-200/70 max-w-2xl mx-auto">Ingeniería inversa significa aprender cómo funciona el software inspeccionando el programa mismo</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className="relative">
                {i < steps.length - 1 && <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-green-400/50 to-transparent z-0"></div>}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-5xl font-black text-green-400/30">{s.n}</span>
                    <span className="text-3xl">{s.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.t}</h3>
                  <p className="text-green-200/60 leading-relaxed">{s.d}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Dino Game ─────────────── */

function DinoGame({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6);
  const [manualSpeed, setManualSpeed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef({ dinoY: 0, velocity: 0, cactusX: 400, speed: 6, score: 0, frame: 0 });
  const animRef = useRef<number>(0);

  const GROUND_Y = 130, DINO_X = 50, DINO_W = 30, DINO_H = 40;
  const CACTUS_W = 20, CACTUS_H = 40, GRAVITY = 0.6, JUMP_FORCE = -12;
  const CANVAS_W = 500, CANVAS_H = 170;

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.dinoY >= GROUND_Y - DINO_H) g.velocity = JUMP_FORCE;
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.dinoY = GROUND_Y - DINO_H; g.velocity = 0; g.cactusX = CANVAS_W;
    g.speed = manualSpeed ? speed : 6; g.score = 0; g.frame = 0;
    setPlaying(true); setGameOver(false); setScore(0);
  }, [speed, manualSpeed]);

  useEffect(() => {
    if (!playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const g = gameRef.current;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', handleKey);

    const loop = () => {
      g.frame++;
      g.velocity += GRAVITY; g.dinoY += g.velocity;
      if (g.dinoY >= GROUND_Y - DINO_H) { g.dinoY = GROUND_Y - DINO_H; g.velocity = 0; }
      g.cactusX -= g.speed * 0.5;
      if (g.cactusX < -CACTUS_W) { g.cactusX = CANVAS_W + Math.random() * 200; g.score++; setScore(g.score); }
      if (!manualSpeed && g.speed < 13) g.speed += 0.001;
      if (DINO_X + DINO_W > g.cactusX && DINO_X < g.cactusX + CACTUS_W && g.dinoY + DINO_H > GROUND_Y - CACTUS_H) {
        setPlaying(false); setGameOver(true);
        setHighScore(prev => Math.max(prev, g.score));
        return;
      }
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.strokeStyle = dark ? '#4ade80' : '#166534'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke();
      for (let i = 0; i < CANVAS_W; i += 20) {
        const offset = (i + g.frame * g.speed * 0.3) % CANVAS_W;
        ctx.fillStyle = dark ? '#4ade8040' : '#16653430';
        ctx.fillRect(CANVAS_W - offset, GROUND_Y + 5, 8, 2);
      }
      ctx.fillStyle = dark ? '#4ade80' : '#15803d';
      ctx.fillRect(DINO_X, g.dinoY, DINO_W, DINO_H);
      ctx.fillStyle = dark ? '#000' : '#fff';
      ctx.fillRect(DINO_X + 20, g.dinoY + 8, 5, 5);
      const legOffset = Math.sin(g.frame * 0.3) * 4;
      ctx.fillStyle = dark ? '#4ade80' : '#15803d';
      ctx.fillRect(DINO_X + 5, g.dinoY + DINO_H, 6, 6 + (g.dinoY < GROUND_Y - DINO_H ? 0 : legOffset));
      ctx.fillRect(DINO_X + 18, g.dinoY + DINO_H, 6, 6 + (g.dinoY < GROUND_Y - DINO_H ? 0 : -legOffset));
      ctx.fillStyle = dark ? '#22c55e' : '#166534';
      ctx.fillRect(g.cactusX, GROUND_Y - CACTUS_H, CACTUS_W, CACTUS_H);
      ctx.fillRect(g.cactusX - 6, GROUND_Y - CACTUS_H + 10, 8, 15);
      ctx.fillRect(g.cactusX + CACTUS_W - 2, GROUND_Y - CACTUS_H + 5, 8, 12);
      ctx.fillStyle = dark ? '#4ade80' : '#166534';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`Score: ${g.score}`, CANVAS_W - 100, 25);
      ctx.fillText(`Speed: ${g.speed.toFixed(1)}`, 10, 25);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('keydown', handleKey); };
  }, [playing, dark, jump]);

  return (
    <section id="dino-lab" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-gradient-to-b from-green-50 to-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${dark ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-700'}`}>Ejemplo Interactivo 01</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>¿Por qué el dinosaurio se acelera?</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>El juego se acelera mientras corres. Reconstruimos esa regla y añadimos un control de velocidad.</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className={`rounded-xl overflow-hidden mb-6 border ${dark ? 'border-green-700 bg-green-950' : 'border-green-200 bg-green-50'}`}>
              <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="w-full cursor-pointer" onClick={() => { if (playing) jump(); }} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {!playing ? (
                <button onClick={startGame} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-green-700/30 transition-all hover:-translate-y-0.5">
                  {gameOver ? '🔄 Reiniciar' : '▶ Jugar'}
                </button>
              ) : (
                <button onClick={jump} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5">⬆ Saltar</button>
              )}
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${dark ? 'bg-green-800/50' : 'bg-green-50'}`}>
                <span className={`text-sm font-medium ${dark ? 'text-green-300' : 'text-green-700'}`}>Score:</span>
                <span className="text-lg font-black text-green-500">{score}</span>
              </div>
              {highScore > 0 && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${dark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                  <span className="text-yellow-500">🏆</span>
                  <span className="text-sm font-bold text-yellow-600">Mejor: {highScore}</span>
                </div>
              )}
              {gameOver && <span className="text-red-500 font-bold animate-pulse">¡Game Over!</span>}
            </div>
            <div className={`rounded-xl p-5 ${dark ? 'bg-green-800/30 border border-green-700/50' : 'bg-green-50 border border-green-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <label className={`font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>Control de velocidad manual</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={manualSpeed} onChange={() => setManualSpeed(!manualSpeed)} className="w-4 h-4 accent-green-600" />
                  <span className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>Activar</span>
                </label>
              </div>
              <input type="range" min="3" max="20" step="0.5" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} disabled={!manualSpeed} className="w-full accent-green-600 h-2 rounded-full cursor-pointer disabled:opacity-40" />
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>Lento (3)</span>
                <span className={`text-sm font-bold ${dark ? 'text-green-400' : 'text-green-700'}`}>Velocidad: {speed.toFixed(1)}</span>
                <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>Rápido (20)</span>
              </div>
            </div>
            <div className="mt-6">
              <p className={`text-sm font-semibold mb-2 ${dark ? 'text-green-400' : 'text-green-700'}`}>📄 Código original recuperado por Al Andalus AI:</p>
              <div className="bg-green-950 rounded-xl p-4 font-mono text-sm border border-green-800/50 overflow-x-auto">
                <pre className="text-green-300"><code>{`if (this.currentSpeed < this.config.MAX_SPEED) {
  this.currentSpeed += this.config.ACCELERATION;
}`}</code></pre>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Calculator ─────────────── */

function CalculatorDemo({ dark }: { dark: boolean }) {
  const [display, setDisplay] = useState('200');
  const [prev, setPrev] = useState<number | null>(200);
  const [current, setCurrent] = useState('10');
  const [operation, setOperation] = useState<'+' | '×'>('+');
  const [result, setResult] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handlePercent = () => {
    const curr = parseFloat(current);
    const p = prev;
    let percentResult: number;
    if (operation === '×') percentResult = curr / 100;
    else percentResult = (curr * (p || 0)) / 100;
    setResult(percentResult.toString());
    setShowExplanation(true);
  };

  const handleEquals = () => {
    const p = prev || 0;
    const c = parseFloat(result || current);
    const res = operation === '+' ? p + c : p * c;
    setDisplay(res.toString());
  };

  const reset = () => { setDisplay('200'); setPrev(200); setCurrent('10'); setResult(null); setShowExplanation(false); };

  return (
    <section id="calculadora" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/30' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${dark ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-700'}`}>Ejemplo Interactivo 02</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Reconstruye el botón % de la Calculadora</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>El botón % hace cosas distintas después de + y ×. Descubre ambas reglas.</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection>
            <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
              <h3 className={`text-lg font-bold mb-6 ${dark ? 'text-white' : 'text-green-900'}`}>Elige operación:</h3>
              <div className="flex gap-4 mb-8">
                {(['+', '×'] as const).map(op => (
                  <button key={op} onClick={() => { setOperation(op); reset(); }}
                    className={`flex-1 py-4 rounded-xl font-bold text-2xl transition-all ${operation === op
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-700/30'
                      : dark ? 'bg-green-800/50 text-green-400 hover:bg-green-800' : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>{op}</button>
                ))}
              </div>
              <div className={`rounded-2xl p-6 mb-6 ${dark ? 'bg-green-950 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                <div className="text-right">
                  <p className={`text-sm ${dark ? 'text-green-500' : 'text-green-600'}`}>{prev} {operation} {result !== null ? result : current}</p>
                  <p className={`text-4xl font-black ${dark ? 'text-white' : 'text-green-900'}`}>{display}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={handlePercent} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">%</button>
                <button onClick={handleEquals} className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">=</button>
                <button onClick={reset} className={`py-4 rounded-xl font-bold text-xl transition-all hover:-translate-y-0.5 ${dark ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>↺</button>
              </div>
              <p className={`text-sm mt-4 text-center ${dark ? 'text-green-500/60' : 'text-green-600/60'}`}>Pulsa <strong>%</strong> para ver qué le pasa al 10</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="space-y-6">
              <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
                <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{showExplanation ? '📊 Resultado del análisis' : '💡 ¿Qué hace el botón %?'}</h3>
                {!showExplanation ? (
                  <div className="space-y-4">
                    <div className={`rounded-xl p-4 ${dark ? 'bg-green-800/30' : 'bg-green-50'}`}>
                      <p className={`font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>Con +</p>
                      <p className={`text-sm ${dark ? 'text-green-400/70' : 'text-green-600'}`}>Toma un porcentaje del primer número.<br /><code className="font-mono bg-green-900/30 px-2 py-0.5 rounded">10% de 200 = 20 → 200 + 20 = 220</code></p>
                    </div>
                    <div className={`rounded-xl p-4 ${dark ? 'bg-green-800/30' : 'bg-green-50'}`}>
                      <p className={`font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>Con ×</p>
                      <p className={`text-sm ${dark ? 'text-green-400/70' : 'text-green-600'}`}>Convierte el porcentaje a decimal.<br /><code className="font-mono bg-green-900/30 px-2 py-0.5 rounded">200 × 0.1 = 20</code></p>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-xl p-5 ${dark ? 'bg-green-800/40 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`font-bold text-lg mb-2 ${dark ? 'text-green-300' : 'text-green-800'}`}>{operation === '+' ? `10% de 200 = ${result}` : `10% → ${result}`}</p>
                    <p className={`text-sm ${dark ? 'text-green-400/70' : 'text-green-600'}`}>{operation === '+' ? 'El % toma un porcentaje del primer número (200 × 10 / 100 = 20)' : 'El % convierte el porcentaje a decimal (10 / 100 = 0.1)'}</p>
                  </div>
                )}
              </div>
              <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
                <p className={`text-sm font-semibold mb-3 ${dark ? 'text-green-400' : 'text-green-700'}`}>📄 Código recuperado por Al Andalus AI:</p>
                <div className="bg-green-950 rounded-xl p-4 font-mono text-xs border border-green-800/50 overflow-x-auto">
                  <pre className="text-green-300"><code>{`if (operation == multiply || operation == divide) {
  percent = current / 100;
} else {
  percent = current * previous / 100;
}`}</code></pre>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Testimonials (NEW) ─────────────── */

function TestimonialsSection({ dark }: { dark: boolean }) {
  const [active, setActive] = useState(0);
  const testimonials = [
    { name: 'María García', role: 'Lead Developer @ TechSevilla', text: 'Al Andalus AI transformó nuestra forma de entender código legacy. Lo que antes tomaba semanas ahora lo resolvemos en horas.', avatar: '👩‍💻' },
    { name: 'Ahmed Al-Rashid', role: 'Security Researcher', text: 'La precisión del análisis de binarios es impresionante. Encontramos vulnerabilidades que otras herramientas no detectaron.', avatar: '🧑‍💻' },
    { name: 'Carlos Ruiz', role: 'CTO @ Córdoba Digital', text: 'Desde que usamos Al Andalus AI, nuestro equipo de reverse engineering es 3x más productivo. Una herramienta indispensable.', avatar: '👨‍💼' },
    { name: 'Lucía Fernández', role: 'Game Developer', text: 'Pude reconstruir la lógica de un juego clásico en días. La reconstrucción asistida por IA es magia pura.', avatar: '👩‍🎨' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Lo que dicen nuestros usuarios</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>Miles de desarrolladores confían en Al Andalus AI para sus proyectos</p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-8 sm:p-12 shadow-2xl border relative overflow-hidden ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="absolute top-6 left-8 text-6xl text-green-200/30 font-serif">"</div>
            <div className="relative z-10">
              {testimonials.map((t, i) => (
                <div key={i} className={`transition-all duration-700 ${i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                  {i === active && (
                    <>
                      <p className={`text-xl sm:text-2xl leading-relaxed mb-8 ${dark ? 'text-green-200' : 'text-green-800'}`}>"{t.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl shadow-lg">{t.avatar}</div>
                        <div>
                          <p className={`font-bold ${dark ? 'text-white' : 'text-green-900'}`}>{t.name}</p>
                          <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>{t.role}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`w-3 h-3 rounded-full transition-all ${i === active ? 'bg-green-600 w-8' : dark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-200 hover:bg-green-400'}`} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Pricing (NEW) ─────────────── */

function PricingSection({ dark }: { dark: boolean }) {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Explorador',
      desc: 'Para desarrolladores individuales',
      price: annual ? 0 : 0,
      features: ['Análisis básico de código', '5 investigaciones/mes', 'Soporte por email', 'Acceso a guías'],
      cta: 'Comenzar Gratis',
      popular: false,
    },
    {
      name: 'Profesional',
      desc: 'Para equipos de desarrollo',
      price: annual ? 29 : 39,
      features: ['Análisis avanzado completo', 'Investigaciones ilimitadas', 'Soporte prioritario 24/7', 'API access', 'Integraciones CI/CD', 'Binarios nativos'],
      cta: 'Comenzar Prueba',
      popular: true,
    },
    {
      name: 'Enterprise',
      desc: 'Para grandes organizaciones',
      price: annual ? 99 : 129,
      features: ['Todo de Profesional', 'Despliegue on-premise', 'SLA garantizado', 'Entrenamiento personalizado', 'Gestor de cuenta dedicado', 'Auditorías de seguridad'],
      cta: 'Contactar Ventas',
      popular: false,
    },
  ];

  return (
    <section id="precios" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Planes y Precios</h2>
            <p className={`text-xl max-w-2xl mx-auto mb-8 ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>Elige el plan que mejor se adapte a tu equipo</p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!annual ? (dark ? 'text-white' : 'text-green-900') : (dark ? 'text-green-500' : 'text-green-600')}`}>Mensual</span>
              <button onClick={() => setAnnual(!annual)} className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-green-600' : dark ? 'bg-green-800' : 'bg-green-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${annual ? 'left-8' : 'left-1'}`} />
              </button>
              <span className={`text-sm font-medium ${annual ? (dark ? 'text-white' : 'text-green-900') : (dark ? 'text-green-500' : 'text-green-600')}`}>
                Anual <span className="text-green-500 font-bold">(-25%)</span>
              </span>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className={`relative rounded-3xl p-8 border-2 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 ${plan.popular
                ? 'bg-gradient-to-b from-green-600 to-green-800 border-green-500 shadow-2xl shadow-green-700/30 scale-[1.02]'
                : dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-white border-green-100 hover:border-green-400 hover:shadow-xl'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ MÁS POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-2xl font-black mb-1 ${plan.popular ? 'text-white' : dark ? 'text-white' : 'text-green-900'}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.popular ? 'text-green-200' : dark ? 'text-green-400/70' : 'text-green-600'}`}>{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : dark ? 'text-white' : 'text-green-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-green-200' : dark ? 'text-green-400' : 'text-green-600'}`}>/mes</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3">
                      <svg className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${plan.popular ? 'text-green-100' : dark ? 'text-green-300' : 'text-green-700'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3.5 rounded-full font-bold transition-all hover:-translate-y-0.5 ${plan.popular
                  ? 'bg-white text-green-700 hover:bg-green-50 shadow-lg'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-700/20'
                }`}>
                  {plan.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ (NEW) ─────────────── */

function FAQSection({ dark }: { dark: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: '¿Qué es Al Andalus AI?', a: 'Al Andalus AI es una herramienta de ingeniería inversa impulsada por inteligencia artificial que permite a tu agente de codificación inspeccionar, entender y reconstruir cualquier software: apps, juegos, sitios web o binarios nativos.' },
    { q: '¿Necesito experiencia en ingeniería inversa?', a: 'No. Al Andalus AI está diseñado para que cualquier desarrollador pueda hacer ingeniería inversa. Solo necesitas un agente de codificación y hacer preguntas en lenguaje natural.' },
    { q: '¿Qué lenguajes y plataformas soporta?', a: 'Soportamos binarios nativos (x64, ARM), JavaScript/TypeScript, aplicaciones Electron, APKs de Android, y actividad de navegadores. También analizamos código en Python, C, C++, Rust y más.' },
    { q: '¿Es legal usar Al Andalus AI?', a: 'Sí, siempre que respetes los términos de servicio del software que analizas y las leyes aplicables en tu jurisdicción. La ingeniería inversa con fines de interoperabilidad es legal en muchas jurisdicciones.' },
    { q: '¿Puedo usarlo en mi empresa?', a: 'Absolutamente. Ofrecemos planes Enterprise con despliegue on-premise, SLA garantizado y soporte dedicado para grandes organizaciones.' },
    { q: '¿Cómo se diferencia de otras herramientas?', a: 'Al Andalus AI combina análisis estático y dinámico con IA generativa. Tu agente no solo ve el código, sino que lo entiende, explica y puede reconstruir funcionalidades completas.' },
  ];

  return (
    <section id="faq" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Preguntas Frecuentes</h2>
            <p className={`text-xl ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>Todo lo que necesitas saber sobre Al Andalus AI</p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === i
                ? dark ? 'bg-green-900/50 border-green-600 shadow-lg shadow-green-900/20' : 'bg-white border-green-400 shadow-lg'
                : dark ? 'bg-green-900/30 border-green-800 hover:border-green-700' : 'bg-white border-green-100 hover:border-green-300'
              }`}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold text-lg pr-4 ${dark ? 'text-white' : 'text-green-900'}`}>{faq.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''} ${dark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
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

/* ─────────────── Showcases ─────────────── */

function ShowcasesSection({ dark }: { dark: boolean }) {
  const cases = [
    { cat: 'Android · Análisis APK', title: 'Cómo un autenticador genera un código de acceso', desc: 'Rastrea el código de seis dígitos de Aegis a través de su APK publicada.', gradient: 'from-green-600 to-emerald-700' },
    { cat: 'Electron · Rastreo', title: 'Cómo Notion copia texto y HTML', desc: 'Sigue el JavaScript empaquetado de Notion hasta el portapapeles del sistema.', gradient: 'from-green-700 to-green-900' },
    { cat: 'Nativo · Reconstrucción', title: 'Cálculo de paneo de sonido en DX-Ball', desc: 'Recupera cómo la posición de una bola se convierte en sonido izquierdo/derecho.', gradient: 'from-emerald-700 to-green-950' },
  ];

  return (
    <section id="casos" className={`py-24 ${dark ? 'bg-green-950' : 'bg-green-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Casos de Estudio</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>Explora funcionalidades en apps y juegos publicados, con código y resultados verificados</p>
          </div>
        </AnimatedSection>
        <ArabesqueDivider />
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className="group cursor-pointer h-full">
                <div className={`bg-gradient-to-br ${c.gradient} rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3`}>
                  <div>
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{c.cat}</span>
                    <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                    <p className="text-green-100/70 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Leer caso de estudio</span>
                    <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Guides ─────────────── */

function GuidesSection({ dark }: { dark: boolean }) {
  const guides = [
    { title: 'Binarios Nativos', desc: 'Inspecciona funciones, strings, referencias y relaciones de llamadas en ejecutables y bibliotecas.', icon: '⚙️' },
    { title: 'JavaScript & Electron', desc: 'Mapea módulos, rutas, IPC y dependencias nativas desde una carpeta de aplicación o archivo ASAR.', icon: '📦' },
    { title: 'Navegador & Runtime', desc: 'Captura actividad seleccionada del navegador o proceso y compara resultados entre ejecuciones.', icon: '🌍' },
  ];

  return (
    <section id="guías" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-white'}`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Elige tu Objetivo</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>Guías de configuración y primera investigación para cada tipo de software</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((g, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className={`relative rounded-2xl p-8 border-2 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2 h-full ${dark ? 'bg-green-900/30 border-green-800 hover:border-green-500' : 'bg-white border-green-100 hover:border-green-400'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <span className="text-4xl mb-4 block">{g.icon}</span>
                <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-green-900'}`}>{g.title}</h3>
                <p className={`leading-relaxed mb-6 ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{g.desc}</p>
                <button className={`font-semibold flex items-center transition-colors ${dark ? 'text-green-400 hover:text-green-300' : 'text-green-700 hover:text-green-500'}`}>
                  Leer guía <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Newsletter CTA (NEW) ─────────────── */

function NewsletterSection({ dark }: { dark: boolean }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <FloatingParticles dark={true} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <AnimatedSection>
          <Star8 className="w-16 h-16 text-green-300/50 mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Únete a la revolución</h2>
          <p className="text-xl text-green-200/80 mb-8 max-w-xl mx-auto">
            Recibe las últimas novedades, tutoriales y casos de estudio directamente en tu bandeja de entrada.
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all backdrop-blur-sm"
              />
              <button type="submit" className="bg-white text-green-800 px-8 py-3.5 rounded-full font-bold hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5">
                Suscribirme
              </button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-white font-bold text-lg">¡Bienvenido a Al Andalus AI!</p>
              <p className="text-green-200/70 text-sm">Revisa tu bandeja de entrada para confirmar.</p>
            </div>
          )}
          <p className="text-green-300/50 text-xs mt-4">Sin spam. Cancela cuando quieras.</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Setup CTA ─────────────── */

function SetupSection({ dark }: { dark: boolean }) {
  const [copied, setCopied] = useState(false);
  const code = `# Instala Al Andalus AI y conéctalo a tu agente\nnpx al-andalus-ai@latest setup\n\n# Muestra el plan de configuración para aprobación\n# luego verifica la instalación`;

  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-gradient-to-br from-green-50 to-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className={`rounded-3xl shadow-2xl p-8 sm:p-12 border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>Configura Al Andalus AI</h2>
              <p className={`text-lg ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>Copia esto en tu agente de codificación</p>
            </div>
            <div className="bg-green-950 rounded-xl p-6 font-mono text-sm relative border border-green-800/50">
              <button onClick={copyCode} className={`absolute top-4 right-4 px-3 py-1 rounded text-xs font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-green-800 text-green-300 hover:bg-green-700 hover:text-white'}`}>
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
              <pre className="text-green-300 overflow-x-auto"><code>{code}</code></pre>
            </div>
            <div className="mt-8 text-center">
              <p className={`text-sm mb-4 ${dark ? 'text-green-500' : 'text-green-600'}`}>¿Otras opciones de instalación?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className={`font-medium text-sm px-4 py-2 rounded-full transition-all ${dark ? 'text-green-400 border border-green-700 hover:border-green-500 hover:bg-green-800/50' : 'text-green-700 border border-green-200 hover:border-green-400 hover:bg-green-50'}`}>curl →</button>
                <button className={`font-medium text-sm px-4 py-2 rounded-full transition-all ${dark ? 'text-green-400 border border-green-700 hover:border-green-500 hover:bg-green-800/50' : 'text-green-700 border border-green-200 hover:border-green-400 hover:bg-green-50'}`}>Guía paso a paso →</button>
              </div>
            </div>
          </div>
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
                <p className="text-green-400 text-xs tracking-[0.2em] uppercase">Inteligencia de Ingeniería Inversa</p>
              </div>
            </div>
            <p className="text-green-300/60 max-w-sm mt-4 leading-relaxed">
              Herramientas de ingeniería inversa impulsadas por IA para desarrolladores que quieren entender cómo funciona el software.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Recursos</h4>
            <ul className="space-y-2">
              {['Documentación', 'Guías', 'Casos de Estudio', 'Blog', 'Precios'].map(l => (
                <li key={l}><a href="#" className="text-green-300/60 hover:text-white transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Comunidad</h4>
            <ul className="space-y-2">
              {['Discord', 'GitHub', 'FAQ', 'Contacto', 'Estado'].map(l => (
                <li key={l}><a href="#" className="text-green-300/60 hover:text-white transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-400/50 text-sm">© 2026 Al Andalus AI Corp. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-8 h-5 bg-green-700 rounded-sm"></div>
            <div className="w-8 h-5 bg-white rounded-sm border border-green-600"></div>
            <div className="w-8 h-5 bg-green-700 rounded-sm"></div>
            <span className="text-green-400/50 text-xs ml-2">Hecho con orgullo andaluz</span>
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

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${dark ? 'bg-green-950 text-white' : 'bg-white text-green-900'}`}>
      <ScrollProgressBar dark={dark} />
      <Navbar dark={dark} toggleTheme={toggle} />
      <HeroSection dark={dark} />
      <StatsSection dark={dark} />
      <FeaturesSection dark={dark} />
      <HowItWorksSection dark={dark} />
      <DinoGame dark={dark} />
      <CalculatorDemo dark={dark} />
      <TestimonialsSection dark={dark} />
      <ShowcasesSection dark={dark} />
      <PricingSection dark={dark} />
      <FAQSection dark={dark} />
      <GuidesSection dark={dark} />
      <SetupSection dark={dark} />
      <NewsletterSection dark={dark} />
      <Footer dark={dark} />
      <BackToTop dark={dark} />
    </div>
  );
}
