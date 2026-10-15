import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════
   AL ANDALUS AI CORP — FASE 4
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

function ArabesqueDivider() {
  return (
    <div className="flex items-center justify-center py-8">
      <svg width="300" height="30" viewBox="0 0 300 30" className="text-green-600/30">
        <path d="M0 15 Q25 0 50 15 Q75 30 100 15 Q125 0 150 15 Q175 30 200 15 Q225 0 250 15 Q275 30 300 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="150" cy="15" r="4" fill="currentColor" />
      </svg>
    </div>
  );
}

function FloatingParticles({ dark }: { dark: boolean }) {
  const particles = Array.from({ length: 15 }, (_, i) => ({
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

/* ─────────────── Scroll Progress ─────────────── */

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
    { label: lang === 'es' ? 'Características' : 'Features', href: '#features' },
    { label: lang === 'es' ? 'Mapa' : 'Map', href: '#map' },
    { label: lang === 'es' ? 'Terminal' : 'Terminal', href: '#terminal' },
    { label: lang === 'es' ? 'Tecnologías' : 'Tech Stack', href: '#tech-stack' },
    { label: lang === 'es' ? 'Precios' : 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
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
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                {['bg-green-400', 'bg-emerald-500', 'bg-green-600', 'bg-teal-500'].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 ${dark ? 'border-green-900' : 'border-white'} shadow-md`}></div>
                ))}
              </div>
              <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>
                <span className="font-bold">2,500+</span> {lang === 'es' ? 'desarrolladores confían en nosotros' : 'developers trust us'}
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

/* ─────────────── Stats ─────────────── */

function StatsSection({ dark }: { dark: boolean }) {
  const { ref, inView } = useInView(0.3);
  const devs = useCountUp(2500, 2000, inView);
  const projects = useCountUp(15000, 2500, inView);
  const languages = useCountUp(42, 1500, inView);
  const accuracy = useCountUp(99, 2000, inView);
  const stats = [
    { value: devs, suffix: '+', label: lang === 'es' ? 'Desarrolladores' : 'Developers', icon: '👨‍💻' },
    { value: projects, suffix: '+', label: lang === 'es' ? 'Proyectos Analizados' : 'Projects Analyzed', icon: '📊' },
    { value: languages, suffix: '', label: lang === 'es' ? 'Lenguajes Soportados' : 'Languages Supported', icon: '🌐' },
    { value: accuracy, suffix: '%', label: lang === 'es' ? 'Precisión' : 'Accuracy', icon: '🎯' },
  ];
  return (
    <section ref={ref} className={`py-20 relative ${dark ? 'bg-green-900/30' : 'bg-gradient-to-r from-green-700 to-green-800'}`}>
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{s.icon}</div>
              <p className="text-4xl sm:text-5xl font-black text-white mb-1">{s.value.toLocaleString()}{s.suffix}</p>
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
    { icon: '🔍', title: lang === 'es' ? 'Inspección Profunda' : 'Deep Inspection', desc: lang === 'es' ? 'Tu agente puede seguir el código, explicar funcionalidades y ayudarte a reconstruirlas.' : 'Your agent can follow the code, explain features and help you rebuild them.' },
    { icon: '⚡', title: lang === 'es' ? 'Análisis en Tiempo Real' : 'Real-time Analysis', desc: lang === 'es' ? 'Observa el comportamiento del software mientras se ejecuta y captura datos dinámicos.' : 'Watch software behavior while it runs and capture dynamic data.' },
    { icon: '🏗️', title: lang === 'es' ? 'Reconstrucción Asistida' : 'Assisted Reconstruction', desc: lang === 'es' ? 'Reconstruye funcionalidades completas a partir del análisis del código fuente.' : 'Rebuild complete features from source code analysis.' },
    { icon: '🔐', title: lang === 'es' ? 'Binarios Nativos' : 'Native Binaries', desc: lang === 'es' ? 'Inspecciona funciones, strings, referencias y relaciones de llamadas en ejecutables.' : 'Inspect functions, strings, references and call relationships in executables.' },
    { icon: '🌐', title: 'JavaScript & Electron', desc: lang === 'es' ? 'Mapea módulos, rutas, IPC y dependencias nativas desde un archivo ASAR.' : 'Map modules, routes, IPC and native dependencies from an ASAR file.' },
    { icon: '🎯', title: lang === 'es' ? 'Navegador & Runtime' : 'Browser & Runtime', desc: lang === 'es' ? 'Captura actividad del navegador o proceso y compara resultados entre ejecuciones.' : 'Capture browser or process activity and compare results across runs.' },
  ];
  return (
    <section id="features" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{lang === 'es' ? 'Herramientas Poderosas' : 'Powerful Tools'}</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{lang === 'es' ? 'Todo lo que necesitas para entender, analizar y reconstruir cualquier software' : 'Everything you need to understand, analyze and rebuild any software'}</p>
          </div>
        </AnimatedSection>
        <ArabesqueDivider />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className={`group rounded-2xl p-8 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-gradient-to-br from-white to-green-50 border-green-100 hover:border-green-400'}`}>
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

/* ─────────────── Interactive Map of Andalucía (NEW) ─────────────── */

function InteractiveMap({ dark }: { dark: boolean }) {
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  const provinces = [
    { id: 'sevilla', name: 'Sevilla', desc: lang === 'es' ? 'Sede central' : 'Headquarters', x: 220, y: 280, employees: 45 },
    { id: 'cordoba', name: 'Córdoba', desc: lang === 'es' ? 'Centro de I+D' : 'R&D Center', x: 300, y: 220, employees: 28 },
    { id: 'malaga', name: 'Málaga', desc: lang === 'es' ? 'Oficina de IA' : 'AI Office', x: 380, y: 340, employees: 32 },
    { id: 'granada', name: 'Granada', desc: lang === 'es' ? 'Laboratorio de datos' : 'Data Lab', x: 440, y: 280, employees: 22 },
    { id: 'almeria', name: 'Almería', desc: lang === 'es' ? 'Centro de seguridad' : 'Security Center', x: 520, y: 320, employees: 15 },
    { id: 'cadiz', name: 'Cádiz', desc: lang === 'es' ? 'Desarrollo web' : 'Web Development', x: 160, y: 360, employees: 18 },
    { id: 'huelva', name: 'Huelva', desc: lang === 'es' ? 'Soporte técnico' : 'Tech Support', x: 120, y: 280, employees: 12 },
    { id: 'jaen', name: 'Jaén', desc: lang === 'es' ? 'Análisis de binarios' : 'Binary Analysis', x: 380, y: 180, employees: 14 },
  ];

  return (
    <section id="map" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Nuestra Presencia en Andalucía' : 'Our Presence in Andalusia'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? '8 oficinas en las 8 provincias andaluzas, orgullosamente locales con impacto global' : '8 offices across the 8 Andalusian provinces, proudly local with global impact'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Map SVG */}
              <div className="relative">
                <svg viewBox="0 0 650 450" className="w-full h-auto">
                  {/* Simplified Andalucía map outline */}
                  <defs>
                    <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={dark ? '#166534' : '#bbf7d0'} />
                      <stop offset="100%" stopColor={dark ? '#15803d' : '#86efac'} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Map background shape */}
                  <path 
                    d="M100,200 Q120,150 180,140 Q250,130 320,150 Q400,170 480,200 Q550,230 580,280 Q590,320 560,360 Q520,400 450,390 Q380,380 320,370 Q250,360 200,380 Q150,400 120,370 Q90,340 80,300 Q70,250 100,200 Z" 
                    fill="url(#mapGradient)" 
                    stroke={dark ? '#4ade80' : '#166534'} 
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  
                  {/* Province markers */}
                  {provinces.map(province => (
                    <g key={province.id} className="map-province" onMouseEnter={() => setActiveProvince(province.id)} onMouseLeave={() => setActiveProvince(null)}>
                      {/* Pulse ring */}
                      <circle cx={province.x} cy={province.y} r="8" fill={dark ? '#4ade80' : '#16a34a'} opacity="0.3">
                        <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                      {/* Main dot */}
                      <circle 
                        cx={province.x} 
                        cy={province.y} 
                        r={activeProvince === province.id ? 10 : 7} 
                        fill={activeProvince === province.id ? '#fbbf24' : (dark ? '#4ade80' : '#16a34a')} 
                        stroke="white" 
                        strokeWidth="2"
                        filter="url(#glow)"
                        className="transition-all duration-300"
                      />
                      {/* Label */}
                      <text 
                        x={province.x} 
                        y={province.y - 15} 
                        textAnchor="middle" 
                        className={`text-xs font-bold ${dark ? 'fill-green-300' : 'fill-green-800'}`}
                        style={{ fontSize: '11px' }}
                      >
                        {province.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Province info panel */}
              <div className="space-y-4">
                {activeProvince ? (
                  <div className={`rounded-2xl p-6 ${dark ? 'bg-green-800/50 border border-green-700' : 'bg-green-50 border border-green-200'} animate-scale-in`}>
                    {(() => {
                      const p = provinces.find(pr => pr.id === activeProvince);
                      if (!p) return null;
                      return (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-black text-lg">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className={`text-2xl font-black ${dark ? 'text-white' : 'text-green-900'}`}>{p.name}</h3>
                              <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>{p.desc}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`rounded-xl p-4 ${dark ? 'bg-green-900/50' : 'bg-white'}`}>
                              <p className={`text-3xl font-black ${dark ? 'text-green-400' : 'text-green-700'}`}>{p.employees}</p>
                              <p className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{lang === 'es' ? 'Empleados' : 'Employees'}</p>
                            </div>
                            <div className={`rounded-xl p-4 ${dark ? 'bg-green-900/50' : 'bg-white'}`}>
                              <p className={`text-3xl font-black ${dark ? 'text-green-400' : 'text-green-700'}`}>24/7</p>
                              <p className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{lang === 'es' ? 'Soporte' : 'Support'}</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-6 ${dark ? 'bg-green-800/30 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-center ${dark ? 'text-green-400' : 'text-green-700'}`}>
                      👆 {lang === 'es' ? 'Pasa el ratón sobre una provincia' : 'Hover over a province'}
                    </p>
                  </div>
                )}

                {/* Province list */}
                <div className="grid grid-cols-2 gap-2">
                  {provinces.map(p => (
                    <button
                      key={p.id}
                      onMouseEnter={() => setActiveProvince(p.id)}
                      onMouseLeave={() => setActiveProvince(null)}
                      className={`p-3 rounded-xl text-left transition-all ${activeProvince === p.id
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                        : dark ? 'bg-green-800/30 text-green-300 hover:bg-green-800/50' : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className={`text-xs ${activeProvince === p.id ? 'text-green-100' : dark ? 'text-green-500' : 'text-green-600'}`}>{p.employees} {lang === 'es' ? 'empleados' : 'employees'}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Interactive Terminal (NEW) ─────────────── */

function InteractiveTerminal({ dark }: { dark: boolean }) {
  const [history, setHistory] = useState<{ cmd: string; output: string[] }[]>([
    { cmd: '', output: [lang === 'es' ? 'Bienvenido a Al Andalus AI Terminal v2.5.0' : 'Welcome to Al Andalus AI Terminal v2.5.0', lang === 'es' ? 'Escribe "help" para ver los comandos disponibles' : 'Type "help" to see available commands', ''] }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, string[]> = {
    help: [
      lang === 'es' ? 'Comandos disponibles:' : 'Available commands:',
      '  help     - ' + (lang === 'es' ? 'Muestra esta ayuda' : 'Show this help'),
      '  version  - ' + (lang === 'es' ? 'Muestra la versión' : 'Show version'),
      '  analyze  - ' + (lang === 'es' ? 'Analiza un programa' : 'Analyze a program'),
      '  scan     - ' + (lang === 'es' ? 'Escanea dependencias' : 'Scan dependencies'),
      '  status   - ' + (lang === 'es' ? 'Estado del sistema' : 'System status'),
      '  clear    - ' + (lang === 'es' ? 'Limpia la terminal' : 'Clear terminal'),
      '  about    - ' + (lang === 'es' ? 'Sobre Al Andalus AI' : 'About Al Andalus AI'),
      '',
    ],
    version: ['Al Andalus AI v2.5.0', 'Build: 2026.01.15-stable', 'Node: v20.10.0', ''],
    analyze: [
      '⟩ ' + (lang === 'es' ? 'Analizando programa...' : 'Analyzing program...'),
      '✓ ' + (lang === 'es' ? 'Módulos encontrados: 142' : 'Modules found: 142'),
      '✓ ' + (lang === 'es' ? 'Funciones críticas: 89' : 'Critical functions: 89'),
      '✓ ' + (lang === 'es' ? 'Dependencias: 234' : 'Dependencies: 234'),
      '✓ ' + (lang === 'es' ? 'Vulnerabilidades potenciales: 3' : 'Potential vulnerabilities: 3'),
      '⟩ ' + (lang === 'es' ? 'Informe generado: report_andalus_2026.pdf' : 'Report generated: report_andalus_2026.pdf'),
      '',
    ],
    scan: [
      '⟩ ' + (lang === 'es' ? 'Escaneando dependencias...' : 'Scanning dependencies...'),
      '✓ npm: 128 packages',
      '✓ pip: 45 packages',
      '✓ cargo: 23 crates',
      '⚠ ' + (lang === 'es' ? '2 dependencias desactualizadas' : '2 outdated dependencies'),
      '',
    ],
    status: [
      '● Al Andalus AI Status',
      '  ├─ API:        ✓ Operational',
      '  ├─ Analysis:   ✓ Operational',
      '  ├─ Database:   ✓ Operational',
      '  └─ Uptime:     99.99%',
      '',
    ],
    about: [
      '╔═══════════════════════════════════════╗',
      '║   Al Andalus AI Corporation           ║',
      '║   ' + (lang === 'es' ? 'Ingeniería Inversa con IA' : 'Reverse Engineering with AI') + '    ║',
      '║   ' + (lang === 'es' ? 'Hecho con orgullo andaluz' : 'Made with Andalusian pride') + '     ║',
      '╚═══════════════════════════════════════╝',
      '',
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      setHistory([{ cmd: '', output: [lang === 'es' ? 'Terminal limpiada' : 'Terminal cleared', ''] }]);
      setInput('');
      return;
    }

    const output = commands[cmd] || [lang === 'es' ? `Comando no reconocido: "${cmd}". Escribe "help" para ayuda.` : `Command not found: "${cmd}". Type "help" for help.`, ''];
    setHistory(prev => [...prev, { cmd, output }]);
    setInput('');
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  return (
    <section id="terminal" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Terminal Interactiva' : 'Interactive Terminal'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Prueba Al Andalus AI directamente desde tu navegador. Escribe "help" para empezar.' : 'Try Al Andalus AI right from your browser. Type "help" to get started.'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-green-800/50">
            {/* Terminal header */}
            <div className="bg-green-950 px-4 py-3 flex items-center gap-3 border-b border-green-800/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-green-400 text-xs font-mono">al-andalus-ai ~ terminal</span>
            </div>
            {/* Terminal body */}
            <div className="bg-green-950 p-6 font-mono text-sm min-h-[400px] max-h-[500px] overflow-y-auto" onClick={() => inputRef.current?.focus()}>
              {history.map((entry, i) => (
                <div key={i} className="mb-4">
                  {entry.cmd && (
                    <p className="text-green-400">
                      <span className="text-emerald-500">$</span> <span className="text-white">{entry.cmd}</span>
                    </p>
                  )}
                  {entry.output.map((line, li) => (
                    <p key={li} className={`${line.startsWith('✓') ? 'text-green-400' : line.startsWith('⚠') ? 'text-yellow-400' : line.startsWith('✗') ? 'text-red-400' : line.startsWith('║') || line.startsWith('╔') || line.startsWith('╚') ? 'text-emerald-300' : 'text-green-300'}`}>
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>
              ))}
              {/* Current input */}
              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-emerald-500 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none font-mono"
                  placeholder={lang === 'es' ? 'Escribe un comando...' : 'Type a command...'}
                  autoFocus
                />
                <span className="animate-blink text-green-400">▌</span>
              </form>
            </div>
          </div>
          <div className={`mt-4 flex flex-wrap gap-2 justify-center`}>
            {['help', 'version', 'analyze', 'scan', 'status', 'about'].map(cmd => (
              <button
                key={cmd}
                onClick={() => {
                  const output = commands[cmd] || [];
                  setHistory(prev => [...prev, { cmd, output }]);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${dark ? 'bg-green-800/50 text-green-400 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              >
                {cmd}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Real-Time Counter (NEW) ─────────────── */

function RealTimeCounter({ dark }: { dark: boolean }) {
  const [hours, setHours] = useState(847293);
  const [projects, setProjects] = useState(15234);
  const [lines, setLines] = useState(2847561);

  useEffect(() => {
    const interval = setInterval(() => {
      setHours(h => h + Math.floor(Math.random() * 3) + 1);
      setProjects(p => p + (Math.random() > 0.7 ? 1 : 0));
      setLines(l => l + Math.floor(Math.random() * 50) + 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`py-20 relative overflow-hidden ${dark ? 'bg-gradient-to-r from-green-900 to-green-800' : 'bg-gradient-to-r from-green-700 to-green-600'}`}>
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <FloatingParticles dark={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              {lang === 'es' ? 'Tiempo Ahorrado en Tiempo Real' : 'Time Saved in Real-Time'}
            </h2>
            <p className="text-green-200/70 text-lg">
              {lang === 'es' ? 'Números que se actualizan cada segundo' : 'Numbers updating every second'}
            </p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { value: hours, label: lang === 'es' ? 'Horas ahorradas' : 'Hours saved', icon: '⏱️' },
            { value: projects, label: lang === 'es' ? 'Análisis completados' : 'Analyses completed', icon: '🔬' },
            { value: lines, label: lang === 'es' ? 'Líneas de código analizadas' : 'Lines of code analyzed', icon: '📝' },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{stat.icon}</div>
              <p className="text-5xl sm:text-6xl font-black text-white mb-2 tabular-nums">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-green-200/70 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Tech Stack Grid (NEW) ─────────────── */

function TechStackSection({ dark }: { dark: boolean }) {
  const techs = [
    { name: 'JavaScript', icon: '🟨', color: 'from-yellow-400 to-yellow-600' },
    { name: 'TypeScript', icon: '🔷', color: 'from-blue-400 to-blue-600' },
    { name: 'Python', icon: '🐍', color: 'from-blue-500 to-green-500' },
    { name: 'Rust', icon: '🦀', color: 'from-orange-500 to-red-600' },
    { name: 'C/C++', icon: '⚙️', color: 'from-blue-600 to-blue-800' },
    { name: 'Go', icon: '🐹', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Java', icon: '☕', color: 'from-red-500 to-red-700' },
    { name: 'Swift', icon: '🐦', color: 'from-orange-400 to-orange-600' },
    { name: 'Kotlin', icon: '🟪', color: 'from-purple-500 to-purple-700' },
    { name: 'Ruby', icon: '💎', color: 'from-red-400 to-red-600' },
    { name: 'PHP', icon: '🐘', color: 'from-indigo-400 to-indigo-600' },
    { name: 'WebAssembly', icon: '🕸️', color: 'from-blue-500 to-purple-600' },
    { name: 'Android', icon: '🤖', color: 'from-green-400 to-green-600' },
    { name: 'iOS', icon: '🍎', color: 'from-gray-600 to-gray-800' },
    { name: 'Electron', icon: '⚡', color: 'from-blue-400 to-indigo-600' },
    { name: 'Docker', icon: '🐳', color: 'from-blue-400 to-blue-600' },
  ];

  return (
    <section id="tech-stack" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Tecnologías Soportadas' : 'Supported Technologies'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Analizamos cualquier lenguaje o plataforma que uses' : 'We analyze any language or platform you use'}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {techs.map((tech, i) => (
            <AnimatedSection key={i} delay={i * 50}>
              <div className={`tech-icon group relative rounded-2xl p-4 text-center cursor-pointer ${dark ? 'bg-green-900/40 border border-green-800 hover:border-green-500' : 'bg-gradient-to-br from-white to-green-50 border border-green-100 hover:border-green-400 hover:shadow-xl'}`}>
                <div className="text-4xl mb-2">{tech.icon}</div>
                <p className={`text-xs font-bold ${dark ? 'text-green-300' : 'text-green-700'}`}>{tech.name}</p>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Integrations (NEW) ─────────────── */

function IntegrationsSection({ dark }: { dark: boolean }) {
  const integrations = [
    { name: 'VS Code', icon: '💻' },
    { name: 'GitHub', icon: '🐙' },
    { name: 'GitLab', icon: '🦊' },
    { name: 'Docker', icon: '🐳' },
    { name: 'AWS', icon: '☁️' },
    { name: 'Azure', icon: '🔷' },
    { name: 'Jenkins', icon: '🏗️' },
    { name: 'Slack', icon: '💬' },
  ];

  return (
    <section className={`py-16 ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h3 className={`text-2xl font-black mb-2 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Se integra con tus herramientas favoritas' : 'Integrates with your favorite tools'}
            </h3>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {integrations.map((int, i) => (
            <AnimatedSection key={i} delay={i * 50}>
              <div className={`tech-icon rounded-xl p-4 text-center ${dark ? 'bg-green-900/40 border border-green-800 hover:border-green-600' : 'bg-white border border-green-100 hover:border-green-400 hover:shadow-lg'}`}>
                <div className="text-3xl mb-1">{int.icon}</div>
                <p className={`text-[10px] font-bold ${dark ? 'text-green-400' : 'text-green-700'}`}>{int.name}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Code Typewriter Animation (NEW) ─────────────── */

function CodeTypewriterSection({ dark }: { dark: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const { ref, inView } = useInView(0.3);

  const codeLines = [
    { text: '// Al Andalus AI - Analysis Engine', color: 'text-gray-500' },
    { text: 'import { Analyzer } from "@al-andalus/core";', color: 'text-blue-400' },
    { text: '', color: '' },
    { text: 'const engine = new Analyzer({', color: 'text-purple-400' },
    { text: '  mode: "deep-inspection",', color: 'text-green-400' },
    { text: '  target: "binary",', color: 'text-green-400' },
    { text: '  ai: true,', color: 'text-yellow-400' },
    { text: '});', color: 'text-purple-400' },
    { text: '', color: '' },
    { text: 'const result = await engine.analyze(app);', color: 'text-cyan-400' },
    { text: 'console.log(result.modules); // 142', color: 'text-green-400' },
    { text: 'console.log(result.findings); // 23', color: 'text-green-400' },
  ];

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < codeLines.length) {
        setVisibleLines(i + 1);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section ref={ref} className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Tan simple como esto' : 'As simple as this'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Solo unas líneas de código para analizar cualquier software' : 'Just a few lines of code to analyze any software'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-green-800/50">
            <div className="bg-green-950 px-4 py-3 flex items-center gap-3 border-b border-green-800/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-green-400 text-xs font-mono">analysis.ts</span>
            </div>
            <div className="bg-green-950 p-6 font-mono text-sm min-h-[350px]">
              {codeLines.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="code-line flex" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="text-green-700 w-8 text-right mr-4 select-none">{i + 1}</span>
                  <span className={line.color}>{line.text || '\u00A0'}</span>
                </div>
              ))}
              {visibleLines < codeLines.length && (
                <div className="flex">
                  <span className="text-green-700 w-8 text-right mr-4 select-none">{visibleLines + 1}</span>
                  <span className="animate-blink text-green-400">▌</span>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Downloadable Resources (NEW) ─────────────── */

function ResourcesSection({ dark }: { dark: boolean }) {
  const resources = [
    { title: lang === 'es' ? 'Whitepaper: Ingeniería Inversa con IA' : 'Whitepaper: AI Reverse Engineering', type: 'PDF', size: '2.4 MB', icon: '📄', desc: lang === 'es' ? 'Guía completa sobre metodologías de análisis' : 'Complete guide on analysis methodologies' },
    { title: lang === 'es' ? 'Ebook: Casos de Estudio Reales' : 'Ebook: Real Case Studies', type: 'EPUB', size: '5.1 MB', icon: '📚', desc: lang === 'es' ? '15 casos de estudio detallados con código' : '15 detailed case studies with code' },
    { title: lang === 'es' ? 'Cheat Sheet: Comandos REA' : 'Cheat Sheet: REA Commands', type: 'PDF', size: '890 KB', icon: '📋', desc: lang === 'es' ? 'Referencia rápida de todos los comandos' : 'Quick reference of all commands' },
    { title: lang === 'es' ? 'Video: Demo en 5 minutos' : 'Video: 5-Minute Demo', type: 'MP4', size: '45 MB', icon: '🎬', desc: lang === 'es' ? 'Tutorial rápido para empezar' : 'Quick start tutorial' },
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-green-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Recursos Gratuitos' : 'Free Resources'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Material descargable para profundizar en ingeniería inversa' : 'Downloadable material to dive deeper into reverse engineering'}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, i) => (
            <AnimatedSection key={i} delay={i * 100}>
              <div className={`group rounded-2xl p-6 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-white border-green-100 hover:border-green-400'}`}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{res.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${dark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>{res.type}</span>
                  <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{res.size}</span>
                </div>
                <h3 className={`font-bold mb-2 ${dark ? 'text-white' : 'text-green-900'}`}>{res.title}</h3>
                <p className={`text-sm mb-4 flex-grow ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{res.desc}</p>
                <button className={`w-full py-2 rounded-full text-sm font-semibold transition-all ${dark ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                  ↓ {lang === 'es' ? 'Descargar' : 'Download'}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
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
    <section id="pricing" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-white'}`}>
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
    { q: '¿Necesito experiencia en ingeniería inversa?', a: 'No. Solo necesitas un agente de codificación y hacer preguntas en lenguaje natural.' },
    { q: '¿Qué lenguajes soporta?', a: 'Soportamos binarios nativos (x64, ARM), JavaScript/TypeScript, Electron, Android, Python, C, C++, Rust y más.' },
    { q: '¿Es legal?', a: 'Sí, siempre que respetes los términos de servicio y las leyes aplicables en tu jurisdicción.' },
    { q: '¿Puedo usarlo en mi empresa?', a: 'Absolutamente. Ofrecemos planes Enterprise con despliegue on-premise y soporte dedicado.' },
  ] : [
    { q: 'What is Al Andalus AI?', a: 'It\'s an AI-powered reverse engineering tool that allows your coding agent to inspect, understand and rebuild any software.' },
    { q: 'Do I need reverse engineering experience?', a: 'No. You just need a coding agent and ask questions in natural language.' },
    { q: 'What languages does it support?', a: 'We support native binaries (x64, ARM), JavaScript/TypeScript, Electron, Android, Python, C, C++, Rust and more.' },
    { q: 'Is it legal?', a: 'Yes, as long as you respect the terms of service and applicable laws in your jurisdiction.' },
    { q: 'Can I use it in my company?', a: 'Absolutely. We offer Enterprise plans with on-premise deployment and dedicated support.' },
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
      <StatsSection dark={dark} />
      <FeaturesSection dark={dark} />
      <InteractiveMap dark={dark} />
      <InteractiveTerminal dark={dark} />
      <RealTimeCounter dark={dark} />
      <CodeTypewriterSection dark={dark} />
      <TechStackSection dark={dark} />
      <IntegrationsSection dark={dark} />
      <ResourcesSection dark={dark} />
      <PricingSection dark={dark} />
      <FAQSection dark={dark} />
      <NewsletterSection dark={dark} />
      <Footer dark={dark} />
      <BackToTop dark={dark} />
    </div>
  );
}
