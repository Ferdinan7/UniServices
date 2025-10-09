#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

/**
 * Script para ejecutar tests de patrones de diseño específicos
 *
 * Ejecuta solo los tests relacionados con los patrones de diseño principales:
 * - Abstract Factory (ui-tramites)
 * - DAO Pattern (tramites-back)
 * - Strategy Pattern (uniauth)
 */

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Colores para output
const colors = {
  info: '\x1b[36m',
  success: '\x1b[32m',
  warning: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, type = 'info') {
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function runCommand(command, cwd) {
  try {
    log(`\n${colors.bold}Ejecutando: ${command}${colors.reset}`, 'info');
    execSync(command, {
      cwd,
      stdio: 'inherit',
      encoding: 'utf8'
    });
    return true;
  } catch (error) {
    log(`❌ Error ejecutando: ${command}`, 'error');
    return false;
  }
}

async function main() {
  log('\n🧪 ========================================', 'info');
  log('   Tests de Patrones de Diseño - UniServices', 'info');
  log('========================================\n', 'info');

  const results = [];

  // Test 1: Abstract Factory Pattern - ui-tramites
  log('\n📦 [1/3] Abstract Factory Pattern - ui-tramites', 'info');
  log('─────────────────────────────────────────────────', 'info');
  const uiTramitesPath = path.join(PROJECT_ROOT, 'services', 'ui-tramites');
  const test1 = runCommand('npm run test buttonFactory.test.ts', uiTramitesPath);
  results.push({
    pattern: 'Abstract Factory',
    service: 'ui-tramites',
    success: test1
  });

  // Test 2: DAO Pattern - tramites-back
  log('\n💾 [2/3] DAO Pattern - tramites-back', 'info');
  log('─────────────────────────────────────────────────', 'info');
  const tramitesBackPath = path.join(PROJECT_ROOT, 'services', 'tramites-back');
  const test2 = runCommand('npm test tramites-dao.spec.ts', tramitesBackPath);
  results.push({
    pattern: 'DAO Pattern',
    service: 'tramites-back',
    success: test2
  });

  // Test 3: Strategy Pattern - uniauth
  log('\n🔐 [3/3] Strategy Pattern - uniauth', 'info');
  log('─────────────────────────────────────────────────', 'info');
  const uniauthPath = path.join(PROJECT_ROOT, 'services', 'uniauth');
  const test3 = runCommand('npm test auth-strategy.spec.ts', uniauthPath);
  results.push({
    pattern: 'Strategy Pattern',
    service: 'uniauth',
    success: test3
  });

  // Resumen
  log('\n\n📊 ========================================', 'info');
  log('   RESUMEN DE TESTS', 'info');
  log('========================================\n', 'info');

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const color = result.success ? 'success' : 'error';
    log(`${index + 1}. ${status} - ${result.pattern} (${result.service})`, color);
  });

  log('\n─────────────────────────────────────────────────', 'info');
  log(`Total: ${successCount}/${totalCount} tests exitosos`,
      successCount === totalCount ? 'success' : 'warning');
  log('─────────────────────────────────────────────────\n', 'info');

  if (successCount === totalCount) {
    log('🎉 ¡Todos los tests de patrones de diseño pasaron exitosamente!', 'success');
    log('\n📚 Patrones validados:', 'info');
    log('   ✓ Abstract Factory - Creación de familias de objetos UI', 'success');
    log('   ✓ DAO Pattern - Abstracción de acceso a datos', 'success');
    log('   ✓ Strategy Pattern - Estrategias de autenticación intercambiables', 'success');
  } else {
    log('⚠️  Algunos tests fallaron. Revisa los errores arriba.', 'warning');
    process.exit(1);
  }

  log('\n💡 Comandos útiles:', 'info');
  log('   pnpm test:coverage  - Tests con cobertura completa', 'info');
  log('   pnpm test:report    - Generar reporte detallado', 'info');
  log('   pnpm test:watch     - Ejecutar tests en modo watch', 'info');
  log('\n', 'info');
}

// Ejecutar
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Error ejecutando script: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { main };
