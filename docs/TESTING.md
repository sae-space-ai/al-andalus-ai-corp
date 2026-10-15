# Guía de Testing

## Fase 12: Testing Completo

Esta guía explica cómo configurar y ejecutar tests en Al Andalus AI Corp.

---

## 🧪 Stack de Testing

| Herramienta | Uso | Instalación |
|---|---|---|
| Vitest | Unit & Integration Tests | `npm i -D vitest` |
| React Testing Library | Component Tests | `npm i -D @testing-library/react` |
| Playwright | E2E Tests | `npm i -D @playwright/test` |
| MSW | API Mocking | `npm i -D msw` |

---

## 📦 Instalación

```bash
# Unit & Integration Tests
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E Tests
npm install -D @playwright/test
npx playwright install

# API Mocking
npm install -D msw
```

---

## ⚙️ Configuración

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
      ],
    },
  },
});
```

### tests/setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 📝 Ejemplos de Tests

### Unit Test: Hook useCountUp

```typescript
// tests/unit/useCountUp.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCountUp } from '../../src/App';

describe('useCountUp', () => {
  it('should start at 0', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, false));
    expect(result.current).toBe(0);
  });

  it('should count up when started', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountUp(100, 1000, true));
    
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeLessThanOrEqual(100);
    
    vi.useRealTimers();
  });

  it('should reach target value', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountUp(100, 1000, true));
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current).toBe(100);
    vi.useRealTimers();
  });
});
```

### Component Test: Navbar

```typescript
// tests/unit/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../../src/App';

describe('Navbar', () => {
  it('renders logo and brand name', () => {
    render(<Navbar dark={false} toggleTheme={vi.fn()} lang="es" setLang={vi.fn()} />);
    expect(screen.getByText('Al Andalus AI')).toBeInTheDocument();
    expect(screen.getByText('Corporation')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar dark={false} toggleTheme={vi.fn()} lang="es" setLang={vi.fn()} />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText('Rendimiento')).toBeInTheDocument();
    expect(screen.getByText('Industrias')).toBeInTheDocument();
  });

  it('toggles language when button clicked', () => {
    const setLang = vi.fn();
    render(<Navbar dark={false} toggleTheme={vi.fn()} lang="es" setLang={setLang} />);
    
    fireEvent.click(screen.getByText('🇬🇧 EN'));
    expect(setLang).toHaveBeenCalledWith('en');
  });

  it('toggles theme when button clicked', () => {
    const toggleTheme = vi.fn();
    render(<Navbar dark={false} toggleTheme={toggleTheme} lang="es" setLang={vi.fn()} />);
    
    fireEvent.click(screen.getByLabelText('Toggle theme'));
    expect(toggleTheme).toHaveBeenCalled();
  });

  it('switches to English labels', () => {
    render(<Navbar dark={false} toggleTheme={vi.fn()} lang="en" setLang={vi.fn()} />);
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Industries')).toBeInTheDocument();
  });
});
```

### Component Test: LiveAnalysisDemo

```typescript
// tests/unit/LiveAnalysisDemo.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LiveAnalysisDemo } from '../../src/App';

describe('LiveAnalysisDemo', () => {
  it('renders start button initially', () => {
    render(<LiveAnalysisDemo dark={false} lang="es" />);
    expect(screen.getByText(/Iniciar Análisis/i)).toBeInTheDocument();
  });

  it('starts analysis when button clicked', async () => {
    vi.useFakeTimers();
    render(<LiveAnalysisDemo dark={false} lang="es" />);
    
    fireEvent.click(screen.getByText(/Iniciar Análisis/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Procesando/i)).toBeInTheDocument();
    });
    
    vi.useRealTimers();
  });

  it('shows results after analysis completes', async () => {
    vi.useFakeTimers();
    render(<LiveAnalysisDemo dark={false} lang="es" />);
    
    fireEvent.click(screen.getByText(/Iniciar Análisis/i));
    
    // Advance through all analysis steps
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('142')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
    });
    
    vi.useRealTimers();
  });
});
```

### E2E Test: Full User Journey

```typescript
// tests/e2e/app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Al Andalus AI - Full User Journey', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.getByText('Descubre cómo')).toBeVisible();
    await expect(page.getByText('funciona el software')).toBeVisible();
  });

  test('can switch language', async ({ page }) => {
    await page.goto('/');
    
    // Switch to English
    await page.click('text=🇬🇧 EN');
    await expect(page.getByText('Find out how')).toBeVisible();
    await expect(page.getByText('software works')).toBeVisible();
    
    // Switch back to Spanish
    await page.click('text=🇪🇸 ES');
    await expect(page.getByText('Descubre cómo')).toBeVisible();
  });

  test('can toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Toggle dark mode
    await page.click('[aria-label="Toggle theme"]');
    
    // Check dark mode is active
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back
    await page.click('[aria-label="Toggle theme"]');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('live demo works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to live demo section
    await page.click('text=Demo');
    
    // Start analysis
    await page.click('text=Iniciar Análisis');
    
    // Wait for results
    await page.waitForSelector('text=Análisis finalizado', { timeout: 20000 });
    
    // Check results are displayed
    await expect(page.getByText('142')).toBeVisible();
  });

  test('pricing toggle works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to pricing
    await page.click('text=Precios');
    
    // Toggle to monthly
    await page.click('button:has-text("Mensual")');
    
    // Check prices change
    const professionalPrice = page.locator('text=$39');
    await expect(professionalPrice).toBeVisible();
    
    // Toggle back to annual
    await page.click('button:has-text("Anual")');
    const annualPrice = page.locator('text=$29');
    await expect(annualPrice).toBeVisible();
  });

  test('FAQ accordion works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to FAQ
    await page.click('text=FAQ');
    
    // Click first question
    const firstQuestion = page.locator('button').filter({ hasText: '¿Qué es Al Andalus AI?' });
    await firstQuestion.click();
    
    // Check answer is visible
    await expect(page.getByText(/herramienta de ingeniería inversa/i)).toBeVisible();
  });

  test('wizard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to wizard
    await page.click('text=Empezar');
    
    // Check first step
    await expect(page.getByText('Instala Al Andalus AI')).toBeVisible();
    
    // Go to next step
    await page.click('text=Siguiente →');
    await expect(page.getByText('Conecta tu agente')).toBeVisible();
    
    // Go back
    await page.click('text=← Anterior');
    await expect(page.getByText('Instala Al Andalus AI')).toBeVisible();
  });

  test('mobile menu works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    await page.click('[aria-label="Toggle menu"]');
    
    // Check menu items are visible
    await expect(page.getByText('Demo')).toBeVisible();
    await expect(page.getByText('Rendimiento')).toBeVisible();
  });

  test('scroll progress bar works', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    
    // Check progress bar has width
    const progressBar = page.locator('.fixed.top-0 .h-full');
    const width = await progressBar.evaluate(el => el.style.width);
    expect(parseFloat(width)).toBeGreaterThan(0);
  });
});
```

---

## 📊 Coverage

```bash
# Run tests with coverage
npm run test -- --coverage

# Open coverage report
open coverage/index.html
```

### Coverage Goals

| Tipo | Objetivo |
|---|---|
| Statements | >80% |
| Branches | >75% |
| Functions | >80% |
| Lines | >80% |

---

## 🔄 CI Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Docs](https://playwright.dev)
- [Testing Playground](https://testing-playground.com)
