# Patrones de diseño GoF

Son un conjunto de 23 soluciones probadas a problemas comunes que surgen
en el diseño de software orientado a objetos, estos patrones son
fundamentales en la ingeniería de software y proporciona un vocabulario
común entre desarrolladores. Estos se clasifican en 3 categorías
principales: creacionales, estructurales, de comportamiento.

-   Patrones creacionales

Son aquellos que se centran en el proceso de creación de objetos para
hacer que el sistema sea mas flexible y reutilizable, un ejemplo de
estos es: Abstrac Factory, Builder y Singleton.

-   Patrones estructurales

Son aquellos que tratan con la composición de clases y objetos para
formar estructuras mas grandes y eficientes, un ejemplo de estos es:
Adapter, Bridge, Composite.

-   Patrones de comportamiento

Son aquellos que se ocupan de la interacción y comunicación entre
objetos, y de la forma en que se reparten las responsabilidades, un
ejemplo de estos es: Chain of Responsibility, Command, Interpreter.

Ventajas

1\. Reutilización y Soluciones Probadas

-   No reinventar la rueda: Proporcionan soluciones comprobadas a
    problemas de diseño recurrentes, lo que reduce el tiempo y esfuerzo
    en el desarrollo.

-   Fiabilidad: Al ser soluciones ampliamente testadas, son menos
    propensas a errores de diseño o arquitectura.

-   Flexibilidad y Reutilizabilidad: Hacen que el software sea más
    flexible, modular y fácil de modificar, pues separan las
    preocupaciones y promueven el bajo acoplamiento.

2\. Lenguaje Común y Comunicación

-   Vocabulario estandarizado: Crean un lenguaje común entre
    desarrolladores. Al mencionar un patrón como Singleton o Factory,
    todo el equipo entiende rápidamente la estructura de la solución sin
    necesidad de explicaciones extensas.

-   Mantenibilidad y Comprensión: El código que utiliza patrones bien
    conocidos es generalmente más fácil de leer, entender y mantener por
    otros desarrolladores (o por ti mismo en el futuro).

3\. Mejora de la Arquitectura

-   Código más limpio y organizado: Guían hacia una mejor arquitectura
    del software, facilitando la escalabilidad y reduciendo la necesidad
    de refactorización posterior.

-   Cumplimiento de principios de diseño: Ayudan a aplicar principios
    sólidos de diseño orientado a objetos, como el principio de
    abierto/cerrado (Open/Closed Principle) y la composición sobre la
    herencia.

Desventajas

1\. Sobrediseño y Complejidad Adicional

-   Sobrediseño (*Over-engineering*): Aplicar un patrón donde no es
    necesario (por ejemplo, usar un patrón complejo para un problema
    simple) puede añadir capas de complejidad innecesarias al código.

-   Curva de aprendizaje: Entender y aplicar correctamente los 23
    patrones requiere tiempo y experiencia. Si se usan sin comprender a
    fondo el problema y el patrón, se corre el riesgo de aplicarlo
    incorrectamente.

2\. Dificultad en la Implementación

-   Falsas soluciones: Si no se entiende bien el problema de fondo, se
    puede terminar forzando el código para que encaje en un patrón, lo
    que termina creando un problema mayor en lugar de resolverlo.

-   Afectación al rendimiento (*Performance*): Algunos patrones, debido
    a la abstracción que introducen, pueden agregar una ligera
    sobrecarga o complejidad al flujo de ejecución, lo que podría
    afectar el rendimiento en escenarios donde la velocidad es crítica.

3\. Desventajas Particulares del Patrón

Es importante notar que cada patrón específico tiene sus propias
desventajas. Por ejemplo:

-   El patrón Singleton (que garantiza una única instancia global) a
    menudo es criticado porque introduce un acoplamiento global, lo que
    puede dificultar las pruebas unitarias y considerarse un
    \"anti-patrón\" en ciertos contextos.

-   Algunos patrones creacionales pueden requerir la creación de
    subclases adicionales, lo que aumenta el número de clases en el
    proyecto.

Ejemplos de uso

-   Singleton: Garantizar que un recurso crítico o una configuración
    exista como una única instancia global para toda la aplicación.

-   Decorator: Añadir nuevas funcionalidades o \"envolturas\" a un
    objeto en tiempo de ejecución de forma dinámica.

-   Strategy: Definir una familia de algoritmos, encapsular cada uno y
    hacerlos intercambiables. Permite que el algoritmo varíe
    independientemente de los clientes que lo usan.

# Patrones emergentes

Esta es la interpretación más tradicional y se refiere a las soluciones
probadas que han surgido de la práctica y que ahora se utilizan para
resolver problemas comunes de diseño de software. Se les llama
\"emergentes\" porque se consolidaron a través de la experiencia
colectiva, no porque hayan sido diseñados formalmente desde el
principio.

-   MVC: Es un patrón de diseño de arquitectura que se enfoca en la
    separación de responsabilidades para aplicaciones con interfaz de
    usuario (UI), tanto de escritorio como web.

-   DAO: Es un patrón de diseño de bajo nivel que aísla la lógica de
    negocio de la complejidad de la persistencia de datos (bases de
    datos, archivos, servicios externos, etc.).

-   CQRS: Es un patrón arquitectónico que separa fundamentalmente las
    operaciones que cambian el estado de la aplicación de las
    operaciones que solo leen datos.

-   DDD: Es un enfoque y una disciplina de diseño de software centrada
    en modelar el software para reflejar y resolver los problemas
    complejos de un dominio de negocio específico.

-   MVVM: Es un patrón de presentación diseñado para aplicaciones con
    fuertes capacidades de enlace de datos (*data binding*), muy popular
    en entornos como WPF, Xamarin, Android y *frameworks* modernos de
    *frontend* (Vue, React, Angular).

¿Cuando conviene usarlos?

-   MVC: En aplicaciones web tradicionales (servidor-céntricas) y en
    *frameworks* que ya lo imponen (como Ruby on Rails, Django o Spring
    MVC). Es ideal cuando la lógica de la UI no es excesivamente
    compleja.

-   DAO: En cualquier aplicación con una base de datos relacional o
    fuente de datos específica donde se quiera aislar la lógica de
    negocio de los detalles de persistencia.

-   CQRS: En sistemas distribuidos de alto rendimiento donde las
    demandas de lectura (consultas) son mucho mayores que las de
    escritura (comandos), o viceversa. También cuando los modelos de
    lectura son complejos y muy diferentes a los modelos de escritura.

-   DDD: En sistemas grandes, complejos y con una lógica de negocio
    altamente intrincada. Cuando la comprensión precisa del negocio por
    parte del equipo es fundamental para el éxito del proyecto.

-   MVVM: En aplicaciones con interfaces de usuario ricas y dinámicas
    que utilizan enlace de datos bidireccional (*data binding*), como
    aplicaciones móviles (Android/Kotlin, iOS/SwiftUI), de escritorio
    (WPF) o *front-end* modernas (Vue.js, React con Hooks/Redux).

# Antipatrones

En esencia, un antipatrón es una mala práctica que, aunque parece ser la
solución correcta en un momento dado, genera más problemas (como código
desorganizado, baja mantenibilidad, problemas de rendimiento o fallas en
el proyecto) de los que resuelve.

Características de los Antipatrones

-   Son recurrentes: Se repiten en muchos proyectos y organizaciones,
    generalmente debido a la falta de experiencia, presión de tiempo o
    desconocimiento de estándares.

-   Soluciones Negativas: Proporcionan alivio a corto plazo (permiten
    terminar una funcionalidad rápidamente), pero causan graves daños a
    largo plazo (dificultad para escalar o corregir errores).

-   Antítesis del Diseño: Se deben estudiar y catalogar para poder
    reconocerlos y remediarlos (mediante refactorización) tan pronto
    como aparecen.

Ejemplos

-   Golden Hammer: La confianza de que una tecnología, patrón o solución
    particular es universalmente aplicable, usándola para todos los
    problemas, incluso cuando es evidente que no es idónea.

-   Reinventing the Wheel: Implementar componentes o funcionalidades
    desde cero, a pesar de que ya existen soluciones probadas y
    prefabricadas (librerías, *frameworks*).

-   Infierno de las Dependencias: Problemas causados por versiones
    conflictivas, incompatibles o faltantes de librerías y componentes
    de terceros.

Por qué son dañinos y cómo evitarlos

El daño causado por los antipatrones se resume en tres grandes áreas que
afectan tanto al código como al equipo de desarrollo:

1\. Daño a la Calidad del Código (Mantenimiento)

-   Aumento del Acoplamiento y Baja Cohesión: Antipatrones como la
    \"Clase de Dios\" (*The Blob*) hacen que un solo cambio en una parte
    del sistema requiera modificaciones en muchos otros lugares. Esto
    hace que el código sea frágil y propenso a errores.

-   Dificultad de Lectura y Entendimiento: El \"Código Espagueti\" es
    casi imposible de seguir. Un desarrollador junior tardará días en
    entender un módulo que debería llevar horas, y los desarrolladores
    veteranos gastarán tiempo valioso en descifrar, en lugar de en
    crear.

-   Problemas de Escalabilidad y Rendimiento: Algunos antipatrones (como
    el mal uso de Singleton o la optimización prematura) introducen
    cuellos de botella que solo se manifiestan cuando el sistema está
    bajo carga, haciendo que la aplicación falle en producción.

2\. Daño a la Productividad del Equipo

-   Ralentización del Desarrollo: El código dañado exige que la mayor
    parte del tiempo se dedique a corregir errores (*debugging*) o a
    mantener funcionalidad antigua, en lugar de añadir nuevas
    características. Esto es el efecto de la \"Deuda Técnica\"
    acumulada.

-   Fricción y Desmotivación: Trabajar constantemente en código
    desorganizado y propenso a errores es frustrante y baja la moral del
    equipo.

-   Riesgo de Regresión: Al corregir un error en una zona mal acoplada,
    es muy fácil romper otra funcionalidad que estaba funcionando
    correctamente.

3\. Daño Estratégico

-   Costo de Oportunidad: Al \"Reinventar la Rueda\", el equipo gasta
    recursos en crear soluciones que ya existen, perdiendo la
    oportunidad de invertir ese tiempo en lógica de negocio única o
    innovación real.

**¿Cómo Evitar los Antipatrones?**

Evitar los antipatrones requiere una combinación de **procesos, cultura
y disciplina técnica**.

1\. Disciplina y Herramientas (El \"Qué Hacer\")

-   Adopta Patrones de Diseño Claros: Usa patrones como MVC o MVVM para
    darle una estructura base a tu proyecto y forzar la Separación de
    Preocupaciones. Esto previene automáticamente el antipatrón \"Clase
    de Dios\".

-   Automatiza las Pruebas (TDD): Implementar Pruebas Unitarias obliga a
    los desarrolladores a escribir código más modular, con bajo
    acoplamiento y fácil de probar, lo cual es la antítesis del \"Código
    Espagueti\".

-   Refactorización Continua: No esperes a que el código sea ilegible.
    Dedica tiempo regularmente (preferiblemente cada *sprint* en Agile)
    a limpiar el código, reducir la duplicación y mejorar el diseño.

-   Usar Herramientas de Análisis Estático: Emplea linters y
    herramientas de calidad de código que midan la complejidad
    ciclomática o la duplicación de código. Estas herramientas pueden
    señalar \"The Blob\" antes de que crezca demasiado.

2\. Cultura y Colaboración (El \"Cómo Hacerlo\")

-   Revisiones de Código (*Code Reviews*): Haz que todos los cambios de
    código sean revisados por al menos un compañero. Esto no solo
    distribuye el conocimiento, sino que también funciona como un filtro
    para atrapar soluciones de \"Copiar y Pegar\" o diseños apresurados.

-   Promover el Lenguaje Ubicuo (DDD): Asegúrate de que los
    desarrolladores y los expertos en el negocio compartan un lenguaje
    común y preciso. Esto ayuda a que el código refleje el problema real
    del negocio.

-   Investigación y Conocimiento: Lucha contra el \"Martillo de Oro\"
    asegurando que el equipo investigue las soluciones existentes antes
    de crear una nueva. Fomenta el conocimiento continuo sobre
    *frameworks* y librerías estándares.

# CI/CD (Continuous Integration / Continuous Delivery/Deployment)

CI/CD es un término fundamental en la práctica de DevOps que describe un
conjunto de metodologías y prácticas automatizadas que buscan acelerar
la entrega de software al usuario final de manera confiable y
continua.CI/CD representa un flujo de trabajo (o *pipeline*) que
comienza con los cambios en el código y termina con el despliegue del
software en producción.

Diferencias

  --------------------------------------------------------------------------
  Característica   CI(Integración      CD(Entrega          CD(Despliegue
                   Continua)           Continua)           Continuo)
  ---------------- ------------------- ------------------- -----------------
  Enfoque          Integrar y probar   Siempre tener       Implementar
                   el código.          código listo para   código
                                       producción.         automáticamente
                                                           en producción.

  Resultado final  Artefacto probado.  Artefacto en        Artefacto en
                                       *Staging* (listo    Producción
                                       para liberar).      (liberado).

  Aprobación de la Automática (por el  Manual (requiere    Automática (no
  liberación       sistema).           una persona).       requiere una
                                                           persona).

  Riesgo           Bajo a medio.       Medio (se mitiga    Más alto
                                       con pruebas).       (requiere gran
                                                           confianza en las
                                                           pruebas
                                                           automatizadas).
  --------------------------------------------------------------------------

Herramientas más usadas

-   GitHub Actions: Nativo en la nube (Cloud-Native), integrado
    directamente en la plataforma GitHub.

-   GitLab CI: Nativo en GitLab. Forma parte de la plataforma DevOps de
    *end-to-end* de GitLab (que incluye gestión de código, seguridad y
    despliegue).

-   Jenkins: Servidor de automatización *Open Source* más antiguo y
    maduro.

-   CircleCI: Servicio basado en la nube (SaaS) centrado en la velocidad
    y la facilidad de uso.

Ejemplos

1.  Pipeline Básico (Aplicación Web Monolítica): Este es el *pipeline*
    más común, ideal para aplicaciones sencillas, monolíticas o de
    mediana complejidad. Consiste en 7 etapas en el siguiente orden:

-   Código: Un desarrollador hace un *push* al repositorio Git.

-   Compilación: El *pipeline* compila el código (por ejemplo, Java, C#,
    o JavaScript) y crea el artefacto binario ejecutable (ej. un archivo
    JAR, WAR o un paquete Docker).

-   Pruebas Unitarias: Se ejecutan automáticamente las pruebas de bajo
    nivel para confirmar que las funciones individuales funcionan según
    lo esperado.

-   Pruebas de Integración: Se prueba la interacción entre los
    componentes internos (ej. si la capa de servicio se comunica
    correctamente con la capa DAO).

-   Despliegue a Staging: El artefacto se implementa automáticamente en
    un entorno de pruebas aislado (Staging) que simula la producción.

-   Pruebas QA/Manuales: El equipo de QA o negocio realiza pruebas
    funcionales y de aceptación finales.

-   Despliegue a Producción: Se requiere una aprobación manual para
    implementar el código en los servidores que sirven a los usuarios
    finales.

2.  Pipeline Avanzado (Microservicios con Canary Release): Este
    *pipeline* se utiliza en arquitecturas de microservicios o sistemas
    de alto tráfico donde el riesgo de un despliegue fallido es
    inaceptablemente alto. Consiste en 5 etapas en el siguiente orden:

-   CI Completa: Se ejecuta la compilación, pruebas unitarias,
    integración y análisis estático de código (seguridad/calidad).

-   Construcción de Imagen: Se crea y etiqueta una imagen de Contenedor
    Docker con la versión validada. La imagen se almacena en un Registro
    de Contenedores.

-   Despliegue a Producción (Canary): Se despliega automáticamente la
    nueva versión a un pequeño subconjunto de usuarios (ej. 5%). Esto se
    conoce como *Canary Release*.

-   Monitoreo Automático: Durante 15-30 minutos, el *pipeline* monitorea
    métricas clave (errores, latencia, uso de CPU).

-   Promoción/Rollback: Si las métricas son buenas, la nueva versión se
    despliega al 100% de los usuarios. Si las métricas muestran fallos,
    el *pipeline* ejecuta un *rollback* (reversión) inmediato a la
    versión anterior.

3.  Pipeline de Bases de Datos y \"Infraestructura como Código\" (IaC):
    Este *pipeline* se ejecuta de forma paralela al *pipeline* de la
    aplicación y se encarga de gestionar los cambios de esquemas de
    bases de datos o la infraestructura de nube (usando herramientas
    como Terraform o CloudFormation). Consiste en 5 etapas en el
    siguiente orden:

-   Código IaC: El desarrollador actualiza el código que define la
    infraestructura (ej. añadiendo un nuevo *bucket* S3 o una nueva
    tabla de BD).

-   Validación/Planificación: El *pipeline* verifica la sintaxis del
    código IaC y genera un Plan de Ejecución (por ejemplo, Terraform
    Plan), detallando qué recursos serán creados, modificados o
    eliminados.

-   Revisión Manual (Plan): Se requiere una aprobación manual para que
    el Plan de Ejecución sea revisado por un ingeniero de DevOps, para
    evitar la eliminación accidental de recursos críticos.

-   Aplicación a Staging: Se aplica el plan de infraestructura al
    entorno de *staging*.

-   Aplicación a Producción: Tras la validación, el plan se aplica
    automáticamente (o con una última aprobación manual) al entorno de
    producción, manteniendo la consistencia de la infraestructura.

Beneficios profesionales

Los beneficios profesionales de usar las pipelines para organizar un
proyecto son que el proyecto se realiza de manera rápida y eficiente,
asegurándose de tener los menores errores posibles y una disposición
para hacer cambios mas adecuada.

Ejemplo de pipeline

\# 1. Define el nombre del pipeline/workflow

name: CI Basica de Compilacion y Pruebas

\# 2. Define el evento que dispara el pipeline (ej. al subir codigo a la
rama \'main\')

on:

push:

branches: \[ \"main\" \]

\# 3. Define los \'jobs\' (tareas) que componen el pipeline

jobs:

build_and_test:

\# 4. Define el ambiente donde se ejecutara este job

runs-on: ubuntu-latest

\# 5. Pasos secuenciales a ejecutar

steps:

\# Checkout: Descarga el codigo del repositorio

> uses: actions/checkout@v4

name: Descargar codigo

\# Setup: Configura el entorno necesario (ej. Java SDK)

> name: Configurar Java 17

uses: actions/setup-java@v4

with:

java-version: \'17\'

distribution: \'temurin\'

cache: \'maven\' \# Usa cache para dependencias de Maven

\# Build: Compila el proyecto

> name: Compilar Proyecto

run: mvn clean install -DskipTests

\# Test: Ejecuta las pruebas unitarias

> name: Ejecutar Pruebas

run: mvn test

Explicación paso a paso

-   name: Un nombre legible para el *pipeline*.

-   on: Define los eventos que dispararán automáticamente este
    *pipeline*. Aquí se dispara cuando se sube (*push*) código a la rama
    principal (main).

-   steps: La secuencia ordenada de comandos a ejecutar.

-   actions/checkout@v4: Una acción predefinida que le dice al *runner*
    que descargue la copia más reciente del código del repositorio de
    Git.

-   actions/setup-java@v4: Una acción que instala el software necesario
    (en este caso, la versión 17 del kit de desarrollo de Java (JDK))
    para que el código pueda ser compilado.

-   mvn clean install\...: Ejecuta la herramienta de compilación Maven
    (mvn). El comando compila el código fuente en archivos ejecutables.
    Se usa -DskipTests para saltar las pruebas, ya que las ejecutaremos
    en el siguiente paso.

-   mvn test: Ejecuta las pruebas unitarias. Si este comando falla (es
    decir, una prueba unitaria falla), el *job* se marca como fallido y
    el *pipeline* se detiene, enviando una alerta.

# Selección personal de 4 patrones

Estructural - Decorator

Justificación

El patrón Decorator es elegido por su capacidad de añadir
responsabilidades adicionales a los objetos sin modificar su código
original. Esto es especialmente útil en sistemas donde se requiere
extender funcionalidades de manera flexible, cómo añadir registros,
validaciones o manejo de errores, sin alterar la lógica base.

Integración

Dentro del backend (NestJS), se utiliza sobre servicios que interactúan
con Supabase, permitiendo agregar funciones adicionales como logging o
control de errores alrededor de las operaciones de base de datos. Así,
el núcleo del servicio permanece limpio y centrado en su tarea
principal, mientras las extensiones se agregan dinámicamente según las
necesidades.

Comportamiento - Strategy

Justificación

El patrón Strategy se selecciona porque el sistema maneja múltiples
métodos de autenticación (por correo y contraseña, o mediante Google).
Este patrón permite definir diferentes estrategias de login bajo una
misma interfaz, facilitando el intercambio y la ampliación de los
métodos sin modificar la lógica central del servicio de autenticación.

Integración

En el módulo de autenticación, cada método de inicio de sesión
(correo/contraseña, Google, etc.) se implementa como una estrategia
independiente. El controlador selecciona la estrategia adecuada según el
tipo de autenticación que el usuario utiliza. Esto permite mantener el
código organizado, escalable y abierto a futuros métodos de
autenticación sin afectar al resto del sistema.

Emergente - DAO (Data Access Object)

Justificación

El patrón DAO fue escogido para lograr una clara separación entre la
lógica de negocio y la lógica de acceso a datos. Permite encapsular las
operaciones con la base de datos dentro de una capa especializada,
facilitando el mantenimiento, la reutilización y las pruebas del
sistema.

Integración

Cada entidad principal del backend (por ejemplo, "Trámites") tiene su
propio DAO, responsable de gestionar todas las consultas a Supabase. Los
servicios del sistema utilizan estos DAO para obtener o modificar
información sin conocer los detalles de la conexión o la consulta. Esto
reduce el acoplamiento, mejora la organización del código y promueve una
arquitectura más limpia y modular.
