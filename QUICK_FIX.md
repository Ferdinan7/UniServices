# 🚨 Solución Rápida: Loader Infinito en UI Trámites

## ⚠️ Problema
Los trámites no se muestran y se queda el loader infinito.

## ✅ Causa
Los servicios backend NO están corriendo. Necesitas levantar **3 servicios**:

1. **tramites-back** (puerto 3550) - Base de datos de trámites
2. **apigatewayUniversidad** (puerto 4000) - Gateway que valida tokens
3. **ui-tramites** (puerto 5173) - Frontend

## 🚀 Solución Rápida (3 terminales)

### Terminal 1: Backend de Trámites
```bash
cd services/tramites-back
npm install
npm run start:dev
```
Espera hasta ver: `Nest application successfully started`

### Terminal 2: API Gateway
```bash
cd services/apigatewayUniversidad
npm install
npm run start:dev
```
Espera hasta ver: `Application is running on: http://localhost:4000/api/v1`

### Terminal 3: Frontend
```bash
cd services/ui-tramites
npm install
npm run dev
```
Espera hasta ver: `Local: http://localhost:5173/`

## 🔍 Verificación Rápida

1. Abre http://localhost:5173
2. Haz login con Google
3. Deberías ver los trámites (sin loader infinito)

## 🐛 Si Aún No Funciona

### Verificar que los servicios estén corriendo:

```bash
# Windows
netstat -ano | findstr :3550
netstat -ano | findstr :4000
netstat -ano | findstr :5173

# Linux/Mac
lsof -ti:3550
lsof -ti:4000
lsof -ti:5173
```

### Verificar endpoint de trámites:
```bash
curl http://localhost:3550/tramites
```
Debería devolver un array de trámites.

### Verificar API Gateway:
```bash
curl http://localhost:4000/api/v1/health
```
Debería devolver `{"status":"ok"}`

### Revisar logs en la consola del navegador:
1. Abre http://localhost:5173
2. Presiona F12
3. Ve a la pestaña "Console"
4. Busca errores en rojo

## 📝 Notas Importantes

- **El token de Google OAuth ahora funciona correctamente** ✅
- Se pasa en la URL: `http://localhost:5173?access_token=...`
- También se guarda en localStorage
- El API Gateway ahora valida tokens de Supabase directamente

## 🔄 Orden de Inicio Recomendado

1. **Primero**: tramites-back (tiene los datos)
2. **Segundo**: apigatewayUniversidad (valida y hace proxy)
3. **Tercero**: ui-tramites (consume los endpoints)

## 💡 Pro Tip: Usar Turbo (Opcional)

Si tienes turbo configurado, puedes iniciar todos de una vez:

```bash
npm run dev
```

Pero es mejor iniciarlos uno por uno para ver los logs individuales.

## 🆘 Checklist de Debug

- [ ] ¿Está corriendo tramites-back en puerto 3550?
- [ ] ¿Está corriendo apigatewayUniversidad en puerto 4000?
- [ ] ¿Está corriendo ui-tramites en puerto 5173?
- [ ] ¿Te autenticaste correctamente con Google?
- [ ] ¿Hay un access_token en localStorage? (Revisa en F12 → Application → Local Storage)
- [ ] ¿Hay errores en la consola del navegador?
- [ ] ¿Los logs del API Gateway muestran peticiones entrantes?

## 🎯 Solución al 99% de los Casos

```bash
# Mata todos los procesos de Node (por si acaso hay zombies)
# Windows:
taskkill /F /IM node.exe

# Linux/Mac:
killall node

# Luego inicia todo de nuevo siguiendo los pasos de arriba
```

---

**TL;DR**: Necesitas 3 servicios corriendo. Si falta alguno, el loader será infinito.