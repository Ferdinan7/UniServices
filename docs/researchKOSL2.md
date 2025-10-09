# Investigación de Patrones de Diseño y CI/CD

## 1. Patrones de Diseño GoF (Gang of Four)


### Patrones de Diseño y CI/CD
Los patrones de diseño son soluciones ya probadas para problemas comunes en el desarrollo de software.
No son código listo para usar, sino modelos o guías que ayudan a escribir programas más organizados, reutilizables y fáciles de mantener.
### Patrones de Diseño GoF
Los patrones de diseño "Gang of Four" (GoF) son soluciones probadas a problemas recurrentes en el diseño de software orientado a objetos. Se dividen en creacionales, estructurales y de comportamiento.
Patrones Creacionales
Estos patrones se ocupan de la creación de objetos de una manera que mejora la flexibilidad y reutilización del código.

●	Fábrica Abstracta (Abstract Factory)
○	Ventajas: Aísla las clases concretas del cliente, facilita el intercambio de familias de objetos, promueve la consistencia entre los productos.
○	Desventajas: Añadir nuevas familias de productos es difícil, ya que requiere modificar la interfaz de la fábrica abstracta.
○	Ejemplo de Uso: Creación de kits de herramientas GUI multiplataforma (botones, barras de desplazamiento para Windows, Mac, Linux).
●	Constructor (Builder)
○	Ventajas: Permite construir objetos complejos paso a paso, separa la construcción de la representación, permite diferentes representaciones del mismo proceso de construcción.
○	Desventajas: Puede llevar a una gran cantidad de clases si el objeto tiene muchas variaciones de construcción.
○	Ejemplo de Uso: Construcción de un documento complejo (HTML, PDF, texto plano) a partir de un mismo conjunto de contenidos.
### Patrones Estructurales
Estos patrones se ocupan de cómo las clases y los objetos se componen para formar estructuras más grandes, manteniendo la flexibilidad y eficiencia.

●	Adaptador (Adapter)
○	Ventajas: Permite que clases con interfaces incompatibles trabajen juntas, mejora la reutilización de clases.
○	Desventajas: Puede introducir una capa adicional de complejidad.
○	Ejemplo de Uso: Conexión de un nuevo componente a una interfaz existente que no coincide, como adaptar un enchufe de corriente de un país a otro.
●	Fachada (Facade)
○	Ventajas: Proporciona una interfaz simplificada a un subsistema complejo, desacopla el cliente del subsistema.
○	Desventajas: Puede convertirse en un "God Object" si encapsula demasiada funcionalidad.
○	Ejemplo de Uso: Una API de un sistema complejo (por ejemplo, una biblioteca multimedia) que expone métodos sencillos para realizar operaciones comunes.
### Patrones de Comportamiento
Estos patrones se ocupan de la comunicación entre objetos y la asignación de responsabilidades.

●	Observador (Observer)
○	Ventajas: Promueve un bajo acoplamiento entre el sujeto y los observadores, permite la comunicación entre objetos sin que se conozcan explícitamente.
○	Desventajas: Puede haber problemas de rendimiento si hay muchos observadores o notificaciones frecuentes. El orden de notificación puede ser impredecible.
○	Ejemplo de Uso: Implementación de sistemas de notificación de eventos, como el patrón publish/subscribe en sistemas de mensajería.
●	Estrategia (Strategy)
○	Ventajas: Permite cambiar el algoritmo utilizado por un objeto en tiempo de ejecución, elimina declaraciones condicionales complejas.
○	Desventajas: Aumenta el número de objetos si hay muchas estrategias.
○	Ejemplo de Uso: Diferentes algoritmos de ordenación (burbuja, quicksort, mergesort) que se pueden aplicar a una colección de datos.
### Patrones Emergentes
Estos patrones son soluciones más recientes o específicas para arquitecturas modernas y dominios de aplicación.

●	MVC (Model-View-Controller)
○	Descripción: Separa la aplicación en tres componentes principales: el Modelo (datos y lógica de negocio), la Vista (presentación al usuario) y el Controlador (maneja la interacción del usuario y actualiza el Modelo y la Vista).
○	Cuándo Aplicar: Aplicaciones web y de escritorio donde se necesita una clara separación de preocupaciones para facilitar el mantenimiento y la escalabilidad.
●	DAO (Data Access Object)
○	Descripción: Abstrae y encapsula el acceso a la fuente de datos. El DAO gestiona la conexión a la base de datos para obtener y almacenar datos, sin exponer los detalles de implementación al resto de la aplicación.
○	Cuándo Aplicar: Cuando la lógica de acceso a datos es compleja o se trabaja con múltiples fuentes de datos.
●	CQRS (Command Query Responsibility Segregation)
○	Descripción: Separa las operaciones de lectura (queries) de las operaciones de escritura (commands) en modelos de dtos y/o capas de almacenamiento distintas.
○	Cuándo Aplicar: Aplicaciones con altas cargas de lectura, donde las operaciones de escritura son complejas y/o se necesita escalar de forma independiente las lecturas y escrituras.
●	DDD (Domain-Driven Design)
○	Descripción: Es un enfoque de desarrollo de software que se centra en el dominio de negocio, utilizando un lenguaje ubicuo para construir un modelo de dominio rico.
○	Cuándo Aplicar: Sistemas complejos con lógica de negocio intrincada donde se necesita una comprensión profunda del dominio para modelar correctamente la solución.
●	MVVM (Model-View-ViewModel)
○	Descripción: Similar a MVC, pero el ViewModel es una abstracción de la Vista que expone datos y comandos a la Vista. Elimina el código detrás (code-behind) en la Vista.
○	Cuándo Aplicar: Aplicaciones con interfaces de usuario ricas y complejas, especialmente en frameworks que soportan data binding (ej. WPF, UWP, Xamarin, Angular, React).
### Anti-patrones
Los anti-patrones son soluciones comunes que, a primera vista, parecen razonables, pero que a largo plazo resultan ineficaces y pueden generar problemas graves en el desarrollo de software.

●	God Object (Objeto Dios)
○	Descripción: Una clase que sabe o hace demasiado, concentrando una gran cantidad de responsabilidades y funcionalidades.
○	Por qué es Dañino: Dificulta el mantenimiento, la prueba y la reutilización del código. Aumenta el acoplamiento y reduce la cohesión, lo que lleva a un código frágil y propenso a errores.
○	Cómo Evitarlo: Aplicar el Principio de Responsabilidad Única (SRP), refactorizar la clase en componentes más pequeños y especializados, y distribuir las responsabilidades de manera equitativa.
●	Spaghetti Code (Código Espagueti)
○	Descripción: Código con una estructura de control compleja e intrincada, con múltiples saltos incondicionales dependencias confusas, lo que lo hace muy difícil de seguir y entender.
○	Por qué es Dañino: Impide la legibilidad, el mantenimiento y la depuración del software. Aumenta el riesgo de introducir errores al modificar una parte del código que afecta a otras de forma inesperada.
○	Cómo Evitarlo: Utilizar estructuras de control adecuadas (bucles, condicionales), modularizar el código en funciones y clases bien definidas, y seguir principios de diseño como la baja cohesión y el alto acoplamiento.
CI/CD (Continuous Integration / Continuous Delivery/Deployment)
CI/CD es un conjunto de prácticas y metodologías que automatizan las etapas del ciclo de vida del desarrollo de software, desde la integración del código hasta la entrega o despliegue en producción.
¿Qué es CI/CD?
●	CI (Integración Continua): Práctica de integrar los cambios de código de forma frecuente y automática en un repositorio compartido. Cada integración se verifica con compilaciones automatizadas y pruebas unitarias/de integración para detectar errores tempranamente.
●	CD (Entrega Continua - Continuous Delivery): Extiende la CI, asegurando que el código que ha pasado las pruebas de CI esté siempre en un estado desplegable. Esto significa que el software puede ser liberado a producción en cualquier momento, aunque la decisión de desplegarlo sigue siendo manual.
●	CD (Despliegue Continuo - Continuous Deployment): Va un paso más allá que la Entrega Continua, automatizando también el despliegue del software en producción, siempre que haya pasado todas las pruebas automáticas. No hay intervención humana en el proceso de despliegue.
Herramientas más usadas
Las herramientas de CI/CD facilitan la automatización de los procesos.

●	GitHub Actions: Servicio de CI/CD integrado en GitHub que permite automatizar flujos de trabajo de desarrollo de software directamente desde el repositorio.
●	GitLab CI: Plataforma de CI/CD integrada en GitLab, que permite la automatización de pruebas, compilación y despliegue directamente desde el repositorio Git.
●	Jenkins: Servidor de automatización de código abierto altamente extensible, utilizado para automatizar todas las fases del ciclo de vida del desarrollo de software.
●	CircleCI: Plataforma de CI/CD basada en la nube que automatiza el proceso de compilación, prueba y despliegue de software.
Ejemplos de pipelines típicos en proyectos reales
Un pipeline de CI/CD es una serie de pasos automatizados que se ejecutan para construir, probar y desplegar software.

1.	Commit de Código: Un desarrollador envía cambios al repositorio.
2.	Activación del Pipeline: El sistema CI/CD detecta el nuevo commit y activa el pipeline.
3.	Build: Se compila el código fuente y se generan los artefactos (ej. JAR, WAR, Docker image).
4.	Pruebas Unitarias: Se ejecutan pruebas unitarias para verificar la funcionalidad de componentes individuales.
5.	Pruebas de Integración: Se ejecutan pruebas para asegurar que los diferentes componentes del sistema funcionan correctamente juntos.
6.	Análisis de Calidad de Código: Herramientas como SonarQube analizan el código en busca de vulnerabilidades, duplicidades o malas prácticas.
7.	Despliegue a Staging/Pre-producción: Si todas las pruebas pasan, el artefacto se despliega automáticamente en un entorno de pruebas.
8.	Pruebas de Aceptación (Manual/Automática): Se realizan pruebas de aceptación por parte de QA o usuarios finales.
9.	Aprobación Manual (Solo CD Delivery): En Continuous Delivery, se requiere una aprobación manual para el despliegue en producción.
10.	Despliegue a Producción (CD Deployment): En Continuous Deployment, el despliegue a producción es automático si todas las etapas anteriores han sido exitosas.
Beneficios en equipos de desarrollo profesional
●	Detección Temprana de Errores: Identifica y soluciona problemas en las primeras etapas del ciclo de desarrollo.
●	Reducción del Riesgo: Al automatizar las pruebas y los despliegues, se minimiza el riesgo de errores humanos.
●	Mayor Velocidad de Entrega: Permite entregar nuevas características y correcciones más rápidamente a los usuarios.
●	Mejora de la Calidad del Software: Las pruebas automatizadas y el análisis de código garantizan una mayor calidad.
●	Colaboración Mejorada: Facilita la integración de los cambios de múltiples desarrolladores sin conflictos.
●	Mayor Confianza en el Código: Los equipos tienen más confianza en los cambios que se despliegan en producción.
Ejemplo de YAML de pipeline sencillo
Este es un ejemplo de un archivo YAML para un pipeline sencillo usando GitHub Actions, que compila y ejecuta pruebas en un proyecto Node.js.name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
     uses: actions/checkout@v3
     name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16.x'
     name: Install dependencies
      run: npm install
     name: Run tests
      run: npm test

Explicación:

name: Node.js CI: Define el nombre del pipeline.
on: push, pull_request: Especifica los eventos que activarán el pipeline (cuando se empuja código a la rama main o se crea una pull request a main).
jobs: build: Define un único trabajo llamado build.
name: Install dependencies, run: npm install: Instala las dependencias del proyecto.
name: Run tests, run: npm test: Ejecuta las pruebas definidas en el proyecto.

