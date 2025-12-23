# 🚨 Patrón de Visualización de Errores

Cómo mostrar errores de forma consistente y elegante (estilo Vercel/Next.js).

## 📦 Componente Reutilizable

```tsx
// components/shared/error-display.tsx
import { ErrorDisplay } from "@/components/shared/error-display";

// Uso básico
<ErrorDisplay error="Something went wrong" />

// Múltiples errores
<ErrorDisplay 
  error={["Error 1", "Error 2"]} 
  title="Validation Errors"
/>

// Con dismiss
<ErrorDisplay 
  error={error} 
  onDismiss={() => setError(null)}
/>
```

## 🎨 Variantes

### 1. Default (Card completo)
```tsx
<ErrorDisplay error={error} />
```
- Card con borde rojo
- Icono de alerta
- Título y mensaje

### 2. Inline (dentro de contenido)
```tsx
<ErrorDisplay error={error} variant="inline" />
```
- Banner compacto
- Fondo rojo suave
- Sin card

### 3. Minimal (solo texto)
```tsx
<ErrorDisplay error={error} variant="minimal" />
```
- Solo texto rojo
- Para espacios pequeños

## 🎯 Patrón de Uso

### En Formularios

```tsx
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
  try {
    // ... lógica
  } catch (err) {
    setError(err.message);
  }
};

return (
  <form>
    {error && (
      <ErrorDisplay 
        error={error} 
        onDismiss={() => setError(null)}
      />
    )}
    {/* ... campos */}
  </form>
);
```

### En Validación

```tsx
const [errors, setErrors] = useState<string[]>([]);

const validate = () => {
  const newErrors: string[] = [];
  if (!email) newErrors.push("Email is required");
  if (!password) newErrors.push("Password is required");
  setErrors(newErrors);
};

return (
  <>
    {errors.length > 0 && (
      <ErrorDisplay 
        error={errors}
        title="Validation Errors"
        variant="inline"
      />
    )}
  </>
);
```

## 🎨 Estilos CSS

```css
/* Error colors */
--destructive: #e00;
--destructive-foreground: #ffffff;

/* Error display */
.error-card {
  border: 1px solid color-mix(in srgb, var(--destructive) 50%, transparent);
  background: color-mix(in srgb, var(--destructive) 10%, var(--background));
}

.error-text {
  color: var(--destructive);
}
```

## 📝 Ejemplo Completo

```tsx
"use client";

import { useState } from "react";
import { ErrorDisplay } from "@/components/shared/error-display";
import { Button } from "@/components/ui/button";

export function MyForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Tu lógica aquí
      await someAsyncOperation();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <ErrorDisplay 
          error={error}
          onDismiss={() => setError(null)}
        />
      )}
      
      <Button onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  );
}
```

## ✨ Características

- ✅ **Consistente**: Mismo estilo en toda la app
- ✅ **Accesible**: Iconos y colores claros
- ✅ **Dismissible**: Puede cerrarse
- ✅ **Flexible**: 3 variantes diferentes
- ✅ **Múltiples errores**: Soporta arrays

---

**¡Listo!** Copia el componente y úsalo en cualquier proyecto.

