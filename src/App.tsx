import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════
   AL ANDALUS AI CORP — FASE 7: REVISIÓN COMPLETA
   Optimizado para rendimiento, accesibilidad y mantenimiento
   ═══════════════════════════════════════════════════ */

type Lang = 'es' | 'en';

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
  const particles = useRef(Array.from({ length: 12 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 4 + 2, duration: Math.random() * 10 + 10, delay: Math.random() * 5,
  }))).current;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
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
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:-translate-y-1 ${dark ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'}`} aria-label="Back to top">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
    </button>
  );
}

/* ─────────────── Stats Section ─────────────── */

function StatsSection({ dark, lang }: { dark: boolean; lang: Lang }) {
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

/* ─────────────── Testimonials Section ─────────────── */

function TestimonialsSection({ dark, lang }: { dark: boolean; lang: Lang }) {
  const [active, setActive] = useState(0);
  const testimonials = lang === 'es' ? [
    { name: 'María García', role: 'Lead Developer @ TechSevilla', text: 'Al Andalus AI transformó nuestra forma de entender código legacy. Lo que antes tomaba semanas ahora lo resolvemos en horas.', avatar: '👩‍💻' },
    { name: 'Ahmed Al-Rashid', role: 'Security Researcher', text: 'La precisión del análisis de binarios es impresionante. Encontramos vulnerabilidades que otras herramientas no detectaron.', avatar: '🧑‍💻' },
    { name: 'Carlos Ruiz', role: 'CTO @ Córdoba Digital', text: 'Desde que usamos Al Andalus AI, nuestro equipo de reverse engineering es 3x más productivo.', avatar: '👨‍💼' },
    { name: 'Lucía Fernández', role: 'Game Developer', text: 'Pude reconstruir la lógica de un juego clásico en días. La reconstrucción asistida por IA es magia pura.', avatar: '👩‍🎨' },
  ] : [
    { name: 'María García', role: 'Lead Developer @ TechSevilla', text: 'Al Andalus AI transformed how we understand legacy code. What used to take weeks we now solve in hours.', avatar: '👩‍💻' },
    { name: 'Ahmed Al-Rashid', role: 'Security Researcher', text: 'The precision of binary analysis is impressive. We found vulnerabilities other tools didn\'t detect.', avatar: '🧑‍💻' },
    { name: 'Carlos Ruiz', role: 'CTO @ Córdoba Digital', text: 'Since we started using Al Andalus AI, our reverse engineering team is 3x more productive.', avatar: '👨‍💼' },
    { name: 'Lucía Fernández', role: 'Game Developer', text: 'I was able to reconstruct a classic game\'s logic in days. AI-assisted reconstruction is pure magic.', avatar: '👩‍🎨' },
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
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Lo que dicen nuestros usuarios' : 'What our users say'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Miles de desarrolladores confían en Al Andalus AI' : 'Thousands of developers trust Al Andalus AI'}
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className={`rounded-3xl p-8 sm:p-12 shadow-2xl border relative overflow-hidden ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="absolute top-6 left-8 text-6xl text-green-200/30 font-serif">"</div>
            <div className="relative z-10 min-h-[200px]">
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
                <button key={i} onClick={() => setActive(i)} className={`w-3 h-3 rounded-full transition-all ${i === active ? 'bg-green-600 w-8' : dark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-200 hover:bg-green-400'}`} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Tech Stack Section ─────────────── */

function TechStackSection({ dark, lang }: { dark: boolean; lang: Lang }) {
  const techs = [
    { name: 'JavaScript', icon: '🟨' }, { name: 'TypeScript', icon: '🔷' },
    { name: 'Python', icon: '🐍' }, { name: 'Rust', icon: '🦀' },
    { name: 'C/C++', icon: '⚙️' }, { name: 'Go', icon: '🐹' },
    { name: 'Java', icon: '☕' }, { name: 'Swift', icon: '🐦' },
    { name: 'Kotlin', icon: '🟪' }, { name: 'Ruby', icon: '💎' },
    { name: 'PHP', icon: '🐘' }, { name: 'WebAssembly', icon: '🕸️' },
    { name: 'Android', icon: '🤖' }, { name: 'iOS', icon: '🍎' },
    { name: 'Electron', icon: '⚡' }, { name: 'Docker', icon: '🐳' },
  ];

  return (
    <section className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
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
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Navbar ─────────────── */

function Navbar({ dark, toggleTheme, lang, setLang }: { dark: boolean; toggleTheme: () => void; lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);

  const bg = dark ? scrolled ? 'bg-green-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent' : scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent';
  const links = [
    { label: lang === 'es' ? 'Demo' : 'Demo', href: '#live-demo' },
    { label: lang === 'es' ? 'Rendimiento' : 'Performance', href: '#performance' },
    { label: lang === 'es' ? 'Industrias' : 'Industries', href: '#industries' },
    { label: lang === 'es' ? 'Empezar' : 'Get Started', href: '#wizard' },
    { label: lang === 'es' ? 'Roadmap' : 'Roadmap', href: '#roadmap' },
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
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${dark ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}>
                {lang === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
              </button>
              <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${dark ? 'bg-green-800 text-yellow-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} aria-label={dark ? 'Switch to light mode' : 'Cambiar a modo oscuro'}>
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
            <button onClick={toggleTheme} className={`p-2 rounded-full ${dark ? 'bg-green-800 text-yellow-300' : 'bg-green-100 text-green-700'}`} aria-label="Toggle theme">
              {dark ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={dark ? 'text-white' : 'text-green-800'} aria-label="Toggle menu">
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

function HeroSection({ dark, lang }: { dark: boolean; lang: Lang }) {
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

/* ─────────────── Live Analysis Demo ─────────────── */

function LiveAnalysisDemo({ dark, lang }: { dark: boolean; lang: Lang }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);

  const analysisSteps = lang === 'es' ? [
    { msg: '🔍 Iniciando análisis del programa...', delay: 500 },
    { msg: '📦 Cargando binario en memoria...', delay: 800 },
    { msg: '✓ Binario cargado: 2.4 MB', delay: 600 },
    { msg: '🔬 Analizando secciones PE...', delay: 1000 },
    { msg: '✓ Secciones encontradas: .text, .data, .rdata, .rsrc', delay: 700 },
    { msg: '🧩 Identificando funciones exportadas...', delay: 1200 },
    { msg: '✓ 142 funciones exportadas encontradas', delay: 800 },
    { msg: '🔗 Mapeando dependencias...', delay: 1000 },
    { msg: '✓ 23 dependencias externas identificadas', delay: 700 },
    { msg: '🤖 Ejecutando análisis con IA...', delay: 1500 },
    { msg: '✓ Análisis completado', delay: 500 },
    { msg: '📊 Generando informe...', delay: 800 },
    { msg: '✅ ¡Análisis finalizado!', delay: 500 },
  ] : [
    { msg: '🔍 Starting program analysis...', delay: 500 },
    { msg: '📦 Loading binary into memory...', delay: 800 },
    { msg: '✓ Binary loaded: 2.4 MB', delay: 600 },
    { msg: '🔬 Analyzing PE sections...', delay: 1000 },
    { msg: '✓ Sections found: .text, .data, .rdata, .rsrc', delay: 700 },
    { msg: '🧩 Identifying exported functions...', delay: 1200 },
    { msg: '✓ 142 exported functions found', delay: 800 },
    { msg: '🔗 Mapping dependencies...', delay: 1000 },
    { msg: '✓ 23 external dependencies identified', delay: 700 },
    { msg: '🤖 Running AI analysis...', delay: 1500 },
    { msg: '✓ Analysis completed', delay: 500 },
    { msg: '📊 Generating report...', delay: 800 },
    { msg: '✅ Analysis finished!', delay: 500 },
  ];

  const startAnalysis = () => {
    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    setResults(null);

    let totalDelay = 0;
    analysisSteps.forEach((step, index) => {
      totalDelay += step.delay;
      setTimeout(() => {
        setLogs(prev => [...prev, step.msg]);
        setProgress(((index + 1) / analysisSteps.length) * 100);
        
        if (index === analysisSteps.length - 1) {
          setTimeout(() => {
            setIsRunning(false);
            setResults({
              modules: 142,
              dependencies: 23,
              functions: 847,
              vulnerabilities: 3,
              time: '2.4s',
            });
          }, 500);
        }
      }, totalDelay);
    });
  };

  return (
    <section id="live-demo" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Demo de Análisis en Vivo' : 'Live Analysis Demo'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Observa cómo Al Andalus AI analiza un programa en tiempo real' : 'Watch Al Andalus AI analyze a program in real-time'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="bg-green-950 rounded-xl overflow-hidden mb-6 border border-green-800/50">
              <div className="px-4 py-3 flex items-center gap-3 border-b border-green-800/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-green-400 text-xs font-mono">analysis.log</span>
              </div>
              <div className="p-6 font-mono text-sm min-h-[300px] max-h-[400px] overflow-y-auto relative">
                {isRunning && <div className="scan-line"></div>}
                {logs.map((log, i) => (
                  <p key={i} className={`mb-2 ${log.startsWith('✓') ? 'text-green-400' : log.startsWith('✅') ? 'text-emerald-300 font-bold' : 'text-green-300'} animate-slide-left`}>
                    {log}
                  </p>
                ))}
                {isRunning && <p className="text-yellow-300 animate-pulse">⟳ {lang === 'es' ? 'Procesando...' : 'Processing...'}</p>}
              </div>
            </div>

            {(isRunning || results) && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className={`text-sm font-semibold ${dark ? 'text-green-300' : 'text-green-800'}`}>
                    {lang === 'es' ? 'Progreso' : 'Progress'}
                  </span>
                  <span className={`text-sm font-bold ${dark ? 'text-green-400' : 'text-green-700'}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${dark ? 'bg-green-800' : 'bg-green-100'}`}>
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 progress-bar transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {!isRunning && !results && (
              <button onClick={startAnalysis} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-green-700/30 hover:shadow-xl hover:-translate-y-0.5">
                ▶ {lang === 'es' ? 'Iniciar Análisis' : 'Start Analysis'}
              </button>
            )}

            {results && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-scale-in">
                  {[
                    { label: lang === 'es' ? 'Módulos' : 'Modules', value: results.modules, icon: '📦' },
                    { label: lang === 'es' ? 'Dependencias' : 'Dependencies', value: results.dependencies, icon: '🔗' },
                    { label: lang === 'es' ? 'Funciones' : 'Functions', value: results.functions, icon: '⚙️' },
                    { label: lang === 'es' ? 'Vulnerabilidades' : 'Vulnerabilities', value: results.vulnerabilities, icon: '⚠️' },
                    { label: lang === 'es' ? 'Tiempo' : 'Time', value: results.time, icon: '⏱️' },
                  ].map((stat, i) => (
                    <div key={i} className={`rounded-xl p-4 text-center ${dark ? 'bg-green-800/50' : 'bg-green-50'}`}>
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <p className={`text-2xl font-black ${dark ? 'text-green-400' : 'text-green-700'}`}>{stat.value}</p>
                      <p className={`text-xs ${dark ? 'text-green-500' : 'text-green-600'}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={startAnalysis} className={`w-full mt-4 py-3 rounded-full font-semibold transition-all ${dark ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                  🔄 {lang === 'es' ? 'Analizar de nuevo' : 'Analyze again'}
                </button>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Performance Comparison ─────────────── */

function PerformanceComparison({ dark, lang }: { dark: boolean; lang: Lang }) {
  const { ref, inView } = useInView(0.3);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView && !animated) setAnimated(true);
  }, [inView, animated]);

  const comparisons = [
    { method: lang === 'es' ? 'Manual' : 'Manual', time: 40, color: 'from-red-500 to-red-600' },
    { method: 'IDA Pro', time: 28, color: 'from-orange-500 to-orange-600' },
    { method: 'Ghidra', time: 22, color: 'from-yellow-500 to-yellow-600' },
    { method: 'Al Andalus AI', time: 2, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <section id="performance" ref={ref} className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Comparación de Rendimiento' : 'Performance Comparison'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Horas para analizar un programa típico' : 'Hours to analyze a typical program'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="space-y-6">
              {comparisons.map((comp, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between mb-2">
                    <span className={`font-bold ${dark ? 'text-white' : 'text-green-900'}`}>{comp.method}</span>
                    <span className={`font-bold ${dark ? 'text-green-400' : 'text-green-700'}`}>{comp.time}h</span>
                  </div>
                  <div className={`h-12 rounded-xl overflow-hidden ${dark ? 'bg-green-800/30' : 'bg-green-100'}`}>
                    <div
                      className={`h-full bg-gradient-to-r ${comp.color} rounded-xl flex items-center justify-end px-4 transition-all duration-1000 ease-out`}
                      style={{ width: animated ? `${(comp.time / 40) * 100}%` : '0%' }}
                    >
                      {animated && (
                        <span className="text-white font-bold text-sm">
                          {comp.time === 2 ? (lang === 'es' ? '20x más rápido' : '20x faster') : `${comp.time}h`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-8 p-6 rounded-xl ${dark ? 'bg-green-800/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-center font-bold text-lg ${dark ? 'text-green-300' : 'text-green-800'}`}>
                {lang === 'es' ? '🚀 Al Andalus AI es 20x más rápido que el método manual' : '🚀 Al Andalus AI is 20x faster than manual method'}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Industry Use Cases ─────────────── */

function IndustryUseCases({ dark, lang }: { dark: boolean; lang: Lang }) {
  const [activeIndustry, setActiveIndustry] = useState(0);

  const industries = [
    {
      icon: '🎮',
      title: 'Gaming',
      desc: lang === 'es' ? 'Analiza mecánicas de juego, reconstruye lógica de IA enemiga, optimiza rendimiento' : 'Analyze game mechanics, reconstruct enemy AI logic, optimize performance',
      features: lang === 'es' ? ['Análisis de motores de juego', 'Reconstrucción de shaders', 'Optimización de assets'] : ['Game engine analysis', 'Shader reconstruction', 'Asset optimization'],
    },
    {
      icon: '🏦',
      title: 'Fintech',
      desc: lang === 'es' ? 'Auditoría de seguridad, análisis de protocolos de pago, verificación de cifrado' : 'Security auditing, payment protocol analysis, encryption verification',
      features: lang === 'es' ? ['Auditoría de seguridad', 'Análisis de protocolos', 'Verificación de cifrado'] : ['Security auditing', 'Protocol analysis', 'Encryption verification'],
    },
    {
      icon: '🔒',
      title: lang === 'es' ? 'Ciberseguridad' : 'Cybersecurity',
      desc: lang === 'es' ? 'Detección de malware, análisis de vulnerabilidades, investigación de incidentes' : 'Malware detection, vulnerability analysis, incident investigation',
      features: lang === 'es' ? ['Detección de malware', 'Análisis de vulnerabilidades', 'Investigación forense'] : ['Malware detection', 'Vulnerability analysis', 'Forensic investigation'],
    },
    {
      icon: '📱',
      title: lang === 'es' ? 'Mobile Apps' : 'Mobile Apps',
      desc: lang === 'es' ? 'Análisis de apps iOS/Android, ingeniería inversa de APIs, optimización de rendimiento' : 'iOS/Android app analysis, API reverse engineering, performance optimization',
      features: lang === 'es' ? ['Análisis de apps móviles', 'Ingeniería inversa de APIs', 'Optimización de rendimiento'] : ['Mobile app analysis', 'API reverse engineering', 'Performance optimization'],
    },
    {
      icon: '🌐',
      title: 'Web Development',
      desc: lang === 'es' ? 'Análisis de SPAs, reconstrucción de APIs, auditoría de seguridad web' : 'SPA analysis, API reconstruction, web security auditing',
      features: lang === 'es' ? ['Análisis de aplicaciones web', 'Reconstrucción de APIs', 'Auditoría de seguridad'] : ['Web app analysis', 'API reconstruction', 'Security auditing'],
    },
    {
      icon: '🏥',
      title: 'Healthcare',
      desc: lang === 'es' ? 'Análisis de dispositivos médicos, verificación de cumplimiento, investigación de protocolos' : 'Medical device analysis, compliance verification, protocol investigation',
      features: lang === 'es' ? ['Análisis de dispositivos médicos', 'Verificación de cumplimiento', 'Investigación de protocolos'] : ['Medical device analysis', 'Compliance verification', 'Protocol investigation'],
    },
  ];

  return (
    <section id="industries" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Casos de Uso por Industria' : 'Industry Use Cases'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Soluciones adaptadas a cada sector' : 'Solutions adapted to each sector'}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-3">
            {industries.map((industry, i) => (
              <button
                key={i}
                onClick={() => setActiveIndustry(i)}
                className={`industry-card w-full text-left p-4 rounded-xl transition-all ${activeIndustry === i
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-700/30'
                  : dark ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60' : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="industry-icon text-3xl">{industry.icon}</span>
                  <span className="font-bold">{industry.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className={`rounded-3xl p-8 shadow-2xl border h-full ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
              <div className="text-6xl mb-6">{industries[activeIndustry].icon}</div>
              <h3 className={`text-3xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
                {industries[activeIndustry].title}
              </h3>
              <p className={`text-lg mb-6 ${dark ? 'text-green-300/80' : 'text-green-700/70'}`}>
                {industries[activeIndustry].desc}
              </p>
              <div className="space-y-3">
                {industries[activeIndustry].features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg className={`w-6 h-6 flex-shrink-0 ${dark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`font-medium ${dark ? 'text-green-200' : 'text-green-800'}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Getting Started Wizard ─────────────── */

function GettingStartedWizard({ dark, lang }: { dark: boolean; lang: Lang }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = lang === 'es' ? [
    { title: 'Instala Al Andalus AI', icon: '📦', content: 'Ejecuta el comando de instalación en tu terminal', code: 'npx al-andalus-ai@latest setup' },
    { title: 'Conecta tu agente', icon: '🔗', content: 'Conecta Al Andalus AI a tu agente de codificación favorito', code: 'al-andalus-ai connect --agent=claude' },
    { title: 'Analiza tu primer programa', icon: '🔍', content: 'Pregunta a tu agente sobre cualquier software', code: 'Analiza esta aplicación y explícame cómo funciona' },
    { title: '¡Listo!', icon: '🚀', content: 'Ya puedes usar Al Andalus AI para ingeniería inversa', code: '' },
  ] : [
    { title: 'Install Al Andalus AI', icon: '📦', content: 'Run the installation command in your terminal', code: 'npx al-andalus-ai@latest setup' },
    { title: 'Connect your agent', icon: '🔗', content: 'Connect Al Andalus AI to your favorite coding agent', code: 'al-andalus-ai connect --agent=claude' },
    { title: 'Analyze your first program', icon: '🔍', content: 'Ask your agent about any software', code: 'Analyze this application and explain how it works' },
    { title: 'Ready!', icon: '🚀', content: 'You can now use Al Andalus AI for reverse engineering', code: '' },
  ];

  return (
    <section id="wizard" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              {lang === 'es' ? 'Cómo Empezar' : 'Getting Started'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? '4 pasos simples para comenzar' : '4 simple steps to get started'}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className={`rounded-3xl p-8 shadow-2xl border ${dark ? 'bg-green-900/50 border-green-700/50' : 'bg-white border-green-100'}`}>
            <div className="flex items-center justify-between mb-12">
              {steps.map((_, i) => (
                <div key={i} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(i)}
                    className={`wizard-step w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${i === currentStep
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-110'
                      : i < currentStep
                        ? 'bg-green-500 text-white'
                        : dark ? 'bg-green-800 text-green-400' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {i < currentStep ? '✓' : i + 1}
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`hidden sm:block w-12 md:w-24 h-1 mx-2 rounded ${i < currentStep ? 'bg-green-500' : dark ? 'bg-green-800' : 'bg-green-200'}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
              <h3 className={`text-2xl font-black mb-2 ${dark ? 'text-white' : 'text-green-900'}`}>
                {steps[currentStep].title}
              </h3>
              <p className={`text-lg ${dark ? 'text-green-300/80' : 'text-green-700/70'}`}>
                {steps[currentStep].content}
              </p>
            </div>

            {steps[currentStep].code && (
              <div className="bg-green-950 rounded-xl p-6 font-mono text-sm border border-green-800/50 mb-8">
                <p className="text-green-400">$ <span className="text-white">{steps[currentStep].code}</span></p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${currentStep === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : dark ? 'bg-green-800 text-green-300 hover:bg-green-700' : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ← {lang === 'es' ? 'Anterior' : 'Previous'}
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${currentStep === steps.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg'
                }`}
              >
                {lang === 'es' ? 'Siguiente' : 'Next'} →
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Roadmap Timeline ─────────────── */

function RoadmapTimeline({ dark, lang }: { dark: boolean; lang: Lang }) {
  const roadmap = lang === 'es' ? [
    { quarter: 'Q1 2026', status: 'completed', items: ['Soporte para Rust', 'Análisis de WebAssembly', 'Mejoras de rendimiento 300%'] },
    { quarter: 'Q2 2026', status: 'in-progress', items: ['Integración con VS Code', 'API pública beta', 'Soporte para Swift/Kotlin'] },
    { quarter: 'Q3 2026', status: 'planned', items: ['Análisis de blockchain', 'Plugin para JetBrains', 'Modo colaborativo'] },
    { quarter: 'Q4 2026', status: 'planned', items: ['Análisis de IoT', 'Soporte para quantum computing', 'Marketplace de plugins'] },
  ] : [
    { quarter: 'Q1 2026', status: 'completed', items: ['Rust support', 'WebAssembly analysis', '300% performance improvements'] },
    { quarter: 'Q2 2026', status: 'in-progress', items: ['VS Code integration', 'Public API beta', 'Swift/Kotlin support'] },
    { quarter: 'Q3 2026', status: 'planned', items: ['Blockchain analysis', 'JetBrains plugin', 'Collaborative mode'] },
    { quarter: 'Q4 2026', status: 'planned', items: ['IoT analysis', 'Quantum computing support', 'Plugin marketplace'] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-green-600';
      case 'in-progress': return 'from-yellow-500 to-orange-500';
      case 'planned': return dark ? 'from-green-800 to-green-900' : 'from-green-200 to-green-300';
      default: return 'from-green-500 to-green-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '⟳';
      case 'planned': return '○';
      default: return '○';
    }
  };

  return (
    <section id="roadmap" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-950' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-[0.02]"><GeometricPattern /></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-green-900'}`}>
              Roadmap 2026
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-green-400/70' : 'text-green-700/60'}`}>
              {lang === 'es' ? 'Nuevas características y mejoras planificadas' : 'Planned new features and improvements'}
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {roadmap.map((quarter, i) => (
            <AnimatedSection key={i} delay={i * 150}>
              <div className={`roadmap-item rounded-2xl p-6 border transition-all ${dark ? 'bg-green-900/40 border-green-800 hover:border-green-600' : 'bg-white border-green-100 hover:border-green-400 hover:shadow-xl'}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${getStatusColor(quarter.status)} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {getStatusIcon(quarter.status)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`text-2xl font-black ${dark ? 'text-white' : 'text-green-900'}`}>
                        {quarter.quarter}
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        quarter.status === 'completed' ? 'bg-green-500 text-white' :
                        quarter.status === 'in-progress' ? 'bg-yellow-500 text-white' :
                        dark ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'
                      }`}>
                        {quarter.status === 'completed' ? (lang === 'es' ? 'Completado' : 'Completed') :
                         quarter.status === 'in-progress' ? (lang === 'es' ? 'En progreso' : 'In Progress') :
                         (lang === 'es' ? 'Planificado' : 'Planned')}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {quarter.items.map((item, j) => (
                        <li key={j} className={`flex items-center gap-2 ${dark ? 'text-green-300' : 'text-green-700'}`}>
                          <span className="text-green-500">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
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

/* ─────────────── Pricing ─────────────── */

function PricingSection({ dark, lang }: { dark: boolean; lang: Lang }) {
  const [annual, setAnnual] = useState(true);
  const plans = [
    { name: lang === 'es' ? 'Explorador' : 'Explorer', price: 0, features: lang === 'es' ? ['5 análisis/mes', 'Soporte email', 'Guías básicas'] : ['5 analyses/month', 'Email support', 'Basic guides'], popular: false },
    { name: lang === 'es' ? 'Profesional' : 'Professional', price: annual ? 29 : 39, features: lang === 'es' ? ['Análisis ilimitados', 'Soporte 24/7', 'API access', 'CI/CD'] : ['Unlimited analyses', '24/7 support', 'API access', 'CI/CD'], popular: true },
    { name: 'Enterprise', price: annual ? 99 : 129, features: lang === 'es' ? ['Todo de Pro', 'On-premise', 'SLA', 'Manager dedicado'] : ['Everything in Pro', 'On-premise', 'SLA', 'Dedicated manager'], popular: false },
  ];

  return (
    <section id="pricing" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-green-50'}`}>
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

function FAQSection({ dark, lang }: { dark: boolean; lang: Lang }) {
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
    <section id="faq" className={`py-24 relative overflow-hidden ${dark ? 'bg-green-900/20' : 'bg-white'}`}>
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

function NewsletterSection({ dark, lang }: { dark: boolean; lang: Lang }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(lang === 'es' ? 'Por favor, introduce tu email' : 'Please enter your email');
      return;
    }
    if (!validateEmail(email)) {
      setError(lang === 'es' ? 'Por favor, introduce un email válido' : 'Please enter a valid email');
      return;
    }
    setError('');
    setSubscribed(true);
  };

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
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder={lang === 'es' ? 'tu@email.com' : 'your@email.com'}
                  className={`w-full px-5 py-3.5 rounded-full bg-white/10 border ${error ? 'border-red-400' : 'border-white/30'} text-white placeholder-white/50 focus:outline-none focus:border-white backdrop-blur-sm`}
                  aria-label={lang === 'es' ? 'Dirección de email' : 'Email address'}
                  aria-describedby={error ? 'email-error' : undefined}
                />
                {error && (
                  <p id="email-error" className="absolute -bottom-6 left-0 text-red-300 text-xs" role="alert">{error}</p>
                )}
              </div>
              <button type="submit" className="bg-white text-green-800 px-8 py-3.5 rounded-full font-bold hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5">
                {lang === 'es' ? 'Suscribirme' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block animate-scale-in">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-white font-bold text-lg">{lang === 'es' ? '¡Bienvenido!' : 'Welcome!'}</p>
              <p className="text-green-200/70 text-sm mt-2">{lang === 'es' ? 'Revisa tu bandeja de entrada para confirmar' : 'Check your inbox to confirm'}</p>
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer({ dark, lang }: { dark: boolean; lang: Lang }) {
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
   APP - Entry Point
   ═══════════════════════════════════════════════════ */

export default function App() {
  const { dark, toggle } = useTheme();
  const [lang, setLang] = useState<Lang>('es');

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${dark ? 'bg-green-950 text-white' : 'bg-white text-green-900'}`}>
      <ScrollProgressBar />
      <Navbar dark={dark} toggleTheme={toggle} lang={lang} setLang={setLang} />
      <HeroSection dark={dark} lang={lang} />
      <StatsSection dark={dark} lang={lang} />
      <LiveAnalysisDemo dark={dark} lang={lang} />
      <PerformanceComparison dark={dark} lang={lang} />
      <TestimonialsSection dark={dark} lang={lang} />
      <IndustryUseCases dark={dark} lang={lang} />
      <TechStackSection dark={dark} lang={lang} />
      <GettingStartedWizard dark={dark} lang={lang} />
      <RoadmapTimeline dark={dark} lang={lang} />
      <PricingSection dark={dark} lang={lang} />
      <FAQSection dark={dark} lang={lang} />
      <NewsletterSection dark={dark} lang={lang} />
      <Footer dark={dark} lang={lang} />
      <BackToTop dark={dark} />
    </div>
  );
}
