# 🚀 Quick Start - Aplicar Estilo en Otra App

## Paso 1: Instalar shadcn/ui

```bash
npx shadcn@latest init
# Selecciona: New York style, Neutral, CSS variables
```

## Paso 2: Copiar Colores

Copia las variables CSS de `app/globals.css` (líneas 57-123) a tu `globals.css`

## Paso 3: Configurar Fuente

```tsx
// layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
```

## Paso 4: Aplicar en HTML

```tsx
<html className="dark">
  <body className={inter.variable}>
```

## Paso 5: Usar Componentes

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

<Card>
  <Button>Click me</Button>
</Card>
```

## ✅ Listo!

Ya tienes el mismo estilo que DevToolkit.

