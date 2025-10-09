# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el proyecto UniServices.

## 📁 Workflows Disponibles

### `ci.yaml` - Pipeline CI/CD Principal

Pipeline de integración y despliegue continuo que se ejecuta en cada push y pull request.

**Triggers:**

- Push a `master`, `main`, `develop`
- Pull requests hacia `master`, `main`, `develop`

**Jobs:**

1. Setup - Instalación de dependencias
2. Lint - Verificación de código con ESLint/Prettier
3. Test - Ejecución de tests con cobertura
4. Build - Compilación de todos los servicios
5. Swagger Docs - Generación de documentación
6. Summary - Resumen del pipeline

Ver [documentación completa](../../docs/CI-CD-PIPELINE.md) para más detalles.

## 🔐 Secrets y Variables

Actualmente el proyecto no requiere secrets configurados. En caso de necesitarlos en el futuro, aquí están los pasos:

### Agregar Secrets

1. Ve a Settings → Secrets and variables → Actions
2. Click en "New repository secret"
3. Agrega el nombre y valor del secret

### Secrets Comunes que Podrías Necesitar

```yaml
# Para deployment
DEPLOY_KEY: <SSH key para deployment>
DOCKER_USERNAME: <Usuario de Docker Hub>
DOCKER_PASSWORD: <Password de Docker Hub>

# Para servicios externos
CODECOV_TOKEN: <Token de Codecov>
SLACK_WEBHOOK: <Webhook de Slack para notificaciones>

# Para bases de datos de testing
TEST_SUPABASE_URL: <URL de Supabase para testing>
TEST_SUPABASE_KEY: <API Key de Supabase para testing>
```

### Usar Secrets en Workflows

```yaml
steps:
  - name: Deploy
    env:
      DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
    run: |
      echo "$DEPLOY_KEY" > deploy_key
      # ... resto del script
```

## 🔧 Variables de Entorno

Las variables de entorno globales se configuran en el archivo `ci.yaml`:

```yaml
env:
  NODE_VERSION: "18"
  PNPM_VERSION: "10.11.0"
```

## 📊 Artifacts

Los workflows generan los siguientes artifacts:

| Artifact                | Workflow | Retención | Descripción           |
| ----------------------- | -------- | --------- | --------------------- |
| `coverage-reports`      | ci.yaml  | 30 días   | Reportes de cobertura |
| `build-artifacts`       | ci.yaml  | 7 días    | Builds compilados     |
| `swagger-documentation` | ci.yaml  | 90 días   | Documentación API     |

## 🐛 Troubleshooting

### El workflow no se ejecuta

**Problema:** El workflow no aparece en la pestaña Actions.

**Solución:**

1. Verifica que el archivo esté en `.github/workflows/`
2. Verifica que la sintaxis YAML sea correcta
3. Asegúrate de hacer push del archivo

### Falla en un step específico

**Problema:** Un step falla constantemente.

**Solución:**

1. Click en el workflow fallido
2. Revisa los logs del step específico
3. Ejecuta el mismo comando localmente con `./scripts/ci-local.sh`
4. Corrige el error y haz push nuevamente

### Cache no funciona

**Problema:** Las dependencias se reinstalan cada vez.

**Solución:**

1. Verifica que `pnpm-lock.yaml` esté commiteado
2. GitHub Actions limpia el cache después de 7 días de inactividad
3. El cache se invalida si cambias el archivo de lock

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Documentación del Pipeline](../../docs/CI-CD-PIPELINE.md)
