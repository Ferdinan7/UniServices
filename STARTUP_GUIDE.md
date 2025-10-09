# 🚀 Guía de Inicio - UniServices

## 📋 Resumen del Problema

Si los trámites no se muestran y se queda en el loader, es porque **los servicios backend no están corriendo**. Este documento explica cómo levantar todos los servicios necesarios.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│   ui-tramites   │ (Puerto 5173 - Frontend Svelte)
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │ (Puerto 4000 - NestJS)
│  (Gateway)      │
└────────┬────────┘
         │
         ├──────────────────┐
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ tramites-back   │  │  Auth-back      │
│ (Microservicio) │  │  (GraphQL)      │
│ Puerto 3550     │  │  Puerto 3000    │
└─────────────────┘  └─────────────────┘
```

## 🔐 Flujo de Autenticación

1. Usuario se autentica con Google OAuth en `uniauth` (puerto 3333)
2. Google redirige a `http://localhost:5173` con el `access_token`
3. `ui-tramites` guarda el token y hace peticiones al API Gateway (puerto 4000)
4. API Gateway valida el token con Supabase
5. Si es válido, proxy la petición a `tramites-back` (puerto 3550)

## 📦 Servicios Necesarios

### 1. **uniauth** (Puerto 3333) - Componente de Autenticación
```bash
cd services/uniauth
npm install
npm run dev
```

### 2. **tramites-back** (Puerto 3550) - Backend de Trámites
```bash
cd services/tramites-back
npm install
npm run start:dev
```

### 3. **apigatewayUniversidad** (Puerto 4000) - API Gateway
```bash
cd services/apigatewayUniversidad
npm install @supabase/supabase-js  # Ya instalado
npm run start:dev
```

### 4. **ui-tramites** (Puerto 5173) - Frontend
```bash
cd services/ui-tramites
npm install
npm run dev
```

### 5. **Auth-back** (Puerto 3000) - Servicio GraphQL de Auth [OPCIONAL]
Este servicio es opcional si usas solo Google OAuth, ya que la validación se hace directamente con Supabase.

```bash
cd services/Auth-back-service
npm install
npm run start:dev
```

## 🚦 Orden de Inicio Recomendado

```bash
# Terminal 1: Backend de Trámites
cd services/tramites-back
npm run start:dev

# Terminal 2: API Gateway
cd services/apigatewayUniversidad
npm run start:dev

# Terminal 3: Auth UI (Stencil)
cd services/uniauth
npm run dev

# Terminal 4: Frontend (Svelte)
cd services/ui-tramites
npm run dev
```

## 🔍 Verificar que los Servicios Están Corriendo

### Verificar tramites-back (Puerto 3550)
```bash
curl http://localhost:3550/tramites
```

**Respuesta esperada:** Array de trámites

### Verificar API Gateway (Puerto 4000)
```bash
curl http://localhost:4000/api/v1/health
```

**Respuesta esperada:** `{ "status": "ok" }`

### Verificar endpoint de trámites agrupados (CON token)
```bash
curl -H "Authorization: Bearer TU_TOKEN_AQUI" http://localhost:4000/api/v1/tramites/grouped
```

**Respuesta esperada:** Array de grupos de trámites

### Verificar uniauth (Puerto 3333)
Abre en el navegador: `http://localhost:3333`

**Respuesta esperada:** Componente de autenticación visible

### Verificar ui-tramites (Puerto 5173)
Abre en el navegador: `http://localhost:5173`

**Respuesta esperada:** Interfaz de trámites (después de autenticarse)

## 🐛 Troubleshooting

### Problema: "Se queda en el loader sin mostrar nada"

**Causa:** Los servicios backend no están corriendo o hay un error de autenticación.

**Solución:**
1. Verifica que todos los servicios estén corriendo (especialmente tramites-back y apigatewayUniversidad)
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que el token se esté guardando correctamente en localStorage:
   ```javascript
   console.log(localStorage.getItem('access_token'));
   ```

### Problema: "Error 401 Unauthorized"

**Causa:** El token no es válido o no se está enviando correctamente.

**Solución:**
1. Cierra sesión y vuelve a autenticarte con Google
2. Verifica que el token esté en la URL después de la redirección
3. Revisa los logs del API Gateway para ver el error específico

### Problema: "Error al obtener trámites: Service Unavailable"

**Causa:** El servicio `tramites-back` no está corriendo.

**Solución:**
```bash
cd services/tramites-back
npm run start:dev
```

### Problema: "Cannot find module '@supabase/supabase-js'"

**Causa:** El paquete de Supabase no está instalado en el API Gateway.

**Solución:**
```bash
cd services/apigatewayUniversidad
npm install @supabase/supabase-js
```

### Problema: El puerto ya está en uso

**Solución:** Encuentra y mata el proceso que está usando el puerto:

**Windows:**
```bash
# Encontrar el proceso
netstat -ano | findstr :4000

# Matar el proceso (reemplaza PID con el número que te dio el comando anterior)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Encontrar y matar el proceso
lsof -ti:4000 | xargs kill -9
```

## 📝 Variables de Entorno

### API Gateway (.env)
```env
PORT=4000
API_PREFIX=api/v1

# Servicios
AUTH_SERVICE_URL=http://localhost:3000/graphql
TRAMITES_SERVICE_URL=http://localhost:3550/tramites

# Supabase
SUPABASE_URL=https://sirtkdkbqsklncyoallp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA
```

### tramites-back (.env)
```env
PORT=3550
DATABASE_URL=tu_database_url_aqui
```

## 🔄 Flujo Completo de la Aplicación

1. **Usuario accede a localhost:5173**
   - Si no hay token, redirige a la página de autenticación

2. **Usuario hace clic en "Sign in with Google"**
   - Se inicia el flujo OAuth con Google
   - Google redirige de vuelta con el código de autorización

3. **Callback de Google**
   - El componente `auth-widget` procesa el callback
   - Extrae el `access_token` de Supabase
   - Guarda el token en localStorage
   - Redirige a `http://localhost:5173?access_token=...&user_id=...&user_email=...`

4. **ui-tramites recibe el token**
   - Lee el token de la URL o localStorage
   - Verifica que sea válido (formato JWT)
   - Hace petición a `http://localhost:4000/api/v1/tramites/grouped` con el token

5. **API Gateway valida el token**
   - Recibe la petición con `Authorization: Bearer TOKEN`
   - El `AuthGuard` valida el token con Supabase
   - Si es válido, hace proxy a `http://localhost:3550/tramites/grouped`

6. **tramites-back devuelve los datos**
   - El API Gateway devuelve la respuesta al frontend
   - ui-tramites muestra los trámites agrupados

## 🎯 Checklist de Inicio Rápido

- [ ] Instalar dependencias en todos los servicios (`npm install`)
- [ ] Verificar que el puerto 3550 esté libre (tramites-back)
- [ ] Verificar que el puerto 4000 esté libre (apigatewayUniversidad)
- [ ] Verificar que el puerto 3333 esté libre (uniauth)
- [ ] Verificar que el puerto 5173 esté libre (ui-tramites)
- [ ] Iniciar tramites-back
- [ ] Iniciar apigatewayUniversidad
- [ ] Iniciar uniauth
- [ ] Iniciar ui-tramites
- [ ] Autenticarse con Google
- [ ] Verificar que los trámites se muestren

## 📚 Comandos Útiles

### Ver todos los puertos en uso
```bash
# Windows
netstat -ano | findstr :PUERTO

# Linux/Mac
lsof -ti:PUERTO
```

### Logs en tiempo real
Todos los servicios de NestJS tienen logs automáticos. Revisa la terminal donde iniciaste cada servicio.

### Limpiar caché de node_modules
Si algo no funciona después de instalar dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🆘 Soporte

Si después de seguir esta guía los trámites aún no se muestran:

1. Captura de pantalla de la consola del navegador (F12)
2. Logs de todos los servicios backend
3. Resultado de `curl http://localhost:4000/api/v1/health`
4. Resultado de `curl http://localhost:3550/tramites`

---

**Última actualización:** 2024