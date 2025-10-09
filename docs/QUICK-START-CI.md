# 🚀 Quick Start - CI/CD Pipeline

Guía rápida para empezar a usar el pipeline CI/CD de UniServices.

## ✅ ¿Qué se implementó?

El pipeline CI/CD completo está listo y funcional. Incluye:

```
📦 Setup              → Instalación de dependencias con cache
↓
🔍 Lint               → ESLint + Prettier
↓
🧪 Test               → Tests unitarios + cobertura
↓
🏗️  Build             → Compilación de todos los servicios
↓
📚 Swagger Docs       → Generación automática de documentación
↓
📊 Summary            → Resumen del pipeline
```

## 🎯 Primeros Pasos

### 1. Verifica que todo funciona localmente

**Windows:**

```powershell
.\scripts\ci-local.ps1
```

**Linux/Mac:**

```bash
chmod +x scripts/ci-local.sh
./scripts/ci-local.sh
```

Si todo pasa ✅, estás listo para hacer push!

### 2. Haz tu primer push

```bash
git add .
git commit -m "feat: Setup CI/CD pipeline"
git push origin master
```

### 3. Observa el pipeline en acción

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **"Actions"**
3. Verás el workflow **"CI/CD Pipeline"** ejecutándose

## 📊 ¿Qué esperar?

El pipeline debería tardar aproximadamente **8-12 minutos** en completarse.

### Timeline esperado:

| Job     | Duración | Estado                     |
| ------- | -------- | -------------------------- |
| Setup   | ~2 min   | ⚙️ Instalando dependencias |
| Lint    | ~1 min   | 🔍 Verificando código      |
| Test    | ~3 min   | 🧪 Ejecutando tests        |
| Build   | ~4 min   | 🏗️ Compilando servicios    |
| Swagger | ~1 min   | 📚 Generando docs          |
| Summary | ~10 seg  | 📊 Resumen final           |

## 🎉 Al finalizar

Cuando el pipeline termine exitosamente:

✅ **Badge en el README:**

- El badge mostrará "passing" en verde

✅ **Artifacts disponibles:**

- Reportes de cobertura (30 días)
- Builds compilados (7 días)
- Documentación Swagger (90 días)

✅ **Resumen detallado:**

- Un resumen completo aparecerá en la página del workflow

## 📥 Descargar Artifacts

1. Ve a la ejecución del workflow en Actions
2. Scroll hasta la sección "Artifacts"
3. Click en el artifact que quieras descargar:
   - `coverage-reports` - Reportes de cobertura
   - `build-artifacts` - Builds compilados
   - `swagger-documentation` - Documentación API

## 🔧 Comandos Útiles

### Validar antes de push

```bash
# Windows
.\scripts\ci-local.ps1 all

# Linux/Mac
./scripts/ci-local.sh all
```

### Solo linting

```bash
# Windows
.\scripts\ci-local.ps1 lint

# Linux/Mac
./scripts/ci-local.sh lint
```

### Solo tests

```bash
# Windows
.\scripts\ci-local.ps1 test

# Linux/Mac
./scripts/ci-local.sh test
```

### Solo build

```bash
# Windows
.\scripts\ci-local.ps1 build

# Linux/Mac
./scripts/ci-local.sh build
```

## 🐛 Solución de Problemas

### ❌ El pipeline falla en "Lint"

**Solución:**

```bash
pnpm run lint
pnpm run format
```

Corrige los errores y vuelve a hacer push.

### ❌ El pipeline falla en "Test"

**Solución:**

```bash
pnpm run test
```

Verifica qué tests fallan y corrígelos.

### ❌ El pipeline falla en "Build"

**Solución:**

```bash
pnpm run build
```

Revisa los errores de compilación TypeScript.

### ❌ No veo el workflow en Actions

**Verificar:**

1. El archivo está en `.github/workflows/ci.yaml`
2. Has hecho push del archivo
3. Estás en una rama válida (master/main/develop)

## 📚 Documentación Completa

Para información más detallada:

- 📖 [Documentación Completa del Pipeline](CI-CD-PIPELINE.md)
- ✅ [Checklist Pre-Commit](PRE-COMMIT-CHECKLIST.md)
- ⚙️ [GitHub Actions README](../.github/workflows/README.md)

## 🎓 Mejores Prácticas

### ✅ Hacer

- ✅ Ejecuta el pipeline local antes de push
- ✅ Haz commits pequeños y frecuentes
- ✅ Escribe mensajes de commit descriptivos
- ✅ Revisa los logs del pipeline si falla
- ✅ Mantén las dependencias actualizadas

### ❌ Evitar

- ❌ Hacer push sin ejecutar tests localmente
- ❌ Ignorar errores del linter
- ❌ Commits gigantes con muchos cambios
- ❌ Mensajes de commit vagos ("fix", "update")
- ❌ Comentar código en lugar de eliminarlo

## 🌟 Tips Pro

### 1. Watch del pipeline

Puedes recibir notificaciones:

1. Ve a Settings → Notifications en GitHub
2. Configura notificaciones para Actions

### 2. Badges personalizados

Agrega más badges a tu README:

```markdown
[![Tests](https://github.com/Ferdinan7/UniServices/actions/workflows/ci.yaml/badge.svg?event=push)](https://github.com/Ferdinan7/UniServices/actions/workflows/ci.yaml)
```

### 3. Ver cobertura visual

Después de ejecutar tests:

```bash
# Windows
start services/*/coverage/lcov-report/index.html

# Linux
xdg-open services/*/coverage/lcov-report/index.html

# Mac
open services/*/coverage/lcov-report/index.html
```

## 📞 Soporte

¿Problemas? Revisa estos recursos:

1. [Troubleshooting en el pipeline](CI-CD-PIPELINE.md#-troubleshooting)
2. [GitHub Actions Docs](https://docs.github.com/en/actions)
3. [Issues del proyecto](https://github.com/Ferdinan7/UniServices/issues)

---

**¡Listo para desplegar!** 🚀

Tu pipeline CI/CD está configurado y listo para usar. Cada push activará automáticamente todas las validaciones para mantener la calidad del código.
