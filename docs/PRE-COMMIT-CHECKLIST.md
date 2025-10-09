# ✅ Checklist Pre-Commit

Usa esta lista antes de hacer commit y push para asegurarte de que tu código pasará el pipeline CI/CD.

## 📋 Checklist Rápido

Ejecuta este comando para verificar todo de una vez:

**Windows:**

```powershell
.\scripts\ci-local.ps1
```

**Linux/Mac:**

```bash
./scripts/ci-local.sh
```

## 📝 Checklist Manual

Si prefieres ejecutar las validaciones manualmente:

### 1. ✅ Código limpio y formateado

```bash
# Formatear el código
pnpm run format

# Verificar linting
pnpm run lint
```

**¿Qué verificar?**

- [ ] No hay errores de ESLint
- [ ] El código está formateado correctamente con Prettier
- [ ] No hay warnings importantes

### 2. ✅ Tests pasando

```bash
# Ejecutar todos los tests
pnpm run test

# Con cobertura
pnpm run test:cov
```

**¿Qué verificar?**

- [ ] Todos los tests pasan
- [ ] No hay tests skipped sin justificación
- [ ] La cobertura no ha disminuido significativamente
- [ ] Los nuevos features tienen tests

### 3. ✅ Build exitoso

```bash
# Compilar todos los servicios
pnpm run build
```

**¿Qué verificar?**

- [ ] Todos los servicios compilan sin errores
- [ ] No hay errores de TypeScript
- [ ] Los tipos están correctamente definidos

### 4. ✅ Dependencias actualizadas

```bash
# Instalar dependencias
pnpm install
```

**¿Qué verificar?**

- [ ] `pnpm-lock.yaml` está actualizado
- [ ] No hay vulnerabilidades críticas
- [ ] Las versiones de paquetes son compatibles

### 5. ✅ Archivos de configuración

**¿Qué verificar?**

- [ ] `.env` no se ha commiteado (debe estar en `.gitignore`)
- [ ] Los archivos de configuración están completos
- [ ] No hay secretos hardcodeados en el código

### 6. ✅ Git

**¿Qué verificar?**

- [ ] El commit message es descriptivo
- [ ] Los archivos innecesarios no están incluidos
- [ ] No hay archivos de build/dist commiteados (a menos que sean necesarios)

### 7. ✅ Documentación

**¿Qué verificar?**

- [ ] El README está actualizado si hay cambios importantes
- [ ] Los comentarios del código están actualizados
- [ ] Los nuevos endpoints tienen documentación Swagger

## 🚨 Errores Comunes

### Error: "Lint failed"

**Causa:** Errores de ESLint o formato.

**Solución:**

```bash
pnpm run lint  # Ver errores
pnpm run format  # Formatear automáticamente
```

### Error: "Tests failed"

**Causa:** Tests fallidos o rotos.

**Solución:**

1. Ejecuta `pnpm run test` para ver qué tests fallan
2. Corrige los tests o el código
3. Verifica que los nuevos cambios no rompan tests existentes

### Error: "Build failed"

**Causa:** Errores de compilación TypeScript.

**Solución:**

1. Ejecuta `pnpm run build` para ver los errores
2. Revisa los tipos y las importaciones
3. Asegúrate de que todas las dependencias estén instaladas

### Error: "Module not found"

**Causa:** Dependencia faltante.

**Solución:**

```bash
pnpm install  # Reinstalar dependencias
```

## 🎯 Buenas Prácticas

### Commits Frecuentes y Pequeños

- ✅ Haz commits frecuentes con cambios pequeños
- ❌ Evita commits gigantes con muchos cambios

### Mensajes de Commit Descriptivos

**Bueno:**

```
feat: Add user authentication with JWT
fix: Resolve memory leak in tramites service
docs: Update API documentation
```

**Malo:**

```
update
fixes
wip
```

### Testing

- ✅ Escribe tests para nuevos features
- ✅ Actualiza tests cuando cambies código existente
- ✅ Ejecuta tests antes de hacer commit

### Code Review

Antes de abrir un Pull Request:

- [ ] El código está limpio y formateado
- [ ] Todos los tests pasan
- [ ] El build es exitoso
- [ ] La documentación está actualizada
- [ ] No hay console.logs o código de debugging
- [ ] El código sigue las convenciones del proyecto

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrolla tu feature en una rama**

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrolla y prueba localmente**

   ```bash
   pnpm run dev  # Modo desarrollo
   ```

3. **Ejecuta el checklist**

   ```bash
   .\scripts\ci-local.ps1  # Windows
   ./scripts/ci-local.sh   # Linux/Mac
   ```

4. **Commit y push**

   ```bash
   git add .
   git commit -m "feat: Add nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

5. **Abre un Pull Request**

   - El pipeline CI/CD se ejecutará automáticamente
   - Espera el review de otros desarrolladores
   - Corrige cualquier issue encontrado

6. **Merge a la rama principal**
   - Una vez aprobado el PR y el CI pase
   - Usa "Squash and merge" para commits limpios

## 📚 Recursos

- [Documentación del Pipeline CI/CD](CI-CD-PIPELINE.md)
- [Guía de GitHub Actions](../.github/workflows/README.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [NestJS Best Practices](https://docs.nestjs.com/techniques/performance)

## 💡 Tips

### Ejecutar solo lo que cambió

Si solo modificaste un servicio específico:

```bash
# Solo lint de un servicio
pnpm --filter apigatewayUniversidad lint

# Solo tests de un servicio
pnpm --filter auth-back test

# Solo build de un servicio
pnpm --filter tramites-back build
```

### Ver cobertura de tests

Después de ejecutar los tests con cobertura:

```bash
# Windows
start services/apigatewayUniversidad/coverage/lcov-report/index.html

# Linux
xdg-open services/apigatewayUniversidad/coverage/lcov-report/index.html

# Mac
open services/apigatewayUniversidad/coverage/lcov-report/index.html
```

### Limpiar builds anteriores

```bash
# Con el script
.\scripts\ci-local.ps1 clean  # Windows
./scripts/ci-local.sh clean   # Linux/Mac

# Manual
rm -rf services/*/dist services/*/build services/*/coverage
```

---

**Recuerda:** ¡El pipeline CI/CD está aquí para ayudarte! Si falla, es una oportunidad para mejorar el código antes de que llegue a producción. 🚀
