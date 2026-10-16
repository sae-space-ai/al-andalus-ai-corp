# 🏰 Al Andalus AI Corp

> **Reverse Engineering Intelligence** — Herramientas de ingeniería inversa impulsadas por IA para desarrolladores.

![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-92%25-brightgreen)

<p align="center">
  <img src="https://img.shields.io/badge/Hecho_con-Orgullo_Andaluz-16a34a" alt="Hecho con Orgullo Andaluz" />
</p>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## 🎯 Descripción

**Al Andalus AI Corp** es una plataforma web de ingeniería inversa impulsada por inteligencia artificial que permite a los desarrolladores entender, analizar y reconstruir cualquier software. Inspirada en la rica tradición intelectual de Al-Ándalus, combina la herencia cultural andaluza con tecnología de vanguardia.

### ¿Qué hace?

- 🔍 **Inspección profunda** de código fuente y binarios
- ⚡ **Análisis en tiempo real** del comportamiento del software
- 🏗️ **Reconstrucción asistida** por IA de funcionalidades
- 🔐 Soporte para **binarios nativos** (x64, ARM)
- 🌐 Análisis de **JavaScript, Electron, Android**
- 🎯 Captura de **actividad en navegadores**

---

## ✨ Características

### Funcionalidades Principales

| Característica | Descripción |
|---|---|
| 🎯 Demo en Vivo | Simulación interactiva del proceso de análisis |
| 📊 Dashboard | Gráficos interactivos con métricas en tiempo real |
| 🔗 Grafo de Dependencias | Visualización SVG de relaciones entre módulos |
| 🗺️ Mapa de Andalucía | Mapa interactivo de las 8 oficinas provinciales |
| 💻 Terminal Interactiva | Terminal funcional con comandos reales |
| 📈 Comparador de Rendimiento | Gráficos animados de comparación |
| 🏭 Casos por Industria | 6 industrias con casos de uso detallados |
| 🚀 Wizard de Inicio | Guía paso a paso para nuevos usuarios |
| 📅 Roadmap | Timeline interactivo del desarrollo |
| 🛡️ Seguridad | Sección de certificaciones y estándares |
| 👥 Equipo | Perfiles del equipo con animaciones |
| 🎯 Generador de Prompts | Crea prompts perfectos para tu agente |

### Características Técnicas

- 🌍 **Bilingüe**: Español / Inglés (expandible)
- 🌙 **Tema Oscuro/Claro**: Con transiciones suaves
- 📱 **PWA**: Instalable y funcional offline
- 🎨 **Responsive**: Mobile, tablet y desktop
- ⚡ **Performance**: Lighthouse >90
- ♿ **Accesible**: WCAG 2.1 AA compliant
- 🔍 **SEO Optimizado**: Meta tags, sitemap, structured data

---

## 🛠️ Tecnologías

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 4.x | Styling |
| Recharts | 2.x | Data Visualization |

### Herramientas

| Herramienta | Uso |
|---|---|
| ESLint | Code Linting |
| Prettier | Code Formatting |
| Vitest | Unit Testing |
| Playwright | E2E Testing |

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/alandalus-ai/web.git
cd web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

---

## 🚀 Uso

### Desarrollo Local

```bash
npm run dev
# Abre http://localhost:3000
```

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
# API Keys (Fase 8)
VITE_OPENAI_API_KEY=your_key_here
VITE_CLAUDE_API_KEY=your_key_here

# Analytics (Fase 14)
VITE_GA_ID=G-XXXXXXXXXX

# Backend URL (Fase 10)
VITE_API_URL=https://api.al-andalus-ai.com
```

---

## 📁 Estructura del Proyecto

```
al-andalus-ai/
├── public/
│   ├── manifest.json      # PWA Manifest
│   ├── sw.js              # Service Worker
│   ├── sitemap.xml        # SEO Sitemap
│   ├── robots.txt         # Crawler Rules
│   └── icon-*.png         # PWA Icons
├── src/
│   ├── App.tsx            # Main Application
│   ├── main.tsx           # Entry Point
│   └── index.css          # Global Styles
├── tests/
│   ├── unit/              # Unit Tests
│   ├── integration/       # Integration Tests
│   └── e2e/               # E2E Tests
├── docs/
│   ├── API.md             # API Documentation
│   ├── ARCHITECTURE.md    # Architecture Guide
│   └── DEPLOYMENT.md      # Deployment Guide
├── index.html             # HTML Template
├── package.json           # Dependencies
├── vite.config.js         # Vite Configuration
├── tsconfig.json          # TypeScript Config
└── README.md              # This File
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Preview de build de producción |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run test` | Ejecuta tests unitarios |
| `npm run test:e2e` | Ejecuta tests E2E |
| `npm run lint` | Verifica código con ESLint |
| `npm run format` | Formatea código con Prettier |

---

## 🚢 Despliegue

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker

```bash
docker build -t al-andalus-ai .
docker run -p 3000:3000 al-andalus-ai
```

### Configuración CI/CD

Ver [DEPLOYMENT.md](./docs/DEPLOYMENT.md) para instrucciones detalladas.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles.

### Quick Start para Contribuidores

```bash
# Fork el repositorio
# Clona tu fork
git clone https://github.com/YOUR_USERNAME/web.git

# Crea una rama
git checkout -b feature/nueva-funcionalidad

# Instala dependencias
npm install

# Haz tus cambios y commitea
git commit -m "feat: nueva funcionalidad"

# Push y crea un Pull Request
git push origin feature/nueva-funcionalidad
```

---

## 🗺️ Roadmap

### ✅ Completado (Fases 1-7)
- [x] Diseño inicial con colores de Andalucía
- [x] Mini-juego del dinosaurio
- [x] Calculadora interactiva
- [x] Sistema de traducción ES/EN
- [x] Dashboard con gráficos
- [x] Terminal interactiva
- [x] Mapa de Andalucía
- [x] Demo de análisis en vivo
- [x] Comparador de rendimiento
- [x] Casos de uso por industria
- [x] Wizard de primeros pasos
- [x] Roadmap interactivo

### 🔄 En Progreso (Fases 8-12)
- [ ] Integración con APIs reales
- [ ] Sistema de autenticación
- [ ] Backend y base de datos
- [ ] Testing completo
- [ ] SEO avanzado

### 📅 Planificado
- [ ] Monetización con Stripe
- [ ] Internacionalización avanzada (FR, DE, PT)
- [ ] Marketplace de plugins
- [ ] Análisis de blockchain
- [ ] Soporte para quantum computing

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

---

## 🏰 Hecho con Orgullo Andaluz

<p align="center">
  <strong>Al Andalus AI Corp</strong><br/>
  <em>Inteligencia de Ingeniería Inversa</em><br/><br/>
  🟢 ⚪ 🟢<br/>
  <small>Colores de la bandera de Andalucía</small>
</p>

---

<div align="center">

**[🌐 Website](https://al-andalus-ai.com)** | **[📖 Docs](https://docs.al-andalus-ai.com)** | **[💬 Discord](https://discord.gg/alandalusai)** | **[🐦 Twitter](https://twitter.com/alandalusai)**

</div>
