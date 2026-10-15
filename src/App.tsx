import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════
   AL ANDALUS AI CORP — FASE 3
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

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const h = () => setOffset(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return offset;
}

/* ─────────────── Language Context ─────────────── */

type Lang = 'es' | 'en';

const translations = {
  es: {
    nav: { features: 'Características', howItWorks: 'Cómo Funciona', dinoLab: 'Dino Lab', calculator: 'Calculadora', blog: 'Blog', pricing: 'Precios', faq: 'FAQ' },
    hero: { badge: 'Ingeniería Inversa con IA', title1: 'Descubre cómo', title2: 'funciona el software', desc: 'Pregunta a tu agente de IA sobre una app, un juego o un sitio web. Al Andalus AI le da las herramientas para inspeccionar el código detrás de la respuesta.', cta1: 'Comenzar ahora', cta2: 'Ver ejemplos', users: 'desarrolladores confían en nosotros' },
    stats: { devs: 'Desarrolladores', projects: 'Proyectos Analizados', languages: 'Lenguajes Soportados', accuracy: 'Precisión de Análisis' },
    features: { title: 'Herramientas Poderosas', desc: 'Todo lo que necesitas para entender, analizar y reconstruir cualquier software' },
    howItWorks: { title: '¿Cómo Funciona?', desc: 'Ingeniería inversa significa aprender cómo funciona el software inspeccionando el programa mismo', step1: 'Pregunta sobre una funcionalidad', step1d: 'Dale a tu agente un programa o página y una pregunta.', step2: 'Inspecciona el programa', step2d: 'Al Andalus AI devuelve código, referencias y observaciones en tiempo real.', step3: 'Explícalo y prueba un cambio', step3d: 'Tu agente usa los hallazgos para explicar o reconstruir la funcionalidad.' },
    dino: { badge: 'Ejemplo Interactivo 01', title: '¿Por qué el dinosaurio se acelera?', desc: 'El juego se acelera mientras corres. Reconstruimos esa regla y añadimos un control de velocidad.', play: '▶ Jugar', restart: '🔄 Reiniciar', jump: '⬆ Saltar', score: 'Score:', best: 'Mejor:', gameOver: '¡Game Over!', manualSpeed: 'Control de velocidad manual', activate: 'Activar', slow: 'Lento (3)', fast: 'Rápido (20)', speed: 'Velocidad:', code: '📄 Código original recuperado por Al Andalus AI:' },
    calc: { badge: 'Ejemplo Interactivo 02', title: 'Reconstruye el botón % de la Calculadora', desc: 'El botón % hace cosas distintas después de + y ×. Descubre ambas reglas.', chooseOp: 'Elige operación:', with: 'Con', takesPercent: 'Toma un porcentaje del primer número.', convertsDecimal: 'Convierte el porcentaje a decimal.', result: 'Resultado del análisis', whatDoes: '¿Qué hace el botón %?', press: 'Pulsa', toSee: 'para ver qué le pasa al 10', codeRecovered: '📄 Código recuperado por Al Andalus AI:' },
    testimonials: { title: 'Lo que dicen nuestros usuarios', desc: 'Miles de desarrolladores confían en Al Andalus AI para sus proyectos' },
    blog: { title: 'Últimas Novedades', desc: 'Artículos, tutoriales y casos de estudio del equipo de Al Andalus AI', readMore: 'Leer más', minRead: 'min lectura' },
    pricing: { title: 'Planes y Precios', desc: 'Elige el plan que mejor se adapte a tu equipo', monthly: 'Mensual', annual: 'Anual', discount: '(-25%)', mostPopular: '⭐ MÁS POPULAR', perMonth: '/mes' },
    faq: { title: 'Preguntas Frecuentes', desc: 'Todo lo que necesitas saber sobre Al Andalus AI' },
    partners: { title: 'Confían en Nosotros', desc: 'Empresas líderes que usan Al Andalus AI' },
    timeline: { title: 'Nuestra Historia', desc: 'El camino de Al Andalus AI desde sus inicios' },
    beforeAfter: { title: 'Antes vs Después', desc: 'Descubre la diferencia que hace Al Andalus AI', before: 'Antes', after: 'Después', drag: '← Arrastra para comparar →' },
    chat: { title: 'Prueba Al Andalus AI', desc: 'Experimenta una conversación con nuestro agente de IA', placeholder: 'Pregunta algo sobre ingeniería inversa...', send: 'Enviar', thinking: 'Analizando...', welcome: '¡Hola! Soy el agente de Al Andalus AI. Puedo ayudarte a entender cualquier software. ¿Qué te gustaría analizar?' },
    setup: { title: 'Configura Al Andalus AI', desc: 'Copia esto en tu agente de codificación', otherOptions: '¿Otras opciones de instalación?', copied: '✓ Copiado', copy: 'Copiar' },
    newsletter: { title: 'Únete a la revolución', desc: 'Recibe las últimas novedades, tutoriales y casos de estudio directamente en tu bandeja de entrada.', subscribe: 'Suscribirme', placeholder: 'tu@email.com', noSpam: 'Sin spam. Cancela cuando quieras.', welcome: '¡Bienvenido a Al Andalus AI!', checkInbox: 'Revisa tu bandeja de entrada para confirmar.' },
    footer: { resources: 'Recursos', community: 'Comunidad', rights: '© 2026 Al Andalus AI Corp. Todos los derechos reservados.', madeWith: 'Hecho con orgullo andaluz' },
  },
  en: {
    nav: { features: 'Features', howItWorks: 'How It Works', dinoLab: 'Dino Lab', calculator: 'Calculator', blog: 'Blog', pricing: 'Pricing', faq: 'FAQ' },
    hero: { badge: 'Reverse Engineering with AI', title1: 'Find out how', title2: 'software works', desc: 'Ask your coding agent about an app, a game or a website. Al Andalus AI gives it the tools to inspect the code behind the answer.', cta1: 'Get started', cta2: 'See examples', users: 'developers trust us' },
    stats: { devs: 'Developers', projects: 'Projects Analyzed', languages: 'Languages Supported', accuracy: 'Analysis Accuracy' },
    features: { title: 'Powerful Tools', desc: 'Everything you need to understand, analyze and rebuild any software' },
    howItWorks: { title: 'How It Works?', desc: 'Reverse engineering means learning how software works by inspecting the program itself', step1: 'Ask about a feature', step1d: 'Give your agent a program or page and a question.', step2: 'Inspect the program', step2d: 'Al Andalus AI returns code, references and runtime observations.', step3: 'Explain it, then try a change', step3d: 'Your agent uses the findings to explain or rebuild the feature.' },
    dino: { badge: 'Interactive Example 01', title: 'Why does the dinosaur get faster?', desc: 'The game gets faster as you run. We rebuilt that rule and added a speed control.', play: '▶ Play', restart: '🔄 Restart', jump: '⬆ Jump', score: 'Score:', best: 'Best:', gameOver: 'Game Over!', manualSpeed: 'Manual speed control', activate: 'Activate', slow: 'Slow (3)', fast: 'Fast (20)', speed: 'Speed:', code: '📄 Original code recovered by Al Andalus AI:' },
    calc: { badge: 'Interactive Example 02', title: 'Rebuild Calculator\'s % button', desc: 'The % button does different things after + and ×. Let\'s find both rules.', chooseOp: 'Choose operation:', with: 'With', takesPercent: 'Take a percentage of the first number.', convertsDecimal: 'Turn percentage into decimal.', result: 'Analysis result', whatDoes: 'What does the % button do?', press: 'Press', toSee: 'to see what happens to 10', codeRecovered: '📄 Code recovered by Al Andalus AI:' },
    testimonials: { title: 'What our users say', desc: 'Thousands of developers trust Al Andalus AI for their projects' },
    blog: { title: 'Latest News', desc: 'Articles, tutorials and case studies from the Al Andalus AI team', readMore: 'Read more', minRead: 'min read' },
    pricing: { title: 'Plans & Pricing', desc: 'Choose the plan that best fits your team', monthly: 'Monthly', annual: 'Annual', discount: '(-25%)', mostPopular: '⭐ MOST POPULAR', perMonth: '/month' },
    faq: { title: 'Frequently Asked Questions', desc: 'Everything you need to know about Al Andalus AI' },
    partners: { title: 'Trusted By', desc: 'Leading companies using Al Andalus AI' },
    timeline: { title: 'Our Story', desc: 'The journey of Al Andalus AI from its beginnings' },
    beforeAfter: { title: 'Before vs After', desc: 'Discover the difference Al Andalus AI makes', before: 'Before', after: 'After', drag: '← Drag to compare →' },
    chat: { title: 'Try Al Andalus AI', desc: 'Experience a conversation with our AI agent', placeholder: 'Ask something about reverse engineering...', send: 'Send', thinking: 'Analyzing...', welcome: 'Hello! I\'m the Al Andalus AI agent. I can help you understand any software. What would you like to analyze?' },
    setup: { title: 'Set up Al Andalus AI', desc: 'Copy this into your coding agent', otherOptions: 'Other install options?', copied: '✓ Copied', copy: 'Copy' },
    newsletter: { title: 'Join the revolution', desc: 'Get the latest news, tutorials and case studies directly in your inbox.', subscribe: 'Subscribe', placeholder: 'your@email.com', noSpam: 'No spam. Cancel anytime.', welcome: 'Welcome to Al Andalus AI!', checkInbox: 'Check your inbox to confirm.' },
    footer: { resources: 'Resources', community: 'Community', rights: '© 2026 Al Andalus AI Corp. All rights reserved.', madeWith: 'Made with Andalusian pride' },
  }
};

function useLanguage() {
  const [lang, setLang] = useState<Lang>('es');
  const t = translations[lang];
  return { lang, setLang, t };
}

/* ─────────────── Animated Section Wrapper ─────────────── */

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

/* ─────────────── Scroll Progress Bar ─────────────── */

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1">
      <div className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 transition-all duration-150 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${progress}%` }} />
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
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:-translate-y-1 ${dark ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`} aria-label="Back to top">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
    </button>
  );
}

/* ─────────────── Navbar ─────────────── */

function Navbar({ dark, toggleTheme, lang, setLang, t }: { dark: boolean; toggleTheme: () => void; lang: Lang; setLang: (l: Lang) => void; t: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);

  const bg = dark ? scrolled ? 'bg-green-950/95 backdrop-blur-md shadow-lg shadow-green-900/20' : 'bg-transparent' : scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent';
  const links = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.howItWorks, href: '#how-it-works' },
    { label: t.nav.dinoLab, href: '#dino-lab' },
    { label: t.nav.calculator, href: '#calculator' },
    { label: t.nav.blog, href: '#blog' },
    { label: t.nav.pricing, href: '#pricing' },
    { label: t.nav.faq, href: '#faq' },
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
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${dark ? 'bg-green-800 text-yellow-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} aria-label="Toggle theme">
                {dark ? '☀️' : '🌙'}
              </button>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-green-700/30 hover:shadow-xl hover:-translate-y-0.5">
              {t.hero.cta1}
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
            <button className="w-full bg-green-700 text-white px-5 py-2.5 rounded-full font-semibold">{t.hero.cta1}</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── Hero ─────────────── */

function HeroSection({ dark, t }: { dark: boolean; t: any }) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'npx al-andalus-ai@latest setup';
  const parallaxOffset = useParallax();

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
      <div className="absolute top-20 right-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-float" style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}></div>
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-emerald-300/10 rounded-full blur-2xl animate-float" style={{ transform: `translateY(${parallaxOffset * -0.05}px)`, animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.06]" style={{ transform: `translate(-50%, calc(-50% + ${parallaxOffset * 0.15}px))` }}>
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
              {t.hero.badge}
            </div>
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] ${dark ? 'text-white' : 'text-green-900'}`}>
              {t.hero.title1}
              <span className="block bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 bg-clip-text text-transparent">{t.hero.title2}</span>
            </h1>
            <p className={`text-xl max-w-lg leading-relaxed ${dark ? 'text-green-300/80' : 'text-green-700/70'}`}>{t.hero.desc}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-green-700/30 hover:shadow-2xl hover:-translate-y-1">
                {t.hero.cta1}<span className="inline-block ml-2 transition-transform group-hover:translate-x-2">→</span>
              </button>
              <button className={`border-2 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-0.5 ${dark ? 'border-green-500 text-green-400 hover:bg-green-900/50' : 'border-green-700 text-green-700 hover:bg-green-50'}`}>
                {t.hero.cta2} ↓
              </button>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                {['bg-green-400', 'bg-emerald-500', 'bg-green-600', 'bg-teal-500'].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 ${dark ? 'border-green-900' : 'border-white'} shadow-md`}></div>
                ))}
              </div>
              <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}><span className="font-bold">2,500+</span> {t.hero.users}</p>
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
                  <p className="text-green-400 mt-3">✓ {lang === 'es' ? 'Módulos detectados' : 'Modules detected'}: <span className="text-emerald-300">47</span></p>
                  <p className="text-green-400 mt-1">✓ {lang === 'es' ? 'Dependencias mapeadas' : 'Dependencies mapped'}: <span className="text-emerald-300">128</span></p>
                  <p className="text-green-400 mt-1">✓ {lang === 'es' ? 'Rutas encontradas' : 'Routes found'}: <span className="text-emerald-300">23</span></p>
                  <p className="text-green-400 mt-1">✓ {lang === 'es' ? 'Funciones críticas' : 'Critical functions'}: <span className="text-emerald-300">89</span></p>
                  <p className="text-yellow-300 mt-3 animate-pulse">⟳ {lang === 'es' ? 'Generando informe...' : 'Generating report...'}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ n: '47', l: lang === 'es' ? 'Módulos' : 'Modules' }, { n: '128', l: lang === 'es' ? 'Dependencias' : 'Deps' }, { n: '89', l: lang === 'es' ? 'Funciones' : 'Functions' }].map((s, i) => (
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

/* ─────────────── Stats ─────────────── */

function StatsSection({ dark, t }: { dark: boolean; t: any }) {
  const { ref, inView } = useInView(0.3);
  const devs = useCountUp(2500, 2000, inView);
  const projects = useCountUp(15000, 2500, inView);
  const languages = useCountUp(42, 1500, inView);
  const accuracy = useCountUp(99, 2000, inView);
  const stats = [
    { value: devs, suffix: '+', label: t.stats.devs, icon: '👨‍💻' },
    { value: projects, suffix: '+', label: t.stats.projects, icon: '📊' },
    { value: languages, suffix: '', label: t.stats.languages, icon: '🌐' },
    { value: accuracy, suffix: '%', label: t.stats.accuracy, icon: '🎯' },
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

function FeaturesSection({ dark, t }: { dark: boolean; t: any }) {
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
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.features.title}</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.features.desc}</p>
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

function HowItWorksSection({ dark, t }: { dark: boolean; t: any }) {
  const steps = [
    { n: '01', t: t.howItWorks.step1, d: t.howItWorks.step1d, icon: '💬' },
    { n: '02', t: t.howItWorks.step2, d: t.howItWorks.step2d, icon: '🔬' },
    { n: '03', t: t.howItWorks.step3, d: t.howItWorks.step3d, icon: '🚀' },
  ];
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-green-800 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg viewBox="0 0 1200 120" className="w-full h-32 text-green-950" preserveAspectRatio="none">
          <path d="M0 120 L0 80 Q100 20 200 80 Q300 20 400 80 Q500 20 600 80 Q700 20 800 80 Q900 20 1000 80 Q1100 20 1200 80 L1200 120 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">{t.howItWorks.title}</h2>
            <p className="text-xl text-green-200/70 max-w-2xl mx-auto">{t.howItWorks.desc}</p>
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

function DinoGame({ dark, t }: { dark: boolean; t: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6);
  const [manualSpeed, setManualSpeed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef({ dinoY: 0, velocity: 0, cactusX: 400, speed: 6, score: 0, frame: 0 });
  const animRef = useRef<number>(0);
  const GROUND_Y = 130, DINO_X = 50, DINO_W = 30, DINO_H = 40, CACTUS_W = 20, CACTUS_H = 40, GRAVITY = 0.6, JUMP_FORCE = -12, CANVAS_W = 500, CANVAS_H = 170;

  const jump = useCallback(() => { const g = gameRef.current; if (g.dinoY >= GROUND_Y - DINO_H) g.velocity = JUMP_FORCE; }, []);
  const startGame = useCallback(() => { const g = gameRef.current; g.dinoY = GROUND_Y - DINO_H; g.velocity = 0; g.cactusX = CANVAS_W; g.speed = manualSpeed ? speed : 6; g.score = 0; g.frame = 0; setPlaying(true); setGameOver(false); setScore(0); }, [speed, manualSpeed]);

  useEffect(() => {
    if (!playing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const g = gameRef.current;
    const handleKey = (e: KeyboardEvent) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } };
    window.addEventListener('keydown', handleKey);
    const loop = () => {
      g.frame++; g.velocity += GRAVITY; g.dinoY += g.velocity;
      if (g.dinoY >= GROUND_Y - DINO_H) { g.dinoY = GROUND_Y - DINO_H; g.velocity = 0; }
      g.cactusX -= g.speed * 0.5;
      if (g.cactusX < -CACTUS_W) { g.cactusX = CANVAS_W + Math.random() * 200; g.score++; setScore(g.score); }
      if (!manualSpeed && g.speed < 13) g.speed += 0.001;
      if (DINO_X + DINO_W > g.cactusX && DINO_X < g.cactusX + CACTUS_W && g.dinoY + DINO_H > GROUND_Y - CACTUS_H) { setPlaying(false); setGameOver(true); setHighScore(prev => Math.max(prev, g.score)); return; }
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.strokeStyle = dark ? '#4ade80' : '#166534'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke();
      for (let i = 0; i < CANVAS_W; i += 20) { const offset = (i + g.frame * g.speed * 0.3) % CANVAS_W; ctx.fillStyle = dark ? '#4ade8040' : '#16653430'; ctx.fillRect(CANVAS_W - offset, GROUND_Y + 5, 8, 2); }
      ctx.fillStyle = dark ? '#4ade80' : '#15803d'; ctx.fillRect(DINO_X, g.dinoY, DINO_W, DINO_H);
      ctx.fillStyle = dark ? '#000' : '#fff'; ctx.fillRect(DINO_X + 20, g.dinoY + 8, 5, 5);
      const legOffset = Math.sin(g.frame * 0.3) * 4;
      ctx.fillStyle = dark ? '#4ade80' : '#15803d';
      ctx.fillRect(DINO_X + 5, g.dinoY + DINO_H, 6, 6 + (g.dinoY < GROUND_Y - DINO_H ? 0 : legOffset));
      ctx.fillRect(DINO_X + 18, g.dinoY + DINO_H, 6, 6 + (g.dinoY < GROUND_Y - DINO_H ? 0 : -legOffset));
      ctx.fillStyle = dark ? '#22c55e' : '#166534';
      ctx.fillRect(g.cactusX, GROUND_Y - CACTUS_H, CACTUS_W, CACTUS_H);
      ctx.fillRect(g.cactusX - 6, GROUND_Y - CACTUS_H + 10, 8, 15);
      ctx.fillRect(g.cactusX + CACTUS_W - 2, GROUND_Y - CACTUS_H + 5, 8, 12);
      ctx.fillStyle = dark ? '#4ade80' : '#166534'; ctx.font = 'bold 14px monospace';
      ctx.fillText(`${t.dino.score} ${g.score}`, CANVAS_W - 100, 25);
      ctx.fillText(`${t.dino.speed} ${g.speed.toFixed(1)}`, 10, 25);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('keydown', handleKey); };
  }, [playing, dark, jump, t.dino.score, t.dino.speed]);

  return (
    <section id="dino-lab" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-gradient-to-b from-green-50 to-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${dark ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-700'}`}>{t.dino.badge}</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.dino.title}</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.dino.desc}</p>
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
                  {gameOver ? t.dino.restart : t.dino.play}
                </button>
              ) : (
                <button onClick={jump} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover:-translate-y-0.5">{t.dino.jump}</button>
              )}
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${dark ? 'bg-green-800/50' : 'bg-green-50'}`}>
                <span className={`text-sm font-medium ${dark ? 'text-green-300' : 'text-green-700'}`}>{t.dino.score}</span>
                <span className="text-lg font-black text-green-500">{score}</span>
              </div>
              {highScore > 0 && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${dark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                  <span className="text-yellow-500">🏆</span>
                  <span className="text-sm font-bold text-yellow-600">{t.dino.best} {highScore}</span>
                </div>
              )}
              {gameOver && <span className="text-red-500 font-bold animate-pulse">{t.dino.gameOver}</span>}
            </div>
            <div className={`rounded-xl p-5 ${dark ? 'bg-green-800/30 border border-green-700/50' : 'bg-green-50 border border-green-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <label className={`font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>{t.dino.manualSpeed}</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={manualSpeed} onChange={() => setManualSpeed(!manualSpeed)} className="w-4 h-4 accent-green-600" />
                  <span className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>{t.dino.activate}</span>
                </label>
              </div>
              <input type="range" min="3" max="20" step="0.5" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} disabled={!manualSpeed} className="w-full accent-green-600 h-2 rounded-full cursor-pointer disabled:opacity-40" />
              <div className="flex justify-between mt-2">
                <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{t.dino.slow}</span>
                <span className={`text-sm font-bold ${dark ? 'text-green-400' : 'text-green-700'}`}>{t.dino.speed} {speed.toFixed(1)}</span>
                <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{t.dino.fast}</span>
              </div>
            </div>
            <div className="mt-6">
              <p className={`text-sm font-semibold mb-2 ${dark ? 'text-green-400' : 'text-green-700'}`}>{t.dino.code}</p>
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

function CalculatorDemo({ dark, t }: { dark: boolean; t: any }) {
  const [display, setDisplay] = useState('200');
  const [prev, setPrev] = useState<number | null>(200);
  const [current, setCurrent] = useState('10');
  const [operation, setOperation] = useState<'+' | '×'>('+');
  const [result, setResult] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handlePercent = () => { const curr = parseFloat(current); const p = prev; let percentResult: number; if (operation === '×') percentResult = curr / 100; else percentResult = (curr * (p || 0)) / 100; setResult(percentResult.toString()); setShowExplanation(true); };
  const handleEquals = () => { const p = prev || 0; const c = parseFloat(result || current); const res = operation === '+' ? p + c : p * c; setDisplay(res.toString()); };
  const reset = () => { setDisplay('200'); setPrev(200); setCurrent('10'); setResult(null); setShowExplanation(false); };

  return (
    <section id="calculator" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/30' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${dark ? 'bg-green-800/50 text-green-300' : 'bg-green-100 text-green-700'}`}>{t.calc.badge}</span>
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.calc.title}</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.calc.desc}</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection>
            <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
              <h3 className={`text-lg font-bold mb-6 ${dark ? 'text-white' : 'text-green-900'}`}>{t.calc.chooseOp}</h3>
              <div className="flex gap-4 mb-8">
                {(['+', '×'] as const).map(op => (
                  <button key={op} onClick={() => { setOperation(op); reset(); }} className={`flex-1 py-4 rounded-xl font-bold text-2xl transition-all ${operation === op ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-700/30' : dark ? 'bg-green-800/50 text-green-400 hover:bg-green-800' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>{op}</button>
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
              <p className={`text-sm mt-4 text-center ${dark ? 'text-green-500/60' : 'text-green-600/60'}`}>{t.calc.press} <strong>%</strong> {t.calc.toSee}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="space-y-6">
              <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
                <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{showExplanation ? `📊 ${t.calc.result}` : `💡 ${t.calc.whatDoes}`}</h3>
                {!showExplanation ? (
                  <div className="space-y-4">
                    <div className={`rounded-xl p-4 ${dark ? 'bg-green-800/30' : 'bg-green-50'}`}>
                      <p className={`font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>{t.calc.with} +</p>
                      <p className={`text-sm ${dark ? 'text-green-400/70' : 'text-green-600'}`}>{t.calc.takesPercent}<br /><code className="font-mono bg-green-900/30 px-2 py-0.5 rounded">10% {lang === 'es' ? 'de' : 'of'} 200 = 20 → 200 + 20 = 220</code></p>
                    </div>
                    <div className={`rounded-xl p-4 ${dark ? 'bg-green-800/30' : 'bg-green-50'}`}>
                      <p className={`font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>{t.calc.with} ×</p>
                      <p className={`text-sm ${dark ? 'text-green-400/70' : 'text-green-600'}`}>{t.calc.convertsDecimal}<br /><code className="font-mono bg-green-900/30 px-2 py-0.5 rounded">200 × 0.1 = 20</code></p>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-xl p-5 ${dark ? 'bg-green-800/40 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`font-bold text-lg mb-2 ${dark ? 'text-green-300' : 'text-green-800'}`}>{operation === '+' ? `10% ${lang === 'es' ? 'de' : 'of'} 200 = ${result}` : `10% → ${result}`}</p>
                    <p className={`text-sm ${dark ? 'text-green-400/70' : 'text-green-600'}`}>{operation === '+' ? (lang === 'es' ? 'El % toma un porcentaje del primer número (200 × 10 / 100 = 20)' : 'The % takes a percentage of the first number (200 × 10 / 100 = 20)') : (lang === 'es' ? 'El % convierte el porcentaje a decimal (10 / 100 = 0.1)' : 'The % converts percentage to decimal (10 / 100 = 0.1)')}</p>
                  </div>
                )}
              </div>
              <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
                <p className={`text-sm font-semibold mb-3 ${dark ? 'text-green-400' : 'text-green-700'}`}>{t.calc.codeRecovered}</p>
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

/* ─────────────── Blog Section (NEW) ─────────────── */

function BlogSection({ dark, t }: { dark: boolean; t: any }) {
  const posts = [
    { title: lang === 'es' ? 'Análisis profundo de APKs de Android' : 'Deep Android APK Analysis', excerpt: lang === 'es' ? 'Descubre cómo rastreamos códigos de autenticación a través de aplicaciones Android publicadas.' : 'Discover how we trace authentication codes through published Android apps.', date: '2026-01-15', readTime: 8, category: lang === 'es' ? 'Tutorial' : 'Tutorial', image: '📱' },
    { title: lang === 'es' ? 'Reconstrucción de juegos clásicos' : 'Classic Game Reconstruction', excerpt: lang === 'es' ? 'Cómo recuperamos la lógica de juego de títulos clásicos usando ingeniería inversa asistida por IA.' : 'How we recover game logic from classic titles using AI-assisted reverse engineering.', date: '2026-01-10', readTime: 12, category: lang === 'es' ? 'Caso de Estudio' : 'Case Study', image: '🎮' },
    { title: lang === 'es' ? 'Nuevas características en v2.5' : 'New Features in v2.5', excerpt: lang === 'es' ? 'Presentamos soporte para Rust, análisis de WebAssembly y mejoras de rendimiento del 300%.' : 'Introducing Rust support, WebAssembly analysis, and 300% performance improvements.', date: '2026-01-05', readTime: 5, category: lang === 'es' ? 'Anuncio' : 'Announcement', image: '🚀' },
  ];

  return (
    <section id="blog" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.blog.title}</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.blog.desc}</p>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <article className={`group rounded-2xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-white border-green-100 hover:border-green-400'}`}>
                <div className={`h-48 flex items-center justify-center text-6xl ${dark ? 'bg-green-800/30' : 'bg-gradient-to-br from-green-100 to-green-200'}`}>
                  {post.image}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>{post.category}</span>
                    <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{post.date}</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 group-hover:text-green-500 transition-colors ${dark ? 'text-white' : 'text-green-900'}`}>{post.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 flex-grow ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{post.readTime} {t.blog.minRead}</span>
                    <button className={`text-sm font-semibold flex items-center transition-colors ${dark ? 'text-green-400 hover:text-green-300' : 'text-green-700 hover:text-green-500'}`}>
                      {t.blog.readMore} <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Testimonials ─────────────── */

function TestimonialsSection({ dark, t }: { dark: boolean; t: any }) {
  const [active, setActive] = useState(0);
  const testimonials = [
    { name: 'María García', role: 'Lead Developer @ TechSevilla', text: lang === 'es' ? 'Al Andalus AI transformó nuestra forma de entender código legacy. Lo que antes tomaba semanas ahora lo resolvemos en horas.' : 'Al Andalus AI transformed how we understand legacy code. What used to take weeks we now solve in hours.', avatar: '👩‍💻' },
    { name: 'Ahmed Al-Rashid', role: 'Security Researcher', text: lang === 'es' ? 'La precisión del análisis de binarios es impresionante. Encontramos vulnerabilidades que otras herramientas no detectaron.' : 'The precision of binary analysis is impressive. We found vulnerabilities other tools didn\'t detect.', avatar: '🧑‍💻' },
    { name: 'Carlos Ruiz', role: 'CTO @ Córdoba Digital', text: lang === 'es' ? 'Desde que usamos Al Andalus AI, nuestro equipo de reverse engineering es 3x más productivo. Una herramienta indispensable.' : 'Since we started using Al Andalus AI, our reverse engineering team is 3x more productive. An indispensable tool.', avatar: '👨‍💼' },
    { name: 'Lucía Fernández', role: 'Game Developer', text: lang === 'es' ? 'Pude reconstruir la lógica de un juego clásico en días. La reconstrucción asistida por IA es magia pura.' : 'I was able to reconstruct a classic game\'s logic in days. AI-assisted reconstruction is pure magic.', avatar: '👩‍🎨' },
  ];
  useEffect(() => { const interval = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000); return () => clearInterval(interval); }, [testimonials.length]);

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.testimonials.title}</h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.testimonials.desc}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className={`rounded-3xl p-8 sm:p-12 shadow-2xl border relative overflow-hidden ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="absolute top-6 left-8 text-6xl text-green-200/30 font-serif">"</div>
            <div className="relative z-10 min-h-[200px]">
              {testimonials.map((te, i) => (
                <div key={i} className={`transition-all duration-700 ${i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'}`}>
                  {i === active && (
                    <>
                      <p className={`text-xl sm:text-2xl leading-relaxed mb-8 ${dark ? 'text-green-200' : 'text-green-800'}`}>"{te.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl shadow-lg">{te.avatar}</div>
                        <div>
                          <p className={`font-bold ${dark ? 'text-white' : 'text-green-900'}`}>{te.name}</p>
                          <p className={`text-sm ${dark ? 'text-green-400' : 'text-green-600'}`}>{te.role}</p>
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

/* ─────────────── Partners (NEW) ─────────────── */

function PartnersSection({ dark, t }: { dark: boolean; t: any }) {
  const partners = ['TechCorp', 'InnovateSL', 'DevStudio', 'CodeLabs', 'DigitalSevilla', 'ByteFactory', 'CloudAndalus', 'DataMálaga'];
  return (
    <section className={`py-20 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${dark ? 'text-white' : 'text-green-900'}`}>{t.partners.title}</h2>
            <p className={`text-lg ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.partners.desc}</p>
          </div>
        </AnimatedSection>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {[...partners, ...partners].map((partner, i) => (
              <div key={i} className={`flex-shrink-0 mx-8 px-8 py-4 rounded-xl ${dark ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-100'}`}>
                <span className={`text-lg font-bold whitespace-nowrap ${dark ? 'text-green-400' : 'text-green-700'}`}>{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Timeline (NEW) ─────────────── */

function TimelineSection({ dark, t }: { dark: boolean; t: any }) {
  const events = [
    { year: '2023', title: lang === 'es' ? 'Fundación' : 'Founded', desc: lang === 'es' ? 'Al Andalus AI nace en Sevilla con la misión de democratizar la ingeniería inversa.' : 'Al Andalus AI is born in Seville with the mission to democratize reverse engineering.' },
    { year: '2024', title: lang === 'es' ? 'Primer Lanzamiento' : 'First Release', desc: lang === 'es' ? 'Lanzamiento de la v1.0 con soporte para JavaScript y binarios nativos.' : 'v1.0 release with JavaScript and native binary support.' },
    { year: '2025', title: lang === 'es' ? 'Expansión Global' : 'Global Expansion', desc: lang === 'es' ? 'Alcanzamos 1,000+ desarrolladores y añadimos soporte para Android y Electron.' : 'We reach 1,000+ developers and add Android and Electron support.' },
    { year: '2026', title: lang === 'es' ? 'IA Generativa' : 'Generative AI', desc: lang === 'es' ? 'Integración de IA generativa para reconstrucción automática de código.' : 'Generative AI integration for automatic code reconstruction.' },
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.timeline.title}</h2>
            <p className={`text-xl ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.timeline.desc}</p>
          </div>
        </AnimatedSection>
        <div className="relative">
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${dark ? 'bg-green-700' : 'bg-green-200'}`}></div>
          {events.map((event, i) => (
            <AnimatedSection key={i} delay={i * 200}>
              <div className={`relative flex items-center mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-2 ${dark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>{event.year}</div>
                  <h3 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-green-900'}`}>{event.title}</h3>
                  <p className={`${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{event.desc}</p>
                </div>
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${dark ? 'bg-green-600 border-4 border-green-900' : 'bg-green-500 border-4 border-white'} shadow-lg`}></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Before/After (NEW) ─────────────── */

function BeforeAfterSection({ dark, t }: { dark: boolean; t: any }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
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

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.beforeAfter.title}</h2>
            <p className={`text-xl ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.beforeAfter.desc}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div ref={containerRef} className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${dark ? 'border-green-700' : 'border-green-200'} h-[400px] cursor-ew-resize select-none`} onMouseDown={() => setIsDragging(true)} onTouchStart={() => setIsDragging(true)}>
            {/* Before */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">😰</div>
                <h3 className="text-3xl font-bold mb-2">{t.beforeAfter.before}</h3>
                <p className="text-gray-400">{lang === 'es' ? 'Semanas analizando código manualmente' : 'Weeks analyzing code manually'}</p>
              </div>
            </div>
            {/* After */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-3xl font-bold mb-2">{t.beforeAfter.after}</h3>
                <p className="text-green-100">{lang === 'es' ? 'Horas con Al Andalus AI' : 'Hours with Al Andalus AI'}</p>
              </div>
            </div>
            {/* Slider */}
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">{t.beforeAfter.before}</div>
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">{t.beforeAfter.after}</div>
          </div>
          <p className={`text-center mt-4 text-sm ${dark ? 'text-green-500' : 'text-green-600'}`}>{t.beforeAfter.drag}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Chat Demo (NEW) ─────────────── */

function ChatDemoSection({ dark, t }: { dark: boolean; t: any }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([{ role: 'ai', text: t.chat.welcome }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const responses = lang === 'es' ? [
        'He analizado el código y encontré que la función principal usa un algoritmo de ordenación quicksort con complejidad O(n log n).',
        'El módulo de autenticación implementa JWT con refresh tokens. La expiración está configurada a 15 minutos.',
        'He mapeado 47 dependencias y encontrado 3 posibles vulnerabilidades de seguridad en el manejo de entradas.',
      ] : [
        'I\'ve analyzed the code and found that the main function uses a quicksort algorithm with O(n log n) complexity.',
        'The authentication module implements JWT with refresh tokens. Expiration is set to 15 minutes.',
        'I\'ve mapped 47 dependencies and found 3 possible security vulnerabilities in input handling.',
      ];
      setMessages(prev => [...prev, { role: 'ai', text: responses[Math.floor(Math.random() * responses.length)] }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.chat.title}</h2>
            <p className={`text-xl ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.chat.desc}</p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className={`rounded-3xl shadow-2xl border overflow-hidden ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className={`p-4 border-b ${dark ? 'bg-green-800/30 border-green-700' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                  <Star8 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold ${dark ? 'text-white' : 'text-green-900'}`}>Al Andalus AI Agent</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</p>
                </div>
              </div>
            </div>
            <div className={`h-96 overflow-y-auto p-6 space-y-4 ${dark ? 'bg-green-950/50' : 'bg-gray-50'}`}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-green-600 text-white' : dark ? 'bg-green-800 text-green-100' : 'bg-white text-green-900 shadow-md'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 ${dark ? 'bg-green-800' : 'bg-white shadow-md'}`}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={`p-4 border-t ${dark ? 'bg-green-900/30 border-green-700' : 'bg-white border-green-200'}`}>
              <div className="flex gap-3">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder={t.chat.placeholder} className={`flex-1 px-4 py-3 rounded-full border ${dark ? 'bg-green-800/50 border-green-700 text-white placeholder-green-500' : 'bg-gray-50 border-green-200 text-green-900 placeholder-green-400'} focus:outline-none focus:border-green-500`} />
                <button onClick={sendMessage} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                  {t.chat.send}
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Pricing ─────────────── */

function PricingSection({ dark, t }: { dark: boolean; t: any }) {
  const [annual, setAnnual] = useState(true);
  const plans = [
    { name: lang === 'es' ? 'Explorador' : 'Explorer', desc: lang === 'es' ? 'Para desarrolladores individuales' : 'For individual developers', price: 0, features: lang === 'es' ? ['Análisis básico de código', '5 investigaciones/mes', 'Soporte por email', 'Acceso a guías'] : ['Basic code analysis', '5 investigations/month', 'Email support', 'Guide access'], cta: lang === 'es' ? 'Comenzar Gratis' : 'Start Free', popular: false },
    { name: lang === 'es' ? 'Profesional' : 'Professional', desc: lang === 'es' ? 'Para equipos de desarrollo' : 'For development teams', price: annual ? 29 : 39, features: lang === 'es' ? ['Análisis avanzado completo', 'Investigaciones ilimitadas', 'Soporte prioritario 24/7', 'API access', 'Integraciones CI/CD', 'Binarios nativos'] : ['Complete advanced analysis', 'Unlimited investigations', '24/7 priority support', 'API access', 'CI/CD integrations', 'Native binaries'], cta: lang === 'es' ? 'Comenzar Prueba' : 'Start Trial', popular: true },
    { name: 'Enterprise', desc: lang === 'es' ? 'Para grandes organizaciones' : 'For large organizations', price: annual ? 99 : 129, features: lang === 'es' ? ['Todo de Profesional', 'Despliegue on-premise', 'SLA garantizado', 'Entrenamiento personalizado', 'Gestor de cuenta dedicado', 'Auditorías de seguridad'] : ['Everything in Professional', 'On-premise deployment', 'Guaranteed SLA', 'Custom training', 'Dedicated account manager', 'Security audits'], cta: lang === 'es' ? 'Contactar Ventas' : 'Contact Sales', popular: false },
  ];

  return (
    <section id="pricing" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.pricing.title}</h2>
            <p className={`text-xl max-w-2xl mx-auto mb-8 ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.pricing.desc}</p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!annual ? (dark ? 'text-white' : 'text-green-900') : (dark ? 'text-green-500' : 'text-green-600')}`}>{t.pricing.monthly}</span>
              <button onClick={() => setAnnual(!annual)} className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-green-600' : dark ? 'bg-green-800' : 'bg-green-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${annual ? 'left-8' : 'left-1'}`} />
              </button>
              <span className={`text-sm font-medium ${annual ? (dark ? 'text-white' : 'text-green-900') : (dark ? 'text-green-500' : 'text-green-600')}`}>{t.pricing.annual} <span className="text-green-500 font-bold">{t.pricing.discount}</span></span>
            </div>
          </div>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className={`relative rounded-3xl p-8 border-2 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'bg-gradient-to-b from-green-600 to-green-800 border-green-500 shadow-2xl shadow-green-700/30 scale-[1.02]' : dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-white border-green-100 hover:border-green-400 hover:shadow-xl'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">{t.pricing.mostPopular}</div>}
                <div className="mb-6">
                  <h3 className={`text-2xl font-black mb-1 ${plan.popular ? 'text-white' : dark ? 'text-white' : 'text-green-900'}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.popular ? 'text-green-200' : dark ? 'text-green-400/70' : 'text-green-600'}`}>{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-white' : dark ? 'text-white' : 'text-green-900'}`}>${plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-green-200' : dark ? 'text-green-400' : 'text-green-600'}`}>{t.pricing.perMonth}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3">
                      <svg className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span className={`text-sm ${plan.popular ? 'text-green-100' : dark ? 'text-green-300' : 'text-green-700'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3.5 rounded-full font-bold transition-all hover:-translate-y-0.5 ${plan.popular ? 'bg-white text-green-700 hover:bg-green-50 shadow-lg' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-700/20'}`}>{plan.cta}</button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ ─────────────── */

function FAQSection({ dark, t }: { dark: boolean; t: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = lang === 'es' ? [
    { q: '¿Qué es Al Andalus AI?', a: 'Al Andalus AI es una herramienta de ingeniería inversa impulsada por inteligencia artificial que permite a tu agente de codificación inspeccionar, entender y reconstruir cualquier software.' },
    { q: '¿Necesito experiencia en ingeniería inversa?', a: 'No. Al Andalus AI está diseñado para que cualquier desarrollador pueda hacer ingeniería inversa. Solo necesitas un agente de codificación y hacer preguntas en lenguaje natural.' },
    { q: '¿Qué lenguajes y plataformas soporta?', a: 'Soportamos binarios nativos (x64, ARM), JavaScript/TypeScript, aplicaciones Electron, APKs de Android, y actividad de navegadores. También analizamos código en Python, C, C++, Rust y más.' },
    { q: '¿Es legal usar Al Andalus AI?', a: 'Sí, siempre que respetes los términos de servicio del software que analizas y las leyes aplicables en tu jurisdicción.' },
    { q: '¿Puedo usarlo en mi empresa?', a: 'Absolutamente. Ofrecemos planes Enterprise con despliegue on-premise, SLA garantizado y soporte dedicado.' },
    { q: '¿Cómo se diferencia de otras herramientas?', a: 'Al Andalus AI combina análisis estático y dinámico con IA generativa. Tu agente no solo ve el código, sino que lo entiende, explica y puede reconstruir funcionalidades completas.' },
  ] : [
    { q: 'What is Al Andalus AI?', a: 'Al Andalus AI is an AI-powered reverse engineering tool that allows your coding agent to inspect, understand and rebuild any software.' },
    { q: 'Do I need reverse engineering experience?', a: 'No. Al Andalus AI is designed so any developer can do reverse engineering. You just need a coding agent and ask questions in natural language.' },
    { q: 'What languages and platforms does it support?', a: 'We support native binaries (x64, ARM), JavaScript/TypeScript, Electron apps, Android APKs, and browser activity. We also analyze code in Python, C, C++, Rust and more.' },
    { q: 'Is it legal to use Al Andalus AI?', a: 'Yes, as long as you respect the terms of service of the software you analyze and the applicable laws in your jurisdiction.' },
    { q: 'Can I use it in my company?', a: 'Absolutely. We offer Enterprise plans with on-premise deployment, guaranteed SLA and dedicated support.' },
    { q: 'How does it differ from other tools?', a: 'Al Andalus AI combines static and dynamic analysis with generative AI. Your agent doesn\'t just see the code, but understands it, explains it and can rebuild complete features.' },
  ];

  return (
    <section id="faq" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.faq.title}</h2>
            <p className={`text-xl ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.faq.desc}</p>
          </div>
        </AnimatedSection>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === i ? dark ? 'bg-green-900/50 border-green-600 shadow-lg shadow-green-900/20' : 'bg-white border-green-400 shadow-lg' : dark ? 'bg-green-900/30 border-green-800 hover:border-green-700' : 'bg-white border-green-100 hover:border-green-300'}`}>
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

/* ─────────────── Setup CTA ─────────────── */

function SetupSection({ dark, t }: { dark: boolean; t: any }) {
  const [copied, setCopied] = useState(false);
  const code = `# ${lang === 'es' ? 'Instala Al Andalus AI y conéctalo a tu agente' : 'Install Al Andalus AI and connect it to your agent'}\nnpx al-andalus-ai@latest setup\n\n# ${lang === 'es' ? 'Muestra el plan de configuración para aprobación' : 'Shows the setup plan for approval'}\n# ${lang === 'es' ? 'luego verifica la instalación' : 'then verify the installation'}`;
  const copyCode = () => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-gradient-to-br from-green-50 to-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className={`rounded-3xl shadow-2xl p-8 sm:p-12 border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>{t.setup.title}</h2>
              <p className={`text-lg ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>{t.setup.desc}</p>
            </div>
            <div className="bg-green-950 rounded-xl p-6 font-mono text-sm relative border border-green-800/50">
              <button onClick={copyCode} className={`absolute top-4 right-4 px-3 py-1 rounded text-xs font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-green-800 text-green-300 hover:bg-green-700 hover:text-white'}`}>
                {copied ? t.setup.copied : t.setup.copy}
              </button>
              <pre className="text-green-300 overflow-x-auto"><code>{code}</code></pre>
            </div>
            <div className="mt-8 text-center">
              <p className={`text-sm mb-4 ${dark ? 'text-green-500' : 'text-green-600'}`}>{t.setup.otherOptions}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className={`font-medium text-sm px-4 py-2 rounded-full transition-all ${dark ? 'text-green-400 border border-green-700 hover:border-green-500 hover:bg-green-800/50' : 'text-green-700 border border-green-200 hover:border-green-400 hover:bg-green-50'}`}>curl →</button>
                <button className={`font-medium text-sm px-4 py-2 rounded-full transition-all ${dark ? 'text-green-400 border border-green-700 hover:border-green-500 hover:bg-green-800/50' : 'text-green-700 border border-green-200 hover:border-green-400 hover:bg-green-50'}`}>{lang === 'es' ? 'Guía paso a paso' : 'Step-by-step guide'} →</button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Newsletter ─────────────── */

function NewsletterSection({ dark, t }: { dark: boolean; t: any }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) { setSubscribed(true); setEmail(''); } };

  return (
    <section className="py-24 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"><GeometricPattern /></div>
      <FloatingParticles dark={true} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <AnimatedSection>
          <Star8 className="w-16 h-16 text-green-300/50 mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">{t.newsletter.title}</h2>
          <p className="text-xl text-green-200/80 mb-8 max-w-xl mx-auto">{t.newsletter.desc}</p>
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.newsletter.placeholder} required className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/20 transition-all backdrop-blur-sm" />
              <button type="submit" className="bg-white text-green-800 px-8 py-3.5 rounded-full font-bold hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5">{t.newsletter.subscribe}</button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-white font-bold text-lg">{t.newsletter.welcome}</p>
              <p className="text-green-200/70 text-sm">{t.newsletter.checkInbox}</p>
            </div>
          )}
          <p className="text-green-300/50 text-xs mt-4">{t.newsletter.noSpam}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer({ dark, t }: { dark: boolean; t: any }) {
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
              {lang === 'es' ? 'Herramientas de ingeniería inversa impulsadas por IA para desarrolladores que quieren entender cómo funciona el software.' : 'AI-powered reverse engineering tools for developers who want to understand how software works.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.resources}</h4>
            <ul className="space-y-2">
              {(lang === 'es' ? ['Documentación', 'Guías', 'Casos de Estudio', 'Blog', 'Precios'] : ['Documentation', 'Guides', 'Case Studies', 'Blog', 'Pricing']).map(l => (
                <li key={l}><a href="#" className="text-green-300/60 hover:text-white transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">{t.footer.community}</h4>
            <ul className="space-y-2">
              {['Discord', 'GitHub', 'FAQ', lang === 'es' ? 'Contacto' : 'Contact', lang === 'es' ? 'Estado' : 'Status'].map(l => (
                <li key={l}><a href="#" className="text-green-300/60 hover:text-white transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-400/50 text-sm">{t.footer.rights}</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-8 h-5 bg-green-700 rounded-sm"></div>
            <div className="w-8 h-5 bg-white rounded-sm border border-green-600"></div>
            <div className="w-8 h-5 bg-green-700 rounded-sm"></div>
            <span className="text-green-400/50 text-xs ml-2">{t.footer.madeWith}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── Easter Egg (Konami Code) ─────────────── */

function useEasterEgg() {
  const [activated, setActivated] = useState(false);
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let currentIndex = 0;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === konamiCode[currentIndex]) {
        currentIndex++;
        if (currentIndex === konamiCode.length) {
          setActivated(true);
          setTimeout(() => setActivated(false), 5000);
          currentIndex = 0;
        }
      } else {
        currentIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  return activated;
}

function EasterEggOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-3xl shadow-2xl animate-scale-in text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-3xl font-black mb-2">{lang === 'es' ? '¡Easter Egg!' : 'Easter Egg!'}</h3>
        <p className="text-xl">{lang === 'es' ? '¡Has encontrado el código Konami!' : 'You found the Konami code!'}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════ */

let lang: Lang = 'es';

export default function App() {
  const { dark, toggle } = useTheme();
  const { lang: currentLang, setLang, t } = useLanguage();
  lang = currentLang;
  const easterEggActive = useEasterEgg();

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${dark ? 'bg-green-950 text-white' : 'bg-white text-green-900'}`}>
      <ScrollProgressBar />
      <Navbar dark={dark} toggleTheme={toggle} lang={currentLang} setLang={setLang} t={t} />
      <HeroSection dark={dark} t={t} />
      <StatsSection dark={dark} t={t} />
      <FeaturesSection dark={dark} t={t} />
      <HowItWorksSection dark={dark} t={t} />
      <DinoGame dark={dark} t={t} />
      <CalculatorDemo dark={dark} t={t} />
      <BeforeAfterSection dark={dark} t={t} />
      <ChatDemoSection dark={dark} t={t} />
      <TestimonialsSection dark={dark} t={t} />
      <BlogSection dark={dark} t={t} />
      <PartnersSection dark={dark} t={t} />
      <TimelineSection dark={dark} t={t} />
      <PricingSection dark={dark} t={t} />
      <FAQSection dark={dark} t={t} />
      <SetupSection dark={dark} t={t} />
      <NewsletterSection dark={dark} t={t} />
      <Footer dark={dark} t={t} />
      <BackToTop dark={dark} />
      <EasterEggOverlay active={easterEggActive} />
    </div>
  );
}
