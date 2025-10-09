# Investigación de Patrones de Diseño y CI/CD

## 1. Patrones de Diseño GoF (Gang of Four)

### 1.1. Patrones Creacionales

Definición: abstraen y controlan el proceso de instanciación de objetos, desacoplando la creación del uso para lograr flexibilidad y reusabilidad.

— Singleton

- Propósito: Garantizar una única instancia global y un punto de acceso controlado. Útil para recursos compartidos como configuraciones o gestores de logs.
- Ventajas: Control centralizado, evita estados inconsistentes, acceso global; puede mejorar el rendimiento con cachés compartidos.
- Desventajas: Facilita acoplamiento global, dificulta pruebas (estado compartido), problemas en concurrencia si no se sincroniza correctamente.
- Ejemplo de uso en la industria: Logger/config central en frameworks y SDKs; gestores de impresión y pools de conexiones suelen exponerse como singletons.

— Factory Method

- Propósito: Definir una interfaz para crear objetos dejando a las subclases decidir qué clase instanciar; desacopla creación del cliente.
- Ventajas: Abierto a extensión, encapsula decisiones de creación, favorece pruebas al sustituir fábricas.
- Desventajas: Aumenta el número de clases; puede introducir complejidad innecesaria si hay pocas variantes.
- Ejemplo de uso en la industria: Generadores de reportes PDF/Excel/Word; frameworks UI crean componentes (botones, diálogos) mediante fábricas para múltiples plataformas.

— Abstract Factory

- Propósito: Proveer una familia de objetos relacionados sin especificar clases concretas (tematización/portabilidad).
- Ventajas: Consistencia entre productos, cambio de familia en un punto, fuerte encapsulamiento de dependencias.
- Desventajas: Curva de complejidad (muchas interfaces), menos flexible para agregar nuevos productos fuera de la familia.
- Ejemplo de uso en la industria: Toolkits de GUI multiplataforma (temas/skins que generan botones, menús y ventanas coherentes por sistema).

— Builder

- Propósito: Construir objetos complejos paso a paso, evitando “constructores telescópicos” y permitiendo diferentes representaciones.
- Ventajas: Legibilidad, inmutabilidad y separación de construcción vs. representación; facilita variaciones del producto.
- Desventajas: Más clases/boilerplate; sobrecoste para objetos simples.
- Ejemplo de uso en la industria: Query builders en ORMs; constructores de clientes HTTP (por ejemplo, RestTemplateBuilder en Spring Boot).

### 1.2. Patrones Estructurales

Definición: componen clases y objetos para formar estructuras mayores, simplificando relaciones e interfaces para reducir acoplamiento.

— Adapter

- Propósito: Hacer compatibles interfaces incompatibles envolviendo un objeto con una interfaz esperada.
- Ventajas: Reuso de código legado, integración incremental, elimina dependencias directas.
- Desventajas: Puede ocultar incompatibilidades semánticas; proliferación de adaptadores.
- Ejemplo de uso en la industria: Integración de APIs heredadas o de terceros que no coinciden con la interfaz del dominio.

— Decorator

- Propósito: Añadir responsabilidades dinámicamente sin herencia rígida, envolviendo objetos.
- Ventajas: Composición flexible de comportamientos, principio abierto/cerrado.
- Desventajas: Depuración más difícil por múltiples capas; puede proliferar la cantidad de clases decoradoras.
- Ejemplo de uso en la industria: java.io.InputStream y sus decoradores (BufferedInputStream, DataInputStream) en Java.

— Facade

- Propósito: Ofrecer una interfaz unificada de alto nivel a un subsistema complejo, ocultando detalles internos.
- Ventajas: Simplifica uso, reduce acoplamiento, punto único de entrada para tareas comunes.
- Desventajas: Riesgo de crecer de forma excesiva; posible ocultamiento de capacidades avanzadas.
- Ejemplo de uso en la industria: “Home theater” o módulos de inicio de sistemas; SDKs con clientes de alto nivel sobre múltiples servicios.

— Proxy

- Propósito: Controlar el acceso a un objeto (p. ej., lazy loading, seguridad, remoto).
- Ventajas: Optimización (carga diferida), control de seguridad, logging/transacciones transparentes.
- Desventajas: Complejidad añadida; latencias en remotos.
- Ejemplo de uso en la industria: Proxies remotos y de caché en clientes de microservicios; proxies de imagen/carga diferida.

### 1.3. Patrones de Comportamiento

Definición: organizan algoritmos y la asignación de responsabilidades, definiendo cómo colaboran los objetos para lograr flexibilidad y bajo acoplamiento

— Observer

- Propósito: Dependencia uno-a-muchos; cuando cambia el sujeto, notifica a observadores automáticamente. Clave en sistemas orientados a eventos.
- Ventajas: Desacopla emisor y receptores, extensible en tiempo de ejecución.
- Desventajas: No determinismo en orden de notificación, riesgo de fugas de memoria si no se desuscribe, cascadas de eventos.
- Ejemplo de uso en la industria: Arquitecturas de eventos, buses de eventos de UI, publicaciones de cambios de estado en editores o paneles.

— Strategy

- Propósito: Definir familias de algoritmos intercambiables, encapsularlos y permitir cambiarlos en tiempo de ejecución.
- Ventajas: Sustitución flexible de algoritmos, pruebas aisladas por estrategia.
- Desventajas: Más objetos/clases; el cliente debe conocer qué estrategia elegir.
- Ejemplo de uso en la industria: Selección de métodos de pago, políticas de ordenación, reglas de recomendación.

— Command

- Propósito: Encapsular una petición como objeto, habilitando colas, logs y deshacer.
- Ventajas: Desacopla emisor/receptor, permite “undo/redo”, auditoría y encolado.
- Desventajas: Multiplicación de clases de comandos; coordinación del historial.
- Ejemplo de uso en la industria: Sistemas de edición con deshacer; colas de tareas y orquestación de operaciones.

— Iterator (mención breve)

- Propósito: Recorrer colecciones sin exponer representación interna.
- Ejemplo de uso en la industria: Colecciones estándar en lenguajes y frameworks.

## 2. Patrones Emergentes y Arquitectónicos

— MVC (Model-View-Controller)
Separa datos/lógica (Modelo), presentación (Vista) y orquestación de entradas (Controlador). Ideal en web con interacción de usuario; facilita pruebas y mantenimiento.

— DAO (Data Access Object)
Abstrae el acceso a datos centralizando CRUD y ocultando detalles del motor. Mejora testabilidad y permite cambiar de base con bajo impacto.

— CQRS (Command Query Responsibility Segregation)
Separa modelos y rutas de escritura (commands) y lectura (queries). Optimiza rendimiento, escalabilidad y seguridad cuando los requerimientos difieren entre leer y escribir.

— DDD (Domain-Driven Design)
Modela el software según el dominio del negocio con lenguaje ubicuo y bounded contexts. Emplea tácticas como entidades, value objects, agregados, repositorios y eventos de dominio.

— MVVM (Model-View-ViewModel)
En aplicaciones de UI modernas, habilita data binding entre vista y modelo mediante un ViewModel. Popular en WPF/.NET y frameworks frontend; mejora separación de preocupaciones y testabilidad.

## 3. Anti-Patrones Comunes

— God Object (Objeto Divino)
Descripción: Un objeto que centraliza demasiadas responsabilidades, conoce y hace “de todo”.
Daño: Alto acoplamiento, baja cohesión, pruebas difíciles, cambios frágiles y cuellos de botella de desarrollo.
Evitación: SRP de SOLID, segregación de interfaces, refactorizar en componentes especializados, inyección de dependencias.

— Spaghetti Code (Código Espagueti)
Descripción: Flujo de control enredado, saltos y lógica dispersa sin modularidad.
Daño: Dificulta depuración, seguimiento y pruebas; extrema fragilidad ante cambios.
Evitación: Arquitecturas claras (MVC/MVVM), funciones pequeñas y cohesivas, refactorización continua y revisión de código.

## 4. CI/CD (Integración y Entrega/Despliegue Continuo)

— Definición de CI/CD
Integración Continua: integrar cambios frecuentemente y validar automáticamente con compilación y pruebas.
Entrega Continua: pipeline automatizado hasta artefactos listos y despliegue a staging; paso a producción requiere aprobación manual.
Despliegue Continuo: producción automática tras pasar el pipeline, sin intervención manual.

— Herramientas más usadas
GitHub Actions: Integrado nativamente en GitHub; dispara por eventos del repositorio, fácil inicio.
GitLab CI: Pipelines como código en .gitlab-ci.yml, runner integrado.
Jenkins: Servidor de automatización extensible con gran ecosistema de plugins y pipelines declarativos.
CircleCI: SaaS orientado a rapidez de setup y paralelismo, configuración en YAML.

— Ejemplo de Pipeline Típico
Fases: build (compilar/empacar), test (unitarias/integración), deploy (staging/producción) con gates o aprobaciones cuando aplique.

— Beneficios en Equipos Profesionales
Mayor velocidad de entrega, menor tasa de errores por automatización y pruebas, trazabilidad y visibilidad del estado, mejor colaboración en PRs y revisiones.

— Ejemplo de Pipeline en YAML (GitHub Actions)

```yaml
name: Simple CI Pipeline
on:
  push:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

— Explicación del YAML
name: etiqueta del workflow.
on: disparador; aquí, push a main.
jobs: conjunto de trabajos; build-and-test define el job.
runs-on: imagen de VM (Ubuntu) donde corre.
steps: pasos secuenciales: checkout del repo, preparar Node.js, instalar dependencias y ejecutar pruebas.

## 5. Selección Personal de 4 Patrones (Sistema de Gestión Universitaria)

— Creacional: Builder
Justificación: Estudiante/Curso poseen muchos atributos opcionales (dirección, beca, materias). Builder evita constructores telescópicos y mejora legibilidad y extensibilidad.
Integración: Implementar StudentBuilder con métodos encadenables (withAddress, withScholarship, addEnrollment…), y un build() que retorna Student inmutable. Facilita validaciones durante la construcción.

— Estructural: Facade
Justificación: El Módulo de Inscripciones es un subsistema complejo (prerrequisitos, pagos, cupos). Facade ofrece un método simple y estable a clientes externos.
Integración: EnrollmentFacade expone enrollStudent(studentId, courseId), orquestando validación de requisitos, verificación de pagos, actualización de cupos y generación de comprobantes, ocultando detalles internos.

— Comportamiento: Observer
Justificación: Múltiples interesados deben reaccionar a cambios (nuevas calificaciones): notificaciones por email, paneles y registro académico.
Integración: Course actúa como sujeto; observadores (EmailNotifier, StudentDashboard, RegistrarService) se suscriben. Course notifica publishGrade(event) sin conocer implementaciones concretas.

— Emergente: DAO (Data Access Object)
Justificación: Desacoplar lógica de negocio de persistencia; permitir cambiar PostgreSQL por otro motor sin afectar capas superiores.
Integración: Interfaces StudentDAO/CourseDAO con implementaciones como PostgresStudentDAO. Servicios usan las interfaces; pruebas sustituyen por DAOs en memoria o mocks.

Buenas prácticas transversales

- No sobreaplicar patrones: priorizar simplicidad y claridad; evitar complejidad innecesaria.
- Alinear patrón con el problema: diagnóstico antes de decidir estrategia.
- Refactorización frecuente para eliminar code smells y anti-patrones (SRP, KISS).
