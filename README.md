# UniServices Monorepo

Monorepo para todos los servicios de UniServices usando Turborepo + pnpm workspaces.

## 🚀 Inicio Rápido

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/UniServices.git
   cd UniServices
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Ejecutar todos los servicios en modo desarrollo:**
   ```bash
   pnpm turbo run dev
   ```

## 📁 Estructura del Proyecto

```
UniServices/
├── services/
│   ├── Auth-back-service/     # Servicio de autenticación (NestJS + GraphQL)
│   ├── tramites-back/         # API de trámites (NestJS + REST)
│   ├── ui-tramites/          # Frontend de trámites (Svelte + Vite)
│   └── uniauth/              # Componente de autenticación (Stencil)
├── package.json              # Configuración raíz
├── turbo.json               # Configuración de Turborepo
└── pnpm-workspace.yaml      # Configuración de workspaces
```

## 🌐 Servicios y Puertos

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **ui-tramites** | 5173 | http://localhost:5173 | Frontend principal |
| **auth-back** | 3000 | http://localhost:3000/graphql | API GraphQL de autenticación |
| **tramites-back** | 3550 | http://localhost:3550/tramites | API REST de trámites |
| **uniauth** | 3333 | http://localhost:3333 | Componente de autenticación |

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
pnpm --filter auth-back dev
pnpm --filter tramites-back dev
pnpm --filter uniauth dev
```

## 🔧 Tecnologías

- **🏗️ Monorepo:** Turborepo + pnpm workspaces
- **🎨 Frontend:** Svelte + Vite + TailwindCSS
- **🚀 Backend:** NestJS + TypeScript
- **📊 GraphQL:** Apollo Server
- **🔧 Components:** Stencil.js

## 📝 Desarrollo

### Agregar nueva dependencia a un servicio:
```bash
pnpm --filter NOMBRE_SERVICIO add DEPENDENCIA
```

### Agregar dependencia de desarrollo:
```bash
pnpm --filter NOMBRE_SERVICIO add -D DEPENDENCIA
```

## 🤝 Contribución

1. Crear una branch desde `main`
2. Hacer tus cambios
3. Asegurarse de que todos los servicios compilen: `pnpm turbo run build`
4. Crear Pull Request

## 📋 Requisitos

- Node.js 18+
- pnpm 8+
- Git