# 🔧 Troubleshooting - DevToolkit

## ✅ Estado del Proyecto

El proyecto compila correctamente. Todos los archivos están en orden.

## 🚨 Problemas Comunes y Soluciones

### Error 500 en Desarrollo

**Síntomas:**

- `GET http://localhost:3004/ 500 (Internal Server Error)`
- `GET http://localhost:3004/tools/stats 500 (Internal Server Error)`

**Soluciones:**

1. **Reiniciar el servidor completamente:**

   ```bash
   # Detén el servidor (Ctrl+C)
   cd devtoolkit
   rm -rf .next
   npm run dev
   ```

2. **Limpiar caché del navegador:**

   - Chrome/Edge: Ctrl+Shift+Delete → Limpiar caché
   - O usar modo incógnito

3. **Verificar que no haya procesos duplicados:**

   ```bash
   # Windows PowerShell
   Get-Process node | Stop-Process -Force
   ```

4. **Verificar el puerto:**
   - Asegúrate de que el puerto 3004 esté libre
   - O cambia el puerto: `npm run dev -- -p 3005`

### ERR_CONNECTION_REFUSED

**Síntomas:**

- `ERR_CONNECTION_REFUSED` en el navegador
- El servidor no responde o se detuvo

**Soluciones:**

1. **Eliminar archivo de lock:**

   ```bash
   cd devtoolkit
   rm -f .next/dev/lock
   npm run dev
   ```

2. **Verificar que el servidor esté corriendo:**

   ```bash
   # Verificar procesos en el puerto 3004
   netstat -ano | findstr :3004

   # Si no hay proceso LISTENING, iniciar servidor:
   cd devtoolkit
   npm run dev
   ```

3. **Si el puerto está ocupado:**

   ```bash
   # Windows PowerShell - Encontrar y matar proceso
   netstat -ano | findstr :3004
   # Usar el PID de la salida anterior
   taskkill /F /PID <PID>

   # Luego reiniciar
   cd devtoolkit
   npm run dev
   ```

### Errores de Hidratación

**Síntomas:**

- `Hydration failed because the server rendered HTML didn't match the client`
- `Maximum update depth exceeded`

**Solución:**

- Ya están corregidos en el código
- Si persisten, recarga la página (F5)

### ChunkLoadError

**Síntomas:**

- `ChunkLoadError: Failed to load chunk`

**Solución:**

- Es normal en desarrollo con Turbopack
- Simplemente recarga la página
- No afecta la producción

## 📋 Checklist de Verificación

- [x] Build compila sin errores
- [x] TypeScript sin errores
- [x] Todas las herramientas implementadas (35 herramientas)
- [x] Sistema de compartir resultados
- [x] Recent Tools en sidebar
- [x] Templates/Saved Configs
- [x] Estadísticas Dashboard
- [x] Iconos PWA creados

## 🔍 Verificar Estado

```bash
# 1. Verificar que compila
cd devtoolkit
npm run build

# 2. Si compila, iniciar servidor
npm run dev

# 3. Abrir en navegador
# http://localhost:3000 (o el puerto que uses)
```

## 💡 Si Nada Funciona

1. **Cerrar todas las terminales**
2. **Eliminar node_modules y reinstalar:**

   ```bash
   cd devtoolkit
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

3. **Verificar versión de Node.js:**
   ```bash
   node --version  # Debe ser >= 18
   ```

## 📞 Información Útil

- **Framework:** Next.js 16.1.1
- **Bundler:** Turbopack
- **Total Herramientas:** 35
- **Puerto por defecto:** 3004 (configurado en package.json)

---

**Nota:** Los errores 500 en desarrollo suelen ser temporales y se resuelven reiniciando el servidor.
