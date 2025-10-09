# UniServices Monorepo

[![CI/CD Pipeline](https://github.com/Ferdinan7/UniServices/actions/workflows/ci.yaml/badge.svg)](https://github.com/Ferdinan7/UniServices/actions/workflows/ci.yaml)

Monorepo para todos los servicios de UniServices usando Turborepo + pnpm workspaces.

## 🚀 Inicio Rápido

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Ferdinan7/UniServices.git
   cd UniServices
   ```

2. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

3. **Configuración de variables de entorno:**
   Los archivos `.env` ya están incluidos en el repositorio para facilitar el setup:

   - `services/Auth-back-service/.env` - Configuración de Supabase y puerto 3000
   - `services/apigatewayUniversidad/.env` - Configuración del API Gateway y puerto 4000
   - `services/tramites-back/.env` - Configuración de Supabase y puerto 3550

4. **Ejecutar todos los servicios en modo desarrollo:**
   ```bash
   pnpm turbo run dev
   ```

## 📁 Estructura del Proyecto

```
UniServices/
├── services/
│   ├── Auth-back-service/        # Servicio de autenticación (NestJS + GraphQL)
│   ├── apigatewayUniversidad/    # API Gateway principal (NestJS + REST)
│   ├── tramites-back/            # API de trámites (NestJS + REST)
│   ├── ui-tramites/             # Frontend de trámites (Svelte + Vite)
│   └── uniauth/                 # Componente de autenticación (Stencil)
├── package.json                 # Configuración raíz
├── turbo.json                  # Configuración de Turborepo
└── pnpm-workspace.yaml         # Configuración de workspaces
```

## 🌐 Servicios y Puertos

| Servicio          | Puerto | URL                            | Descripción                  |
| ----------------- | ------ | ------------------------------ | ---------------------------- |
| **ui-tramites**   | 5173   | http://localhost:5173          | Frontend principal           |
| **apigateway**    | 4000   | http://localhost:4000/api/v1   | API Gateway principal        |
| **auth-back**     | 3000   | http://localhost:3000/graphql  | API GraphQL de autenticación |
| **tramites-back** | 3550   | http://localhost:3550/tramites | API REST de trámites         |
| **uniauth**       | 3333   | http://localhost:3333          | Componente de autenticación  |

## 🛠️ Comandos Disponibles

```bash
# Ejecutar todos los servicios en desarrollo
pnpm turbo run dev

# Compilar todos los servicios
pnpm turbo run build

# Limpiar builds
pnpm turbo run clean

# Instalar dependencias
pnpm install

# Ejecutar servicio específico
pnpm --filter ui-tramites dev
pnpm --filter apigatewayUniversidad dev
pnpm --filter auth-back dev
pnpm --filter tramites-back dev
pnpm --filter uniauth dev
```

## 🔧 Tecnologías

- **🏧 Monorepo:** Turborepo + pnpm workspaces
- **🎨 Frontend:** Svelte + Vite + TailwindCSS
- **🚀 Backend:** NestJS + TypeScript
- **📊 GraphQL:** Apollo Server
- **🔧 Components:** Stencil.js

## 📋 Requisitos

- Node.js 18+
- pnpm 8+
- Git

## 🔄 CI/CD Pipeline

El proyecto cuenta con un pipeline automatizado de CI/CD usando GitHub Actions que incluye:

- ✅ **Instalación de dependencias** con cache optimizado
- 🔍 **Linting** con ESLint y Prettier
- 🧪 **Tests unitarios** con reportes de cobertura
- 🏗️ **Build** de todos los servicios
- 📚 **Documentación Swagger** generada automáticamente

### Estado del Pipeline

El pipeline se ejecuta automáticamente en:

- Push a `master`, `main` o `develop`
- Pull requests hacia `master`, `main` o `develop`

### Ejecutar CI/CD Localmente

Antes de hacer push, puedes ejecutar las mismas validaciones del CI/CD localmente:

**Windows (PowerShell):**

```powershell
# Ejecutar todo el pipeline
.\scripts\ci-local.ps1

# Ejecutar solo linting
.\scripts\ci-local.ps1 lint

# Ejecutar solo tests
.\scripts\ci-local.ps1 test
```

**Linux/Mac (Bash):**

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x scripts/ci-local.sh

# Ejecutar todo el pipeline
./scripts/ci-local.sh

# Ejecutar solo linting
./scripts/ci-local.sh lint

# Ejecutar solo tests
./scripts/ci-local.sh test
```

Ver [documentación completa del pipeline](docs/CI-CD-PIPELINE.md) para más detalles.
