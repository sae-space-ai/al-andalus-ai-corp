# Guía de Contribución

¡Gracias por tu interés en contribuir a Al Andalus AI Corp! 🏰

---

## 🎯 Cómo Contribuir

### 1. Reportar Bugs

- Usa [GitHub Issues](https://github.com/alandalus-ai/web/issues)
- Incluye pasos para reproducir el error
- Adjunta screenshots si es posible
- Indica navegador y versión

### 2. Sugerir Mejoras

- Abre un issue con el label `enhancement`
- Describe la mejora y su beneficio
- Incluye mockups si aplica

### 3. Contribuir Código

#### Proceso

1. **Fork** el repositorio
2. **Clona** tu fork:
   ```bash
   git clone https://github.com/TU_USERNAME/web.git
   cd web
   ```
3. **Crea una rama**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   # o
   git checkout -b fix/arreglar-bug
   ```
4. **Instala dependencias**:
   ```bash
   npm install
   ```
5. **Haz tus cambios**:
   - Sigue el estilo de código existente
   - Añade tests si es necesario
   - Actualiza la documentación
6. **Commitea tus cambios**:
   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```
7. **Push a tu fork**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
8. **Abre un Pull Request** en GitHub

---

## 📝 Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[scope opcional]: <descripción>

[body opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar código)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Cambios en build o herramientas

### Ejemplos

```bash
feat: añadir demo de análisis en vivo
fix: corregir error en calculadora
docs: actualizar README con instrucciones de instalación
style: formatear código con Prettier
refactor: simplificar lógica del wizard
test: añadir tests para componente Navbar
chore: actualizar dependencias
```

---

## 🎨 Estilo de Código

### TypeScript

- Usa TypeScript estricto
- Evita `any` siempre que sea posible
- Define interfaces para props y estados
- Usa tipos union en lugar de enums cuando sea posible

```typescript
// ✅ Bien
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ Evitar
interface ButtonProps {
  label: any;
  onClick: Function;
  variant: string;
}
```

### React

- Usa componentes funcionales con hooks
- Separa lógica de presentación
- Usa TypeScript para props
- Memoiza cuando sea necesario

```typescript
// ✅ Bien
const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
};

// ❌ Evitar
class Button extends React.Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}
```

### CSS / Tailwind

- Usa clases de Tailwind en lugar de CSS custom
- Sigue el sistema de diseño existente
- Usa colores del tema (green-*)
- Mantén la consistencia visual

```tsx
// ✅ Bien
<div className="bg-green-600 text-white px-4 py-2 rounded-lg">
  Contenido
</div>

// ❌ Evitar
<div style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 16px' }}>
  Contenido
</div>
```

---

## 🧪 Tests

### Antes de Commitear

```bash
# Verificar tipos
npm run typecheck

# Ejecutar tests
npm run test

# Verificar lint
npm run lint
```

### Escribir Tests

- Añade tests para nuevas funcionalidades
- Mantén coverage >80%
- Usa nombres descriptivos para tests

```typescript
describe('Componente', () => {
  it('debería hacer algo específico cuando ocurre X', () => {
    // Arrange
    const props = { ... };
    
    // Act
    render(<Component {...props} />);
    
    // Assert
    expect(screen.getByText('texto')).toBeInTheDocument();
  });
});
```

---

## 🌍 Traducciones

El proyecto soporta Español e Inglés. Al añadir texto:

```typescript
// ✅ Bien - Usar condicional de idioma
<h1>{lang === 'es' ? 'Título en Español' : 'Title in English'}</h1>

// ❌ Evitar - Solo un idioma
<h1>Título solo en Español</h1>
```

### Añadir Nuevo Idioma

1. Actualiza el tipo `Lang` en `App.tsx`
2. Añade traducciones en todos los componentes
3. Actualiza el selector de idioma en Navbar
4. Actualiza hreflang tags en `index.html`

---

## 📚 Documentación

- Actualiza el README si añades funcionalidades
- Documenta funciones complejas con JSDoc
- Añade comentarios en código no obvio
- Actualiza CHANGELOG.md

```typescript
/**
 * Analiza un binario y extrae sus dependencias
 * 
 * @param binaryData - Datos del binario en buffer
 * @param options - Opciones de análisis
 * @returns Resultado del análisis con módulos y dependencias
 * 
 * @example
 * const result = await analyzeBinary(buffer, { deep: true });
 * console.log(result.modules); // 142
 */
async function analyzeBinary(binaryData: Buffer, options: AnalysisOptions): Promise<AnalysisResult> {
  // ...
}
```

---

## 🔄 Pull Request Process

### Checklist antes de abrir PR

- [ ] El código compila sin errores (`npm run typecheck`)
- [ ] Los tests pasan (`npm run test`)
- [ ] El lint pasa (`npm run lint`)
- [ ] La documentación está actualizada
- [ ] Los commits siguen convenciones
- [ ] No hay conflictos con main
- [ ] El código está formateado (`npm run format`)

### Descripción del PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Testing
Describe cómo probaste los cambios

## Screenshots
Si aplica, añade screenshots

## Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He actualizado la documentación
- [ ] He añadido tests
- [ ] Los tests pasan localmente
```

---

## 🏰 Código de Conducta

### Nuestros Compromisos

- Ser respetuosos e inclusivos
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

### Comportamiento Inaceptable

- Uso de lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes
- Acoso público o privado
- Publicar información privada sin consentimiento
- Otra conducta poco ética

---

## 💬 Comunicación

- **GitHub Issues**: Bugs y feature requests
- **Discord**: Chat en tiempo real
- **Twitter**: Anuncios y updates

---

## 🎁 Reconocimiento

Los contribuidores serán reconocidos en:

- README.md (sección de contribuidores)
- CHANGELOG.md
- Releases notes

---

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la licencia MIT del proyecto.

---

¡Gracias por contribuir a hacer Al Andalus AI mejor! 🏰✨
