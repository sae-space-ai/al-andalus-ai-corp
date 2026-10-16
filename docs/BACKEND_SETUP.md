# Guía de Configuración de Backend

## Fase 10: Backend y Base de Datos

Esta guía explica cómo configurar el backend para Al Andalus AI Corp usando **Supabase** (recomendado) o **Firebase**.

---

## 🏗️ Arquitectura Recomendada

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API Gateway    │────▶│   Supabase      │
│   (React/Vite)  │     │   (Edge Funcs)   │     │   (PostgreSQL)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │   AI Services    │
                        │   (OpenAI/Claude)│
                        └──────────────────┘
```

---

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com) (gratis hasta 500MB)
- Node.js >= 18
- npm o yarn

---

## 🚀 Configuración con Supabase

### 1. Crear Proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda las credenciales:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### 2. Crear Tablas

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de análisis
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'binary', 'web', 'mobile', 'game'
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de equipos
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de miembros de equipo
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
```

### 3. Instalar Cliente

```bash
npm install @supabase/supabase-js
```

### 4. Configurar Variables de Entorno

Crea `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Crear Cliente Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 6. Hook de Autenticación

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signIn, signUp, signOut };
}
```

---

## 🔌 Integración con APIs de IA

### OpenAI

```typescript
// src/lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo
});

export async function analyzeCode(code: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Eres un experto en ingeniería inversa. Analiza el código proporcionado y explica su funcionalidad."
      },
      {
        role: "user",
        content: code
      }
    ],
  });

  return completion.choices[0].message.content;
}
```

### Claude (Anthropic)

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
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analiza este código y explica su funcionalidad:\n\n${code}`
      }
    ]
  });

  return message.content[0].text;
}
```

---

## 🚀 Edge Functions (Supabase)

Crea funciones serverless para operaciones sensibles:

```bash
# Instalar CLI de Supabase
npm install -g supabase

# Inicializar
supabase init

# Crear función
supabase functions new analyze-binary
```

```typescript
// supabase/functions/analyze-binary/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { binaryData, options } = await req.json();
  
  // Lógica de análisis aquí
  const result = await performAnalysis(binaryData, options);
  
  return new Response(
    JSON.stringify({ result }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

## 📊 Monitoreo y Logs

### Supabase Logs

```typescript
// src/lib/logger.ts
import { supabase } from './supabase';

export async function logAction(userId: string, action: string, metadata: any) {
  await supabase.from('logs').insert({
    user_id: userId,
    action,
    metadata,
    created_at: new Date().toISOString()
  });
}
```

---

## 🔒 Seguridad

### Checklist de Seguridad

- [ ] Habilitar RLS en todas las tablas
- [ ] Usar variables de entorno para API keys
- [ ] Implementar rate limiting
- [ ] Validar inputs del usuario
- [ ] Usar HTTPS en producción
- [ ] Configurar CORS correctamente
- [ ] Implementar 2FA para admins
- [ ] Auditar logs regularmente

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

---

## 🆘 Soporte

Si tienes problemas, abre un issue en GitHub o únete a nuestro Discord.
