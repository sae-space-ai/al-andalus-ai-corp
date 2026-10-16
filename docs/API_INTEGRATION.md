# Guía de Integración con APIs

## Fase 8: Integración con APIs Reales

Esta guía explica cómo conectar Al Andalus AI con servicios externos para análisis real.

---

## 🔌 APIs Soportadas

### 1. OpenAI (GPT-4)

**Uso**: Análisis inteligente de código y generación de explicaciones

#### Configuración

```bash
# Obtén tu API key en https://platform.openai.com/api-keys
# Añade a .env.local
VITE_OPENAI_API_KEY=sk-...
```

#### Instalación

```bash
npm install openai
```

#### Uso

```typescript
// src/lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo desarrollo
});

export async function analyzeCode(code: string, language: string = 'auto') {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Eres un experto en ingeniería inversa. Analiza el código proporcionado y explica:
1. Qué hace el código
2. Cómo funciona internamente
3. Posibles vulnerabilidades
4. Sugerencias de mejora

Responde en formato JSON con las siguientes claves:
- summary: resumen breve
- explanation: explicación detallada
- vulnerabilities: array de vulnerabilidades encontradas
- suggestions: array de sugerencias`
      },
      {
        role: "user",
        content: `Analiza este código (${language}):\n\n${code}`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}

export async function explainFunction(functionCode: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Explica esta función de manera clara y concisa, incluyendo parámetros, retorno y lógica interna."
      },
      {
        role: "user",
        content: functionCode
      }
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}
```

#### Ejemplo de Uso en Componente

```typescript
// src/components/CodeAnalyzer.tsx
import { useState } from 'react';
import { analyzeCode } from '../lib/openai';

export function CodeAnalyzer() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzeCode(code);
      setResult(analysis);
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Pega tu código aquí..."
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analizando...' : 'Analizar'}
      </button>
      {result && (
        <div>
          <h3>{result.summary}</h3>
          <p>{result.explanation}</p>
          {result.vulnerabilities.length > 0 && (
            <div>
              <h4>Vulnerabilidades:</h4>
              <ul>
                {result.vulnerabilities.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

### 2. Anthropic Claude

**Uso**: Análisis avanzado con contexto más largo

#### Configuración

```bash
# Obtén tu API key en https://console.anthropic.com/
VITE_CLAUDE_API_KEY=sk-ant-...
```

#### Instalación

```bash
npm install @anthropic-ai/sdk
```

#### Uso

```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeWithClaude(code: string) {
  const message = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4096,
    system: "Eres un experto en ingeniería inversa y seguridad de software.",
    messages: [
      {
        role: "user",
        content: `Analiza este código en profundidad:\n\n${code}\n\nProporciona:\n1. Resumen ejecutivo\n2. Análisis técnico detallado\n3. Posibles vulnerabilidades\n4. Recomendaciones de seguridad`
      }
    ]
  });

  return message.content[0].text;
}
```

---

### 3. GitHub API

**Uso**: Análisis de repositorios públicos

#### Configuración

```bash
# Genera un token en https://github.com/settings/tokens
VITE_GITHUB_TOKEN=ghp_...
```

#### Instalación

```bash
npm install @octokit/rest
```

#### Uso

```typescript
// src/lib/github.ts
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

export async function analyzeRepository(owner: string, repo: string) {
  // Obtener información del repo
  const { data: repoInfo } = await octokit.repos.get({ owner, repo });
  
  // Obtener archivos principales
  const { data: contents } = await octokit.repos.getContent({ owner, repo });
  
  // Obtener commits recientes
  const { data: commits } = await octokit.repos.listCommits({ owner, repo, per_page: 10 });
  
  // Obtener issues abiertos
  const { data: issues } = await octokit.issues.listForRepo({ owner, repo, state: 'open' });
  
  return {
    info: repoInfo,
    files: contents,
    recentCommits: commits,
    openIssues: issues
  };
}

export async function getFileContent(owner: string, repo: string, path: string) {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  
  if ('content' in data) {
    return atob(data.content);
  }
  
  return null;
}
```

---

### 4. VirusTotal API

**Uso**: Análisis de seguridad de archivos

#### Configuración

```bash
# Obtén tu API key en https://www.virustotal.com/
VITE_VIRUSTOTAL_API_KEY=...
```

#### Uso

```typescript
// src/lib/virustotal.ts
const VT_API_KEY = import.meta.env.VITE_VIRUSTOTAL_API_KEY;

export async function scanFile(fileHash: string) {
  const response = await fetch(
    `https://www.virustotal.com/api/v3/files/${fileHash}`,
    {
      headers: {
        'x-apikey': VT_API_KEY
      }
    }
  );
  
  const data = await response.json();
  return data.data;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    'https://www.virustotal.com/api/v3/files',
    {
      method: 'POST',
      headers: {
        'x-apikey': VT_API_KEY
      },
      body: formData
    }
  );
  
  return await response.json();
}
```

---

## 🔒 Seguridad de API Keys

### ⚠️ IMPORTANTE

**NUNCA commitees API keys al repositorio**

### Buenas Prácticas

1. **Usa variables de entorno**
   ```bash
   # .env.local (NO commitear)
   VITE_OPENAI_API_KEY=sk-...
   ```

2. **Añade a .gitignore**
   ```gitignore
   .env.local
   .env.production
   ```

3. **Usa backend para producción**
   ```typescript
   // ❌ MAL - Expone key en frontend
   const openai = new OpenAI({ apiKey: 'sk-...' });
   
   // ✅ BIEN - Usa backend proxy
   const response = await fetch('/api/analyze', {
     method: 'POST',
     body: JSON.stringify({ code })
   });
   ```

4. **Implementa rate limiting**
   ```typescript
   // src/lib/rateLimit.ts
   const requestCounts = new Map<string, number>();
   
   export function checkRateLimit(userId: string, limit = 100) {
     const count = requestCounts.get(userId) || 0;
     if (count >= limit) {
       throw new Error('Rate limit exceeded');
     }
     requestCounts.set(userId, count + 1);
     
     // Reset después de 1 hora
     setTimeout(() => {
       requestCounts.delete(userId);
     }, 3600000);
   }
   ```

---

## 🚀 Backend Proxy (Producción)

Para producción, crea un backend proxy:

```typescript
// supabase/functions/analyze/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.0/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
});

serve(async (req) => {
  // Validar autenticación
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const { code } = await req.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "Eres un experto en ingeniería inversa." },
      { role: "user", content: code }
    ]
  });
  
  return new Response(
    JSON.stringify({ result: completion.choices[0].message.content }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

## 📊 Monitoreo de Uso

```typescript
// src/lib/apiUsage.ts
export async function trackApiUsage(api: string, tokens: number) {
  await fetch('/api/track-usage', {
    method: 'POST',
    body: JSON.stringify({
      api,
      tokens,
      timestamp: new Date().toISOString(),
      userId: getCurrentUserId()
    })
  });
}

// Uso
const result = await analyzeCode(code);
await trackApiUsage('openai', result.usage.total_tokens);
```

---

## 📚 Recursos

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [VirusTotal API Docs](https://developers.virustotal.com/reference)
