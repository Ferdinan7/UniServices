# UniServices Monorepo

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

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **ui-tramites** | 5173 | http://localhost:5173 | Frontend principal |
| **apigateway** | 4000 | http://localhost:4000/api/v1 | API Gateway principal |
| **auth-back** | 3000 | http://localhost:3000/graphql | API GraphQL de autenticación |
| **tramites-back** | 3550 | http://localhost:3550/tramites | API REST de trámites |
| **uniauth** | 3333 | http://localhost:3333 | Componente de autenticación |

## 🛠️ Comandos Disponibles

### 🚀 Desarrollo

```bash
# Ejecutar todos los servicios en desarrollo
pnpm turbo run dev

# Ejecutar servicio específico
pnpm --filter ui-tramites dev
pnpm --filter apigatewayUniversidad dev
pnpm --filter auth-back dev
pnpm --filter tramites-back dev
pnpm --filter uniauth dev
```

### 🧪 Testing y Cobertura

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests con cobertura
pnpm test:coverage

# Ejecutar tests en modo watch
pnpm test:watch

# Ejecutar tests en CI
pnpm test:ci

# Generar reporte completo de tests y patrones de diseño
pnpm test:report
```

### 📊 Tests por Servicio

```bash
# ui-tramites (Vitest) - Patrón Abstract Factory
cd services/ui-tramites
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Tests con cobertura
pnpm test:watch              # Modo watch

# tramites-back (Jest) - Patrón DAO
cd services/tramites-back
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Tests con cobertura
pnpm test:watch              # Modo watch

# uniauth (Stencil) - Patrón Strategy
cd services/uniauth
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Tests con cobertura
pnpm test:watch              # Modo watch

# apigatewayUniversidad (Jest)
cd services/apigatewayUniversidad
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Tests con cobertura

# Auth-back-service (Jest)
cd services/Auth-back-service
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Tests con cobertura
```

### 🏗️ Build y Utilidades

```bash
# Compilar todos los servicios
pnpm turbo run build

# Limpiar builds
pnpm turbo run clean

# Instalar dependencias
pnpm install

# Linting
pnpm turbo run lint
```

## 🔧 Tecnologías

- **🏧 Monorepo:** Turborepo + pnpm workspaces
- **🎨 Frontend:** Svelte + Vite + TailwindCSS
- **🚀 Backend:** NestJS + TypeScript
- **📊 GraphQL:** Apollo Server
- **🔧 Components:** Stencil.js
- **🧪 Testing:** Jest, Vitest, Stencil Testing

## 🏛️ Patrones de Diseño Implementados

### ui-tramites
- **Abstract Factory:** Creación de familias de componentes UI (botones modernos, clásicos, minimalistas)
- **Singleton:** Gestión de instancias únicas (UIFactoryProvider)

### tramites-back
- **DAO (Data Access Object):** Abstracción del acceso a datos de trámites
- **Service Layer:** Separación de lógica de negocio
- **Decorator:** Validación y transformación de datos

### uniauth
- **Strategy:** Múltiples estrategias de autenticación intercambiables (Email/Password, Google OAuth)
- **Component Pattern:** Web Components reutilizables

### apigatewayUniversidad
- **Gateway Pattern:** Punto único de entrada para todos los servicios
- **Strategy Pattern:** Diferentes estrategias de enrutamiento
- **Guard Pattern:** Validación y autorización

## 📊 Reportes de Testing

El proyecto genera reportes detallados que incluyen:
- ✅ Cobertura de tests por servicio
- 🏛️ Análisis de patrones de diseño implementados
- 📈 Métricas de calidad del código
- 🎯 Recomendaciones de mejora

Los reportes se generan en la carpeta `reports/` y se actualizan con cada ejecución de `pnpm test:report`.

## 📋 Requisitos

- Node.js 18+
- pnpm 8+
- Git
