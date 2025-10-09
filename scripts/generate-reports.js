#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Script para generar reportes unificados de testing y design patterns
 *
 * Ejecuta todos los tests con coverage y genera un reporte consolidado
 * que incluye métricas de testing y análisis de patrones de diseño.
 */

const PROJECT_ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(PROJECT_ROOT, "reports");
const COVERAGE_DIR = path.join(REPORTS_DIR, "coverage");

// Servicios con sus respectivos frameworks de testing
const SERVICES = [
  {
    name: "apigatewayUniversidad",
    path: "services/apigatewayUniversidad",
    testFramework: "jest",
    patterns: [
      "Gateway Pattern",
      "Service Layer",
      "Strategy Pattern",
      "Dependency Injection",
      "Guard Pattern",
    ],
  },
  {
    name: "Auth-back-service",
    path: "services/Auth-back-service",
    testFramework: "jest",
    patterns: ["Service Layer", "Dependency Injection", "Repository Pattern"],
  },
  {
    name: "tramites-back",
    path: "services/tramites-back",
    testFramework: "jest",
    patterns: [
      "DAO Pattern",
      "Service Layer",
      "Repository Pattern",
      "Dependency Injection",
    ],
  },
  {
    name: "ui-tramites",
    path: "services/ui-tramites",
    testFramework: "vitest",
    patterns: ["Abstract Factory", "Singleton", "Component Pattern"],
  },
  {
    name: "uniauth",
    path: "services/uniauth",
    testFramework: "stencil",
    patterns: ["Component Pattern", "Web Components"],
  },
];

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    reset: "\x1b[0m",
  };

  console.log(
    `${colors[type]}[${type.toUpperCase()}] ${message}${colors.reset}`,
  );
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`Created directory: ${dirPath}`, "success");
  }
}

function runCommand(command, cwd = PROJECT_ROOT) {
  try {
    log(`Executing: ${command}`, "info");
    const result = execSync(command, {
      cwd,
      encoding: "utf8",
      stdio: ["inherit", "pipe", "pipe"],
    });
    return result;
  } catch (error) {
    log(`Command failed: ${command}`, "error");
    log(`Error: ${error.message}`, "error");
    return null;
  }
}

function runTestsForService(service) {
  log(`Running tests for ${service.name}...`, "info");

  const servicePath = path.join(PROJECT_ROOT, service.path);

  if (!fs.existsSync(servicePath)) {
    log(`Service path not found: ${servicePath}`, "warning");
    return null;
  }

  let testCommand;
  switch (service.testFramework) {
    case "jest":
      testCommand = "npm run test:cov";
      break;
    case "vitest":
      testCommand = "npm run test:coverage";
      break;
    case "stencil":
      testCommand = "npm run test";
      break;
    default:
      log(`Unknown test framework: ${service.testFramework}`, "warning");
      return null;
  }

  const result = runCommand(testCommand, servicePath);

  if (result !== null) {
    log(`Tests completed for ${service.name}`, "success");
  }

  return result;
}

function collectCoverageData() {
  log("Collecting coverage data...", "info");

  const coverageData = {
    timestamp: new Date().toISOString(),
    services: [],
    summary: {
      totalLines: 0,
      coveredLines: 0,
      totalFunctions: 0,
      coveredFunctions: 0,
      totalBranches: 0,
      coveredBranches: 0,
      totalStatements: 0,
      coveredStatements: 0,
    },
  };

  SERVICES.forEach((service) => {
    const servicePath = path.join(PROJECT_ROOT, service.path);
    const coveragePath = path.join(
      servicePath,
      "coverage",
      "coverage-summary.json",
    );

    if (fs.existsSync(coveragePath)) {
      try {
        const coverageJson = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
        const total = coverageJson.total;

        const serviceData = {
          name: service.name,
          framework: service.testFramework,
          patterns: service.patterns,
          coverage: {
            lines: {
              total: total.lines.total,
              covered: total.lines.covered,
              percentage: total.lines.pct,
            },
            functions: {
              total: total.functions.total,
              covered: total.functions.covered,
              percentage: total.functions.pct,
            },
            branches: {
              total: total.branches.total,
              covered: total.branches.covered,
              percentage: total.branches.pct,
            },
            statements: {
              total: total.statements.total,
              covered: total.statements.covered,
              percentage: total.statements.pct,
            },
          },
        };

        coverageData.services.push(serviceData);

        // Agregar a summary
        coverageData.summary.totalLines += total.lines.total;
        coverageData.summary.coveredLines += total.lines.covered;
        coverageData.summary.totalFunctions += total.functions.total;
        coverageData.summary.coveredFunctions += total.functions.covered;
        coverageData.summary.totalBranches += total.branches.total;
        coverageData.summary.coveredBranches += total.branches.covered;
        coverageData.summary.totalStatements += total.statements.total;
        coverageData.summary.coveredStatements += total.statements.covered;

        log(`Coverage data collected for ${service.name}`, "success");
      } catch (error) {
        log(
          `Failed to read coverage for ${service.name}: ${error.message}`,
          "warning",
        );
      }
    } else {
      log(`No coverage file found for ${service.name}`, "warning");
    }
  });

  // Calcular percentages del summary
  if (coverageData.summary.totalLines > 0) {
    coverageData.summary.linesPercentage = (
      (coverageData.summary.coveredLines / coverageData.summary.totalLines) *
      100
    ).toFixed(2);
  }
  if (coverageData.summary.totalFunctions > 0) {
    coverageData.summary.functionsPercentage = (
      (coverageData.summary.coveredFunctions /
        coverageData.summary.totalFunctions) *
      100
    ).toFixed(2);
  }
  if (coverageData.summary.totalBranches > 0) {
    coverageData.summary.branchesPercentage = (
      (coverageData.summary.coveredBranches /
        coverageData.summary.totalBranches) *
      100
    ).toFixed(2);
  }
  if (coverageData.summary.totalStatements > 0) {
    coverageData.summary.statementsPercentage = (
      (coverageData.summary.coveredStatements /
        coverageData.summary.totalStatements) *
      100
    ).toFixed(2);
  }

  return coverageData;
}

function generateDesignPatternsReport() {
  log("Generating design patterns report...", "info");

  const patternsReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPatterns: 0,
      patternsByService: {},
      patternUsage: {},
    },
    services: [],
    patterns: {
      "Service Layer Pattern": {
        description:
          "Separación clara entre lógica de negocio y capa de presentación",
        services: [],
        benefits: [
          "Separación de responsabilidades",
          "Fácil testing con mocks",
          "Reutilización de lógica",
        ],
      },
      "DAO Pattern": {
        description: "Abstracción del acceso a datos",
        services: [],
        benefits: [
          "Separación entre lógica y datos",
          "Facilita cambio de BD",
          "Mejora testabilidad",
        ],
      },
      "Dependency Injection": {
        description: "Inyección automática de dependencias",
        services: [],
        benefits: [
          "Bajo acoplamiento",
          "Testing simplificado",
          "Gestión automática del ciclo de vida",
        ],
      },
      "Gateway Pattern": {
        description: "Punto único de entrada que enruta peticiones",
        services: [],
        benefits: [
          "Punto único de acceso",
          "Seguridad centralizada",
          "Simplifica cliente frontend",
        ],
      },
      "Strategy Pattern": {
        description: "Múltiples estrategias para resolver un problema",
        services: [],
        benefits: [
          "Flexibilidad en algoritmos",
          "Extensibilidad",
          "Separation of concerns",
        ],
      },
      "Abstract Factory": {
        description: "Creación de familias de objetos relacionados",
        services: [],
        benefits: [
          "Consistencia en creación",
          "Intercambiabilidad",
          "Escalabilidad",
        ],
      },
      Singleton: {
        description: "Una sola instancia de una clase",
        services: [],
        benefits: [
          "Control de instancia",
          "Acceso global",
          "Gestión de estado",
        ],
      },
      "Component Pattern": {
        description: "Composición de elementos reutilizables",
        services: [],
        benefits: ["Reutilización", "Modularidad", "Mantenibilidad"],
      },
      "Guard Pattern": {
        description: "Interceptores para autorización y validación",
        services: [],
        benefits: [
          "Seguridad centralizada",
          "Validación consistente",
          "Separación de concerns",
        ],
      },
      "Repository Pattern": {
        description: "Abstracción para acceso a colecciones de datos",
        services: [],
        benefits: [
          "Testabilidad",
          "Consistencia en acceso a datos",
          "Flexibilidad",
        ],
      },
    },
  };

  SERVICES.forEach((service) => {
    patternsReport.services.push({
      name: service.name,
      patterns: service.patterns,
      testFramework: service.testFramework,
    });

    patternsReport.summary.patternsByService[service.name] =
      service.patterns.length;
    patternsReport.summary.totalPatterns += service.patterns.length;

    service.patterns.forEach((pattern) => {
      if (patternsReport.patterns[pattern]) {
        patternsReport.patterns[pattern].services.push(service.name);
      }

      if (!patternsReport.summary.patternUsage[pattern]) {
        patternsReport.summary.patternUsage[pattern] = 0;
      }
      patternsReport.summary.patternUsage[pattern]++;
    });
  });

  return patternsReport;
}

function generateMarkdownReport(coverageData, patternsReport) {
  log("Generating markdown report...", "info");

  const report = `# UniServices - Testing & Design Patterns Report

## 📊 Test Coverage Summary

**Generated:** ${new Date().toLocaleString()}

### Overall Coverage
- **Lines:** ${coverageData.summary.coveredLines}/${coverageData.summary.totalLines} (${coverageData.summary.linesPercentage}%)
- **Functions:** ${coverageData.summary.coveredFunctions}/${coverageData.summary.totalFunctions} (${coverageData.summary.functionsPercentage}%)
- **Branches:** ${coverageData.summary.coveredBranches}/${coverageData.summary.totalBranches} (${coverageData.summary.branchesPercentage}%)
- **Statements:** ${coverageData.summary.coveredStatements}/${coverageData.summary.totalStatements} (${coverageData.summary.statementsPercentage}%)

### Service-by-Service Coverage

${coverageData.services
  .map(
    (service) => `
#### ${service.name}
- **Framework:** ${service.framework}
- **Lines:** ${service.coverage.lines.percentage}%
- **Functions:** ${service.coverage.functions.percentage}%
- **Branches:** ${service.coverage.branches.percentage}%
- **Statements:** ${service.coverage.statements.percentage}%
`,
  )
  .join("")}

## 🏛️ Design Patterns Analysis

### Pattern Summary
- **Total Patterns Implemented:** ${patternsReport.summary.totalPatterns}
- **Unique Patterns:** ${Object.keys(patternsReport.summary.patternUsage).length}

### Pattern Usage Distribution
${Object.entries(patternsReport.summary.patternUsage)
  .map(
    ([pattern, count]) => `
- **${pattern}:** ${count} service(s)`,
  )
  .join("")}

### Patterns by Service
${patternsReport.services
  .map(
    (service) => `
#### ${service.name}
**Framework:** ${service.testFramework}
**Patterns Implemented:**
${service.patterns.map((pattern) => `- ${pattern}`).join("\n")}
`,
  )
  .join("")}

### Detailed Pattern Analysis
${Object.entries(patternsReport.patterns)
  .filter(([_, data]) => data.services.length > 0)
  .map(
    ([pattern, data]) => `
#### ${pattern}
**Description:** ${data.description}

**Implemented in:** ${data.services.join(", ")}

**Benefits:**
${data.benefits.map((benefit) => `- ${benefit}`).join("\n")}
`,
  )
  .join("")}

## 🎯 Quality Metrics

### Test Coverage Quality
${coverageData.services
  .map((service) => {
    const avgCoverage =
      (parseFloat(service.coverage.lines.percentage) +
        parseFloat(service.coverage.functions.percentage) +
        parseFloat(service.coverage.branches.percentage) +
        parseFloat(service.coverage.statements.percentage)) /
      4;

    const quality =
      avgCoverage >= 80
        ? "🟢 Excellent"
        : avgCoverage >= 70
          ? "🟡 Good"
          : avgCoverage >= 60
            ? "🟠 Fair"
            : "🔴 Needs Improvement";

    return `- **${service.name}:** ${avgCoverage.toFixed(1)}% ${quality}`;
  })
  .join("\n")}

### Design Pattern Maturity
${patternsReport.services
  .map((service) => {
    const patternCount = service.patterns.length;
    const maturity =
      patternCount >= 4
        ? "🟢 Mature"
        : patternCount >= 2
          ? "🟡 Developing"
          : "🔴 Basic";

    return `- **${service.name}:** ${patternCount} patterns ${maturity}`;
  })
  .join("\n")}

## 🚀 Recommendations

### Testing Improvements
${coverageData.services
  .filter((service) => {
    const avgCoverage =
      (parseFloat(service.coverage.lines.percentage) +
        parseFloat(service.coverage.functions.percentage) +
        parseFloat(service.coverage.branches.percentage) +
        parseFloat(service.coverage.statements.percentage)) /
      4;
    return avgCoverage < 75;
  })
  .map(
    (service) => `
- **${service.name}:** Increase test coverage (current: ${(
      (parseFloat(service.coverage.lines.percentage) +
        parseFloat(service.coverage.functions.percentage) +
        parseFloat(service.coverage.branches.percentage) +
        parseFloat(service.coverage.statements.percentage)) /
      4
    ).toFixed(1)}%)`,
  )
  .join("")}

### Architecture Improvements
- Consider implementing **Circuit Breaker** pattern for inter-service communication
- Evaluate **CQRS** pattern for tramites-back service
- Add **Event Sourcing** for audit trails
- Implement **Saga** pattern for distributed transactions

## 📝 Commands Reference

### Run All Tests
\`\`\`bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run in CI mode (parallel)
npm run test:ci
\`\`\`

### Individual Service Testing
\`\`\`bash
# API Gateway
cd services/apigatewayUniversidad && npm run test:cov

# Auth Service
cd services/Auth-back-service && npm run test:cov

# Tramites Service
cd services/tramites-back && npm run test:cov

# UI Components
cd services/ui-tramites && npm run test:coverage

# Auth Components
cd services/uniauth && npm run test
\`\`\`

---

**Generated by UniServices Test Reporter** 📊
`;

  return report;
}

async function main() {
  log("🚀 Starting UniServices Test & Patterns Report Generation", "info");

  // Create reports directory
  ensureDirectoryExists(REPORTS_DIR);
  ensureDirectoryExists(COVERAGE_DIR);

  // Run tests for all services
  log("Running tests for all services...", "info");
  const results = [];

  for (const service of SERVICES) {
    const result = runTestsForService(service);
    results.push({ service: service.name, success: result !== null });
  }

  // Collect coverage data
  const coverageData = collectCoverageData();

  // Generate design patterns report
  const patternsReport = generateDesignPatternsReport();

  // Generate reports
  const markdownReport = generateMarkdownReport(coverageData, patternsReport);

  // Save reports
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportFiles = {
    markdown: path.join(REPORTS_DIR, `test-patterns-report-${timestamp}.md`),
    coverage: path.join(REPORTS_DIR, `coverage-data-${timestamp}.json`),
    patterns: path.join(REPORTS_DIR, `patterns-analysis-${timestamp}.json`),
    latest: path.join(REPORTS_DIR, "latest-report.md"),
    coverageLatest: path.join(REPORTS_DIR, "latest-coverage.json"),
    patternsLatest: path.join(REPORTS_DIR, "latest-patterns.json"),
  };

  try {
    fs.writeFileSync(reportFiles.markdown, markdownReport);
    fs.writeFileSync(
      reportFiles.coverage,
      JSON.stringify(coverageData, null, 2),
    );
    fs.writeFileSync(
      reportFiles.patterns,
      JSON.stringify(patternsReport, null, 2),
    );
    fs.writeFileSync(reportFiles.latest, markdownReport);
    fs.writeFileSync(
      reportFiles.coverageLatest,
      JSON.stringify(coverageData, null, 2),
    );
    fs.writeFileSync(
      reportFiles.patternsLatest,
      JSON.stringify(patternsReport, null, 2),
    );

    log("✅ All reports generated successfully!", "success");
    log(`📄 Markdown Report: ${reportFiles.latest}`, "info");
    log(`📊 Coverage Data: ${reportFiles.coverageLatest}`, "info");
    log(`🏛️ Patterns Analysis: ${reportFiles.patternsLatest}`, "info");

    // Summary
    const successfulTests = results.filter((r) => r.success).length;
    log(
      `🎯 Test Results: ${successfulTests}/${results.length} services tested successfully`,
      "info",
    );
    log(
      `📈 Overall Coverage: ${coverageData.summary.linesPercentage}% lines`,
      "info",
    );
    log(
      `🏗️ Design Patterns: ${patternsReport.summary.totalPatterns} patterns across ${SERVICES.length} services`,
      "info",
    );
  } catch (error) {
    log(`Failed to save reports: ${error.message}`, "error");
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    log(`Script failed: ${error.message}`, "error");
    process.exit(1);
  });
}
