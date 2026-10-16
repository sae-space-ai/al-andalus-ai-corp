# Guía de Despliegue

## Fase 15: Despliegue y CI/CD

Esta guía cubre el despliegue de Al Andalus AI Corp en diferentes plataformas.

---

## 🚀 Opciones de Despliegue

| Plataforma | Gratuito | Velocidad | Recomendado Para |
|---|---|---|---|
| Vercel | ✅ Sí | ⭐⭐⭐⭐⭐ | Producción (Recomendado) |
| Netlify | ✅ Sí | ⭐⭐⭐⭐ | Producción |
| Cloudflare Pages | ✅ Sí | ⭐⭐⭐⭐⭐ | CDN Global |
| GitHub Pages | ✅ Sí | ⭐⭐⭐ | Demo/Portfolio |
| AWS S3 + CloudFront | 💰 Pago | ⭐⭐⭐⭐ | Enterprise |

---

## 📦 Preparación del Build

```bash
# Instalar dependencias
npm install

# Verificar tipos
npm run typecheck

# Ejecutar tests
npm run test

# Compilar para producción
npm run build

# Verificar build
npm run preview
```

---

## 🟣 Vercel (Recomendado)

### Instalación

```bash
npm install -g vercel
```

### Despliegue

```bash
# Login
vercel login

# Despliegue preview
vercel

# Despliegue producción
vercel --prod
```

### Configuración Automática

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno
4. Deploy automático en cada push

### vercel.json

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
```

---

## 🔵 Netlify

### Instalación

```bash
npm install -g netlify-cli
```

### Despliegue

```bash
# Login
netlify login

# Despliegue
netlify deploy --prod --dir=dist
```

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"
```

---

## 🟠 Cloudflare Pages

### Configuración

1. Ve a [pages.cloudflare.com](https://pages.cloudflare.com)
2. Conecta tu repositorio de GitHub
3. Configura:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `18`

### Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy dist --project-name=al-andalus-ai
```

---

## 🐳 Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker - no cache
    location = /sw.js {
        add_header Cache-Control "no-cache";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Build y Run

```bash
docker build -t al-andalus-ai .
docker run -p 8080:80 al-andalus-ai
```

---

## ⚙️ CI/CD con GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔐 Variables de Entorno

### Producción

```env
# Analytics
VITE_GA_ID=G-XXXXXXXXXX

# API Keys (si aplica)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
```

### Configuración en Vercel

```bash
vercel env add VITE_GA_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## 📊 Monitoreo Post-Deploy

### Lighthouse CI

```bash
npm install -g @lhci/cli
lhci autorun
```

### Web Vitals

```typescript
// src/lib/vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

export function reportVitals() {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);
}
```

---

## 🔄 Rollback

### Vercel

```bash
# Listar deployments
vercel ls

# Rollback a deployment anterior
vercel rollback
```

### Netlify

1. Ve al dashboard de Netlify
2. Selecciona "Deploys"
3. Haz clic en "Publish deploy" en el deployment anterior

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Docker Docs](https://docs.docker.com)
- [GitHub Actions](https://docs.github.com/en/actions)
