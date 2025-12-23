# 🎨 Guía de Estilo - Vercel + shadcn/ui

Template para replicar el estilo de DevToolkit en otras aplicaciones.

## 📦 Instalación Rápida

```bash
# 1. Inicializar shadcn/ui
npx shadcn@latest init

# 2. Seleccionar:
# - Style: New York
# - Base color: Neutral
# - CSS variables: Yes
```

## 🎨 Paleta de Colores

### Dark Theme (Principal)

```css
:root.dark {
  --background: #000000;        /* Negro puro */
  --foreground: #fafafa;        /* Casi blanco */
  --card: #171717;              /* Gris muy oscuro */
  --card-foreground: #fafafa;
  --popover: #171717;
  --popover-foreground: #fafafa;
  --primary: #0070f3;           /* Azul Vercel */
  --primary-foreground: #ffffff;
  --secondary: #262626;         /* Gris medio */
  --secondary-foreground: #fafafa;
  --muted: #262626;
  --muted-foreground: #a3a3a3;  /* Gris claro */
  --accent: #262626;
  --accent-foreground: #fafafa;
  --destructive: #e00;           /* Rojo */
  --border: #333333;             /* Borde sutil */
  --input: #262626;
  --ring: #0070f3;
}
```

### Light Theme

```css
:root.light {
  --background: #ffffff;
  --foreground: #171717;
  --card: #fafafa;
  --card-foreground: #171717;
  --popover: #fafafa;
  --popover-foreground: #171717;
  --primary: #0070f3;
  --primary-foreground: #ffffff;
  --secondary: #f5f5f5;
  --secondary-foreground: #171717;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --accent: #f5f5f5;
  --accent-foreground: #171717;
  --destructive: #e00;
  --border: #e5e5e5;
  --input: #f5f5f5;
  --ring: #0070f3;
}
```

## 🔤 Tipografía

```css
/* Importar Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Aplicar */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 📏 Sistema de Espaciado

```css
/* Múltiplos de 4px */
spacing: {
  '0': '0',
  '1': '0.25rem',   /* 4px */
  '2': '0.5rem',    /* 8px */
  '3': '0.75rem',   /* 12px */
  '4': '1rem',      /* 16px */
  '5': '1.25rem',   /* 20px */
  '6': '1.5rem',    /* 24px */
  '8': '2rem',      /* 32px */
  '10': '2.5rem',   /* 40px */
  '12': '3rem',     /* 48px */
  '16': '4rem',     /* 64px */
}
```

## 🔲 Border Radius

```css
--radius: 0.5rem;  /* 8px - Consistente en toda la app */
```

## 🎯 Componentes Base

### Button Variants

```tsx
// Primary (azul)
bg-primary hover:bg-primary/90 text-primary-foreground

// Secondary (gris)
bg-secondary hover:bg-secondary/80 text-secondary-foreground

// Outline (borde)
border border-border bg-background hover:bg-accent

// Ghost (transparente)
hover:bg-accent hover:text-accent-foreground
```

### Card

```tsx
bg-card border border-border rounded-lg
```

### Input/Textarea

```tsx
bg-input border border-border rounded-md
focus:ring-2 focus:ring-ring
```

## ✨ Animaciones Sutiles

```tsx
// Framer Motion
import { motion } from "framer-motion";

// Fade in
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Hover lift
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}
```

## 🎨 Principios de Diseño

1. **Minimalismo**: Menos es más
2. **Espaciado generoso**: Respiración entre elementos
3. **Contraste alto**: Texto legible siempre
4. **Consistencia**: Mismo estilo en toda la app
5. **Sutileza**: Animaciones discretas

## 📝 Ejemplo de Componente

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Action</Button>
      </CardContent>
    </Card>
  );
}
```

## 🚀 Stack Completo

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

---

**¡Listo!** Con esto puedes replicar el estilo en cualquier app.

