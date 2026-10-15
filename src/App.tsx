import { useState, useEffect } from 'react';

function GeometricPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
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

function StarPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <polygon
        points="50,20 57,40 78,40 62,53 68,73 50,62 32,73 38,53 22,40 43,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-700 to-green-900 rounded-lg flex items-center justify-center shadow-md">
              <StarPattern className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-900 leading-tight">Al Andalus AI</h1>
              <p className="text-[10px] text-green-600 font-medium tracking-wider uppercase">Corp</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-green-800 hover:text-green-600 font-medium transition-colors">Características</a>
            <a href="#how-it-works" className="text-green-800 hover:text-green-600 font-medium transition-colors">Cómo Funciona</a>
            <a href="#showcases" className="text-green-800 hover:text-green-600 font-medium transition-colors">Casos</a>
            <a href="#guides" className="text-green-800 hover:text-green-600 font-medium transition-colors">Guías</a>
            <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
              Comenzar
            </button>
          </div>

          <button 
            className="md:hidden text-green-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-green-100">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-green-800 font-medium py-2">Características</a>
            <a href="#how-it-works" className="block text-green-800 font-medium py-2">Cómo Funciona</a>
            <a href="#showcases" className="block text-green-800 font-medium py-2">Casos</a>
            <a href="#guides" className="block text-green-800 font-medium py-2">Guías</a>
            <button className="w-full bg-green-700 text-white px-5 py-2 rounded-full font-medium">
              Comenzar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50">
      <GeometricPattern />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-green-300/20 rounded-full blur-2xl"></div>
      
      {/* Arch decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10">
        <svg viewBox="0 0 600 300" className="w-full h-full text-green-800">
          <path d="M100 300 L100 150 Q100 50 200 50 L400 50 Q500 50 500 150 L500 300" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M150 300 L150 170 Q150 80 250 80 L350 80 Q450 80 450 170 L450 300" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M200 300 L200 190 Q200 110 300 110 Q400 110 400 190 L400 300" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Ingeniería Inversa con IA
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-green-900 leading-tight">
              Descubre cómo
              <span className="block bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                funciona el software
              </span>
            </h1>
            
            <p className="text-xl text-green-700/80 max-w-lg leading-relaxed">
              Pregunta a tu agente de IA sobre una app, un juego o un sitio web. 
              Al Andalus AI le da las herramientas para inspeccionar el código detrás de la respuesta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                Comenzar ahora
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button className="border-2 border-green-700 text-green-700 hover:bg-green-50 px-8 py-4 rounded-full font-semibold text-lg transition-all">
                Ver ejemplos
              </button>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                ))}
              </div>
              <p className="text-sm text-green-600">
                <span className="font-bold text-green-800">2,500+</span> desarrolladores confían en nosotros
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <StarPattern className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-2 text-green-600 font-mono">al-andalus-ai</span>
                </div>
                
                <div className="bg-green-900 rounded-xl p-4 font-mono text-sm">
                  <p className="text-green-300">{'>'} <span className="text-white">Analizando aplicación...</span></p>
                  <p className="text-green-400 mt-2">✓ Módulos detectados: 47</p>
                  <p className="text-green-400 mt-1">✓ Dependencias mapeadas: 128</p>
                  <p className="text-green-400 mt-1">✓ Rutas encontradas: 23</p>
                  <p className="text-green-400 mt-1">✓ Funciones críticas: 89</p>
                  <p className="text-yellow-300 mt-3">⟳ Generando informe...</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">47</p>
                    <p className="text-xs text-green-600">Módulos</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">128</p>
                    <p className="text-xs text-green-600">Dependencias</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">89</p>
                    <p className="text-xs text-green-600">Funciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: '🔍',
      title: 'Inspección Profunda',
      description: 'Tu agente puede seguir el código, explicar funcionalidades y ayudarte a reconstruirlas.'
    },
    {
      icon: '⚡',
      title: 'Análisis en Tiempo Real',
      description: 'Observa el comportamiento del software mientras se ejecuta y captura datos dinámicos.'
    },
    {
      icon: '🏗️',
      title: 'Reconstrucción Asistida',
      description: 'Reconstruye funcionalidades completas a partir del análisis del código fuente.'
    },
    {
      icon: '🔐',
      title: 'Binarios Nativos',
      description: 'Inspecciona funciones, strings, referencias y relaciones de llamadas en ejecutables.'
    },
    {
      icon: '🌐',
      title: 'JavaScript & Electron',
      description: 'Mapea módulos, rutas, IPC y dependencias nativas desde un archivo ASAR.'
    },
    {
      icon: '🎯',
      title: 'Navegador & Runtime',
      description: 'Captura actividad del navegador o proceso y compara resultados entre ejecuciones.'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <GeometricPattern />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-green-900 mb-4">
            Herramientas Poderosas
          </h2>
          <p className="text-xl text-green-700/70 max-w-2xl mx-auto">
            Todo lo que necesitas para entender, analizar y reconstruir cualquier software
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-green-700/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Pregunta sobre una funcionalidad',
      description: 'Dale a tu agente un programa o página y una pregunta.',
      icon: '💬'
    },
    {
      number: '02',
      title: 'Inspecciona el programa',
      description: 'Al Andalus AI devuelve código, referencias y observaciones en tiempo de ejecución.',
      icon: '🔬'
    },
    {
      number: '03',
      title: 'Explícalo y prueba un cambio',
      description: 'Tu agente usa los hallazgos para explicar o reconstruir la funcionalidad.',
      icon: '🚀'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-green-900 to-green-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <GeometricPattern />
      </div>
      
      {/* Decorative arches */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        <svg viewBox="0 0 1200 120" className="w-full h-full text-white" preserveAspectRatio="none">
          <path d="M0 120 L0 80 Q100 20 200 80 Q300 20 400 80 Q500 20 600 80 Q700 20 800 80 Q900 20 1000 80 Q1100 20 1200 80 L1200 120 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-xl text-green-200/80 max-w-2xl mx-auto">
            Ingeniería inversa significa aprender cómo funciona el software inspeccionando el programa mismo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-green-400 to-transparent z-0"></div>
              )}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-5xl font-black text-green-400/30">{step.number}</span>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-green-200/70 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="mt-16 bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-3 text-green-300 text-sm font-mono">terminal</span>
          </div>
          <pre className="text-green-300 font-mono text-sm overflow-x-auto">
            <code>{`$ npx al-andalus-ai@latest setup

✓ Configuración completada
✓ Agente conectado
✓ Módulos cargados: 24

> Listo para analizar. Pregunta a tu agente sobre cualquier software.`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function ShowcasesSection() {
  const cases = [
    {
      category: 'Android · Análisis APK',
      title: 'Cómo un autenticador genera un código de acceso',
      description: 'Rastrea el código de acceso de seis dígitos de Aegis a través de su APK publicada.',
      color: 'from-green-600 to-green-800'
    },
    {
      category: 'Electron · Rastreo de funciones',
      title: 'Cómo Notion copia texto y HTML',
      description: 'Sigue el JavaScript empaquetado de Notion hasta el portapapeles del sistema.',
      color: 'from-green-700 to-green-900'
    },
    {
      category: 'Nativo · Reconstrucción',
      title: 'Cálculo de paneo de sonido en DX-Ball',
      description: 'Recupera cómo la posición de una bola se convierte en sonido izquierdo/derecho.',
      color: 'from-green-800 to-green-950'
    }
  ];

  return (
    <section id="showcases" className="py-24 bg-green-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-green-900 mb-4">
            Casos de Estudio
          </h2>
          <p className="text-xl text-green-700/70 max-w-2xl mx-auto">
            Explora funcionalidades en apps y juegos publicados, con código y resultados verificados
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2`}>
                <div>
                  <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-green-100/80 text-sm leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-6 flex items-center text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Leer caso de estudio</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidesSection() {
  const guides = [
    {
      title: 'Binarios Nativos',
      description: 'Inspecciona funciones, strings, referencias y relaciones de llamadas en ejecutables y bibliotecas.',
      icon: '⚙️'
    },
    {
      title: 'JavaScript & Electron',
      description: 'Mapea módulos, rutas, IPC y dependencias nativas desde una carpeta de aplicación o archivo ASAR.',
      icon: '📦'
    },
    {
      title: 'Navegador & Actividad en Runtime',
      description: 'Captura actividad seleccionada del navegador o proceso y compara resultados entre ejecuciones.',
      icon: '🌍'
    }
  ];

  return (
    <section id="guides" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-green-900 mb-4">
            Elige tu Objetivo
          </h2>
          <p className="text-xl text-green-700/70 max-w-2xl mx-auto">
            Estas guías cubren la configuración y una primera investigación para cada tipo de software
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div key={index} className="relative bg-white rounded-2xl p-8 border-2 border-green-100 hover:border-green-400 transition-all duration-300 group hover:shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-700 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              <span className="text-4xl mb-4 block">{guide.icon}</span>
              <h3 className="text-xl font-bold text-green-900 mb-3">{guide.title}</h3>
              <p className="text-green-700/70 leading-relaxed mb-6">{guide.description}</p>
              <button className="text-green-700 font-semibold flex items-center group-hover:text-green-500 transition-colors">
                Leer guía
                <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SetupSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <GeometricPattern />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-green-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
              Configura Al Andalus AI
            </h2>
            <p className="text-lg text-green-700/70">
              Copia esto en tu agente de codificación
            </p>
          </div>

          <div className="bg-green-900 rounded-xl p-6 font-mono text-sm relative">
            <button className="absolute top-4 right-4 text-green-400 hover:text-white transition-colors text-xs bg-green-800 px-3 py-1 rounded">
              Copiar
            </button>
            <pre className="text-green-300 overflow-x-auto">
              <code>{`# Instala Al Andalus AI y conéctalo a este agente
npx al-andalus-ai@latest setup

# Muestra el plan de configuración para aprobación
# luego verifica la instalación`}</code>
            </pre>
          </div>

          <div className="mt-8 text-center">
            <p className="text-green-600 text-sm mb-4">
              ¿Otras opciones de instalación?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="text-green-700 hover:text-green-500 font-medium text-sm border border-green-200 px-4 py-2 rounded-full hover:border-green-400 transition-all">
                curl →
              </button>
              <button className="text-green-700 hover:text-green-500 font-medium text-sm border border-green-200 px-4 py-2 rounded-full hover:border-green-400 transition-all">
                Guía paso a paso →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <GeometricPattern />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <StarPattern className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Al Andalus AI Corp</h3>
                <p className="text-green-400 text-xs tracking-wider uppercase">Inteligencia de Ingeniería Inversa</p>
              </div>
            </div>
            <p className="text-green-300/70 max-w-sm mt-4 leading-relaxed">
              Herramientas de ingeniería inversa impulsadas por IA para desarrolladores que quieren entender cómo funciona el software.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">Documentación</a></li>
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">Guías</a></li>
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">Casos de Estudio</a></li>
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Comunidad</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-green-300/70 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-400/60 text-sm">
            © 2026 Al Andalus AI Corp. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <div className="w-6 h-4 bg-green-700 rounded-sm"></div>
            <div className="w-6 h-4 bg-white rounded-sm border border-green-600"></div>
            <div className="w-6 h-4 bg-green-700 rounded-sm"></div>
            <span className="text-green-400/60 text-xs ml-2">Hecho con orgullo andaluz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ShowcasesSection />
      <GuidesSection />
      <SetupSection />
      <Footer />
    </div>
  );
}
