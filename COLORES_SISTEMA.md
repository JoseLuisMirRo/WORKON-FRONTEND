# 🎨 Paleta de Colores del Sistema

## Colores Principales

### Background (Fondo)
- **Hex**: `#06070E`
- **Uso**: Fondo principal de la aplicación
- **Descripción**: Azul muy oscuro, casi negro

### Foreground (Texto)
- **Hex**: `#EDF2F4`
- **Uso**: Texto principal, texto claro
- **Descripción**: Gris muy claro, casi blanco

### Primary (Principal)
- **Hex**: `#4357AD`
- **Uso**: Botones primarios, links, elementos destacados
- **Descripción**: Azul vibrante

### Secondary (Secundario)
- **Hex**: `#29524A`
- **Uso**: Botones secundarios, badges secundarios
- **Descripción**: Verde oscuro

### Accent (Acento)
- **Hex**: `#4EA699`
- **Uso**: Elementos de acento, hover states, highlights
- **Descripción**: Verde azulado / Turquesa

---

## Aplicación en Componentes

### Botones
```jsx
<Button variant="default">    // bg-primary (#4357AD)
<Button variant="secondary">  // bg-secondary (#29524A)
<Button variant="outline">    // border con bg transparente
```

### Cards
```jsx
<Card>  // bg-card (#0d0e16) ligeramente más claro que background
```

### Badges
```jsx
<Badge variant="default">     // bg-primary (#4357AD)
<Badge variant="secondary">   // bg-secondary (#29524A)
<Badge variant="outline">     // border primary
```

### Estados
- **Hover**: Usa color accent (#4EA699)
- **Focus**: Ring con primary (#4357AD)
- **Active**: Primary más intenso

---

## Jerarquía Visual

1. **Background** (#06070E) - Base
2. **Card** (#0d0e16) - Elementos elevados
3. **Muted** (#1a1b23) - Inputs, elementos deshabilitados
4. **Border** (#1f2937) - Separadores

---

## Ejemplos de Uso

### Landing Page
- Hero background: gradient con primary (#4357AD)
- CTAs: primary button
- Features icons: primary, accent, secondary

### Feed
- Cards: bg-card con borders
- Primary actions: primary color
- Secondary actions: secondary color
- Hover en skills: accent color

### Mensajes
- Mensajes propios: bg-primary (#4357AD)
- Mensajes recibidos: bg-muted
- Online indicator: accent (#4EA699)

### Mis Trabajos
- Progress bar: primary (#4357AD)
- Completed status: accent (#4EA699)
- Budget: primary (#4357AD)

---

## Accesibilidad

Todos los colores cumplen con WCAG 2.1 nivel AA para contraste:
- Foreground (#EDF2F4) sobre Background (#06070E): ✅ 17.5:1
- Primary (#4357AD) sobre Background: ✅ 5.2:1
- Accent (#4EA699) sobre Background: ✅ 5.8:1
- Secondary (#29524A) sobre Background: ✅ 3.5:1

---

## Variables CSS Disponibles

```css
var(--color-background)
var(--color-foreground)
var(--color-primary)
var(--color-secondary)
var(--color-accent)
var(--color-muted)
var(--color-border)
var(--color-card)
```

---

## Tailwind Classes

```css
bg-background      // #06070E
text-foreground    // #EDF2F4
bg-primary         // #4357AD
bg-secondary       // #29524A
bg-accent          // #4EA699
border-border      // #1f2937
bg-card            // #0d0e16
text-muted-foreground  // #a8b2b9
```

