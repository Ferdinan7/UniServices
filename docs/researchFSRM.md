# **Patrones de Diseño**

## Creacionales

Los patrones creacionales controlan la forma en que se crean los objetos. Su objetivo es desacoplar el código cliente del proceso concreto de instanciación, mejorar la flexibilidad y facilitar la reutilización.

### **Factory Method**

* **Descripción:** define una interfaz o clase abstracta para crear objetos y delega en las subclases la elección de la clase concreta que se instanciará. Permite crear objetos de diferentes tipos sin que el código cliente conozca sus clases concretas.

* **Ejemplo:** una plataforma de pagos delega la creación del procesador adecuado (tarjeta, PayPal, transferencia) a un método fábrica; así el cliente solicita un *“procesador de pago”* y el método devuelve la implementación apropiada según la configuración o el tipo de transacción.

### **Abstract Factory**

* **Descripción:** proporciona una interfaz para crear familias de objetos relacionados (por ejemplo, botones, menús, casillas) sin especificar sus clases concretas. Es útil cuando el sistema debe ser independiente del mecanismo de creación y representación.

* **Ejemplo:** un kit de interfaz de usuario multiplataforma usa una fábrica abstracta para crear elementos para Windows, macOS o Linux. El cliente llama a la fábrica para obtener botones y cuadros de texto, y la fábrica concreta devuelve los elementos apropiados para el sistema operativo.

### **Builder**

* **Descripción:** permite construir objetos complejos paso a paso, separando la construcción del objeto de su representación. Facilita crear distintas representaciones de un objeto utilizando el mismo proceso de construcción.

* **Ejemplo:** un sistema de recursos humanos usa un *builder* para ensamblar un objeto **Empleado**, agregando direcciones, teléfonos de emergencia y contactos de manera gradual. El patrón reduce la complejidad de inicializar manualmente cada propiedad cada vez que se crea un empleado.

### **Prototype**

* **Descripción:** crea nuevos objetos clonando (copiando) un prototipo existente en lugar de instanciarlos desde cero. Es útil cuando la creación es costosa o cuando se requieren muchas instancias similares.

* **Ejemplo:** en una aplicación de dibujo, cada figura (círculo, cuadrado, triángulo) implementa el método `clone()` para duplicarse. Cuando el usuario copia una figura, el sistema clona el prototipo y luego ajusta propiedades como color o posición.

### **Singleton**

* **Descripción:** garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella. Normalmente se utiliza para recursos compartidos.

* **Ejemplo:** los módulos de acceso a bases de datos suelen implementarse como un **Singleton** para que toda la aplicación use la misma conexión y evite abrir múltiples conexiones pesadas.

## Estructurales

Los patrones estructurales organizan y combinan objetos y clases para formar estructuras flexibles y eficientes. Ayudan a componer objetos complejos a partir de otros más simples sin modificar sus interfaces o cambiar demasiado el sistema existente.

### **Adapter**

* **Descripción:** convierte la interfaz de una clase en otra interfaz esperada por los clientes. Permite que clases con interfaces incompatibles cooperen sin modificar su código.

* **Ejemplo:** al integrar un proveedor externo que devuelve un informe en formato **XML** con un sistema contable que espera **JSON**, se crea un **Adapter** (por ejemplo, `XMLToJSONAdapter`) que envuelve al proveedor, traduce la respuesta XML a JSON y ofrece la interfaz esperada por el sistema interno.

### **Bridge**

* **Descripción:** separa una abstracción de su implementación, de modo que ambas puedan evolucionar de forma independiente. Evita la explosión de subclases cuando existen múltiples combinaciones de abstracciones e implementaciones.

* **Ejemplo:** un sistema de reproducción multimedia utiliza el **Bridge** para separar la interfaz del reproductor (play, pause, stop) de las diferentes implementaciones de códecs o plataformas (MP3, FLAC, streaming). De este modo, se pueden agregar nuevos formatos sin modificar la interfaz del reproductor.

### **Composite**

* **Descripción:** compone objetos en estructuras de árbol para representar jerarquías *parte–todo*. Permite tratar objetos individuales y compuestos de manera uniforme.

* **Ejemplo:** en un punto de venta, una orden puede incluir productos simples o paquetes que contienen varios artículos; estos paquetes pueden a su vez contener sub-paquetes. El patrón **Composite** permite calcular el precio total de una orden sumando recursivamente los precios de los elementos hijos, sean simples o compuestos.

### **Decorator**

* **Descripción:** asigna responsabilidades adicionales a un objeto en tiempo de ejecución sin modificar su clase. Proporciona una alternativa flexible a la herencia para extender la funcionalidad.

* **Ejemplo:** en una arquitectura de microservicios, se puede envolver un servicio de usuarios con un **Decorator** que añade lógica de reintentos o registro de auditoría. El cliente sigue utilizando la misma interfaz, pero gracias a la envoltura obtiene funcionalidades extra sin alterar el servicio original.

### **Facade**

* **Descripción:** ofrece una interfaz unificada y sencilla para un conjunto de subsistemas complejos, ocultando su estructura interna.

* **Ejemplo:** un control remoto de televisión actúa como una **Fachada**, simplificando el uso de un aparato que contiene multitud de circuitos y funciones. El usuario solo presiona los botones del mando, mientras que internamente la fachada interactúa con distintos subsistemas del televisor.

### **Flyweight**

* **Descripción:** reduce el uso de memoria compartiendo el estado entre objetos similares. Permite manejar grandes cantidades de objetos de grano fino de manera eficiente.

* **Ejemplo:** en un videojuego con un laboratorio de alquimia, muchas pociones se repiten en los estantes. El patrón **Flyweight** crea un objeto único por cada tipo de poción y lo reutiliza para representar todas las apariciones de ese tipo, ahorrando memoria.

### **Proxy**

* **Descripción:** proporciona un sustituto u objeto intermediario que controla el acceso a otro objeto. Puede añadir lógica adicional (control de acceso, retardar la creación, registro) antes o después de delegar la llamada al objeto real.

* **Ejemplo:** un proxy de acceso a un servicio remoto comprueba credenciales y realiza caching de resultados. También puede crear objetos costosos bajo demanda (por ejemplo, cargar una imagen grande sólo cuando se necesite)

## Comportamiento

Los patrones de comportamiento se centran en cómo los objetos interactúan y distribuyen la responsabilidad. Facilitan la comunicación y la asignación de responsabilidades entre objetos y clases.

### **Chain of Responsibility**

* **Descripción:** envía una solicitud por una cadena de manejadores hasta que uno de ellos la procesa. Permite desacoplar el emisor de la solicitud de su receptor.

* **Ejemplo:** un sistema de pagos tiene manejadores para tarjeta, PayPal y efectivo. Cuando se procesa un pago, la solicitud recorre la cadena; cada manejador comprueba si puede procesar el tipo de pago y, si es así, lo maneja. Esto evita que el cliente conozca qué clase específica procesa cada pago.

### **Command**

* **Descripción:** encapsula una solicitud como un objeto, lo que permite parametrizar clientes con diferentes operaciones, programar la ejecución y ofrecer deshacer/re-hacer.

* **Ejemplo:** en un hogar inteligente, cada orden (encender luz, apagar, cambiar color) se implementa como un **Command**. El dispositivo añade los comandos a una lista y los ejecuta en orden, permitiendo también deshacer una acción concreta (por ejemplo, volver al color anterior).

### **Interpreter**

* **Descripción:** define una representación para una gramática y un intérprete que evalúa las expresiones de esa gramática. Es útil cuando se procesan reglas o expresiones repetitivas.

* **Ejemplo:** un motor de reglas en una aplicación financiera utiliza el patrón **Interpreter** para interpretar expresiones lógicas y matemáticas definidas por el usuario. El intérprete lee la cadena de reglas (por ejemplo, “ingreso \> 50000 AND deuda \= 0”) y evalúa la expresión sobre datos de clientes.

### **Iterator**

* **Descripción:** proporciona una manera de recorrer los elementos de una colección sin exponer su representación interna. Utiliza métodos como `hasNext()` y `next()` para acceder secuencialmente a los elementos.

* **Ejemplo:** una red social gestiona un grafo de conexiones entre usuarios. El patrón **Iterator** permite recorrer los amigos de un usuario o las interacciones en su muro sin exponer la estructura subyacente (lista, árbol, base de datos). Así se puede cambiar la implementación de la colección sin afectar al código cliente.

### **Mediator**

* **Descripción:** encapsula la forma en que interactúan un conjunto de objetos, evitando que se referencien directamente entre sí. Favorece una comunicación centralizada y reduce la dependencia entre componentes.

* **Ejemplo:** en una interfaz gráfica compleja, un componente mediador gestiona la interacción entre botones, campos de texto y menús; cuando el usuario escribe en un campo, el mediador notifica a los controles relevantes para habilitar o deshabilitar botones. De manera similar, en sistemas distribuidos, un mediador central coordina las llamadas entre microservicios para orquestar un flujo de trabajo.

### **Memento**

* **Descripción:** captura y guarda el estado interno de un objeto para poder restaurarlo más adelante sin violar el principio de encapsulación.

* **Ejemplo:** en un editor de texto se utiliza **Memento** para implementar la función *deshacer/rehacer*. Cada vez que el usuario realiza una operación, se guarda un memento con el contenido del documento. Al deshacer, el editor restaura el memento anterior para recuperar el estado previo.

### **Observer**

* **Descripción:** define una relación de suscripción en la que varios objetos (observadores) son notificados automáticamente cuando el estado de otro objeto (sujeto) cambia.

* **Ejemplo:** un sistema de alertas meteorológicas tiene un sujeto que recopila datos del clima y varios observadores (aplicaciones móviles, estaciones meteorológicas, servicios de noticias) que se suscriben a esas actualizaciones. Cuando cambian la temperatura o las precipitaciones, el sujeto notifica a todos los observadores en tiempo real.

### **State**

* **Descripción:** permite que un objeto altere su comportamiento cuando cambia su estado interno. Encapsula los comportamientos de cada estado en clases separadas para evitar condicionales complejas.

* **Ejemplo:** un semáforo inteligente implementa los estados **Rojo**, **Amarillo** y **Verde** como clases distintas. Cada estado define cómo debe cambiar el semáforo al recibir una señal de temporizador, permitiendo modificar la lógica de transición sin alterar el código central.

### **Strategy**

* **Descripción:** permite seleccionar un algoritmo entre varias estrategias intercambiables a través de una interfaz común. Cada estrategia encapsula una variante del algoritmo y el contexto delega el comportamiento en la estrategia elegida.

* **Ejemplo:** una aplicación que ofrece distintos métodos de autenticación (archivos de configuración, base de datos, memoria) utiliza el patrón **Strategy** para que el cliente seleccione la estrategia adecuada en tiempo de ejecución. Esto permite cambiar la forma de autenticar sin modificar la lógica del sistema.

### **Template Method**

* **Descripción:** define el esqueleto de un algoritmo en la clase base, dejando que las subclases implementen los pasos específicos. Favorece la reutilización de código al centralizar la estructura común del algoritmo.

* **Ejemplo:** una clase abstracta `Receta` implementa un método plantilla `cocinar()`, que hierve agua, añade ingredientes y cocina a fuego lento. Las subclases `RecetaPasta` y `RecetaSopa` personalizan los pasos de añadir ingredientes y la duración de cocción, asegurando que todas las recetas sigan el mismo esquema.

### **Visitor**

* **Descripción:** permite agregar nuevas operaciones a una estructura de objetos sin modificar sus clases. Se introduce un objeto visitante que implementa las operaciones y que recorre los elementos aceptándolas.

* **Ejemplo:** en un sistema de contabilidad con diferentes tipos de cuentas (ahorro, préstamos), se necesita generar múltiples reportes (balance general, flujo de efectivo, análisis de costos). Mediante el patrón **Visitor**, las operaciones de reporte se colocan en una clase visitante, permitiendo añadir nuevos reportes sin modificar las clases de cuenta. El cliente recorre las cuentas y aplica el visitante correspondiente para generar cada informe

## Patrones Emergentes

Los patrones emergentes son enfoques arquitectónicos modernos que resuelven problemas complejos de organización y estructura en sistemas de software.

### **MVC (Modelo-Vista-Controlador)**

Descripción: Separa la lógica de la aplicación (modelo), la interfaz de usuario (vista) y el control de flujo (controlador).

* Cuándo aplicarlo: Apps web y móviles donde quieres una clara separación entre datos, lógica y presentación (por ejemplo, frameworks como Ruby on Rails, Django).

### **DAO (Data Access Object)**

Descripción: Encapsula el acceso a la base de datos mediante una capa intermedia entre el código y el almacenamiento.

* Cuándo aplicarlo: Sistemas que necesitan desacoplar la lógica del negocio de la persistencia, facilitando cambios de base de datos o pruebas (por ejemplo, apps Java EE o .NET con distintas fuentes de datos).

### **CQRS (Command Query Responsibility Segregation)**

Descripción: Separa las operaciones de lectura (queries) de las de escritura (commands) a nivel de modelo y procesamiento.

* Cuándo aplicarlo: Sistemas con alta demanda de escalabilidad y rendimiento donde las consultas y los cambios de datos tienen requisitos muy diferentes. Ejemplo: plataformas de ecommerce o aplicaciones bancarias con operaciones concurrentes.

### **DDD (Domain-Driven Design)**

Descripción: Enfoca el diseño en el "dominio" o el core del negocio, usando modelos y lenguaje propios del área, y fomenta la colaboración con expertos del negocio.

* Cuándo aplicarlo: Proyectos grandes o complejos donde es crucial que el software refleje con detalle reglas y procesos del negocio, como sistemas de gestión empresarial o sector salud.

### **MVVM (Modelo-Vista-VistaModelo)**

Descripción: Amplía MVC separando aún más la lógica de presentación con un ViewModel que conecta datos y vista.

* Cuándo aplicarlo: Aplicaciones con interfaces complejas y bidireccionales, especialmente en desarrollo de apps móviles o de escritorio como WPF (Windows), Xamarin y frameworks JavaScript modernos.

# **CI/CD**

## ¿Qué es?

CI/CD en programación significa "Integración Continua y Entrega/Despliegue Continuo", y es una práctica fundamental en el desarrollo moderno de software para automatizar la integración de cambios de código, pruebas y distribución a los usuarios finales, agilizando el ciclo de desarrollo y aumentando la calidad y rapidez de los lanzamientos.

## Diferencias entre Integración Continua, Entrega Continua y Despliegue Continuo

### Integración Continua (CI)

La integración continua (CI) consiste en que los desarrolladores integren sus cambios de código en un repositorio compartido, utilizando herramientas automatizadas para compilar y probar el código en cada integración. Esto permite detectar errores rápidamente, mantener la base de código estable y reducir conflictos.

### Entrega/Despliegue Continuo (CD)

CD se refiere a dos conceptos:

* Entrega continua: los cambios de código que superen la fase pruebas automatizadas son transportados automáticamente a entornos de prueba o preparación (pre-producción), quedando listos para ser lanzados a producción cuando se decida manualmente.  
* Despliegue continuo: los cambios pasan directamente a producción de manera automatizada una vez que superan todas las pruebas, eliminando la intervención humana.

## Herramientas más usadas

### GitHub Actions

GitHub Actions es una plataforma de CI/CD integrada en GitHub. Permite automatizar compilaciones, pruebas y despliegues mediante flujos de trabajo definidos en archivos YAML almacenados en el repositorio. Los flujos de trabajo se activan por eventos como pushes, creación de pull requests o cron jobs. Un flujo de trabajo contiene **jobs**, cada job incluye pasos que pueden ser comandos o actions reutilizables. GitHub Actions permite ejecutar jobs en paralelo o en secuencia y compartir artefactos entre ellos, facilitando desde pipelines sencillos hasta despliegues complejos.

### GitLab CI/CD

GitLab ofrece una solución integrada de CI/CD donde construir, probar, empaquetar y desplegar forman parte del mismo entorno. Proporciona plantillas de pipelines reutilizables, un catálogo de CI/CD, pipelines padre‑hijo y merge trains que agrupan varias ramas en una única revisión. Además, GitLab incluye ejecutores hospedados o auto‑gestionados, análisis de seguridad y herramientas de despliegue progresivo. Esta integración reduce el tiempo que los desarrolladores invierten en configurar infraestructura y permite mayor transparencia mediante métricas.

### Jenkins

Jenkins es un servidor de automatización de código abierto que puede funcionar como servidor de integración continua o como centro de entrega continua. Jenkins se configura mediante una interfaz web simple con detección de errores y emplea una arquitectura de plugins que permite integrar innumerables herramientas y lenguajes. Puede distribuir el trabajo en múltiples máquinas para acelerar compilaciones y pruebas, y sus archivos Jenkinsfile permiten definir pipelines como código, utilizando etapas (build, test, deploy) que se ejecutan en agentes.

## Ejemplos de pipelines en proyectos reales

name: CI Pipeline Github Actions

on:  
  push:  
    branches: \[ "main" \]  
  pull\_request:  
    branches: \[ "main" \]

jobs:  
  build:  
    runs-on: ubuntu-latest

    steps:  
    \- uses: actions/checkout@v2

    \- name: Set up Python  
      uses: actions/setup-python@v2  
      with:  
        python-version: '3.8'

    \- name: Install dependencies  
      run: |  
        python \-m pip install \--upgrade pip  
        pip install \-r requirements.txt

    \- name: Run tests  
      run: |  
        pytest  
Ejemplo GitLabs  
stages:  
  \- build  
  \- test  
  \- deploy

build:  
  stage: build  
  image: node:lts-alpine  
  script:  
    \- npm install  
    \- npm run build  
  artifacts:  
    paths:  
      \- dist/

test:  
  stage: test  
  image: node:lts-alpine  
  script:  
    \- npm install  
    \- npm run test

deploy:  
  stage: deploy  
  image: node:lts-alpine  
  script:  
    \- echo "Deploying to production server..."  
    \# deploy script/commands here  
  only:  
    \- main

## Beneficios de CI/CD para equipos de desarrollo profesional

La adopción de CI/CD aporta numerosas ventajas: reduce los errores, simplifica las compilaciones, aumenta la calidad del código mediante pruebas automatizadas y retroalimentación constante y reduce los costes de pruebas. La entrega continua elimina la complejidad del despliegue y permite liberar funcionalidades con mayor frecuencia, reduciendo el estrés asociado a los lanzamientos. El despliegue continuo posibilita ciclos de desarrollo más rápidos, reduce el riesgo mediante cambios pequeños y frecuentes, y proporciona mejoras constantes al usuario.

Estos beneficios se traducen en mejores productos y un equipo más motivado: se minimizan los errores en producción, se acelera la entrega de valor al usuario y se reduce la tensión de los despliegues manuales.

## Pipeline YAML

name: CI/CD

on:  
  push:  
    branches: \[main\]

jobs:  
  check:  
    runs-on: ubuntu-latest  
    strategy:  
      matrix:  
        task: \[lint, test, security\]  
    steps:  
      \- uses: actions/checkout@v3  
      \- name: Ejecutar tarea ${{ matrix.task }}  
        run: npm run ${{ matrix.task }}

  build:  
    runs-on: ubuntu-latest  
    needs: check  
    steps:  
      \- uses: actions/checkout@v3  
      \- name: Build  
        run: npm run build

  release:  
    runs-on: ubuntu-latest  
    needs: build  
    if: github.ref \== 'refs/heads/main'  
    steps:  
      \- uses: actions/checkout@v3  
      \- name: Crear release  
        uses: ncipollo/release-action@v1

  deploy:  
    runs-on: ubuntu-latest  
    needs: release  
    steps:  
      \- name: Desplegar artefacto  
        run: ./deploy.sh

  notify:  
    runs-on: ubuntu-latest  
    needs: deploy  
    if: always()  
    steps:  
      \- name: Notificar a Slack  
        uses: 8398a7/action-slack@v3  
        with:  
          status: ${{ job.status }}

# Selección personal de 4 patrones

## Creacional – Abstract Factory

### Justificación

El patrón *Abstract Factory* es seleccionado porque el sistema requiere generar componentes visuales coherentes en distintas interfaces del frontend. Dado que existen diferentes módulos con estilos y elementos reutilizables, este patrón permite crear familias de componentes relacionados manteniendo una apariencia uniforme y evitando duplicación de código.

### Integración

Se implementa en la capa del **frontend (Svelte)**, encargándose de producir componentes de la interfaz (botones, tarjetas, banners) a partir de una misma fábrica. De esta forma, se asegura que cada componente respete una misma estructura visual, pero pueda variar en diseño o comportamiento según el contexto donde se use. Esto mejora la mantenibilidad y la escalabilidad del diseño del sistema.

## Estructural \- Decorator

### Justificación

El patrón *Decorator* es elegido por su capacidad de añadir responsabilidades adicionales a los objetos sin modificar su código original. Esto es especialmente útil en sistemas donde se requiere extender funcionalidades de manera flexible, cómo añadir registros, validaciones o manejo de errores, sin alterar la lógica base.

### Integración

Dentro del **backend (NestJS)**, se utiliza sobre servicios que interactúan con Supabase, permitiendo agregar funciones adicionales como logging o control de errores alrededor de las operaciones de base de datos. Así, el núcleo del servicio permanece limpio y centrado en su tarea principal, mientras las extensiones se agregan dinámicamente según las necesidades.

## Comportamiento \- Strategy

### Justificación

El patrón *Strategy* se selecciona porque el sistema maneja **múltiples métodos de autenticación** (por correo y contraseña, o mediante Google). Este patrón permite definir diferentes estrategias de login bajo una misma interfaz, facilitando el intercambio y la ampliación de los métodos sin modificar la lógica central del servicio de autenticación.

### Integración

En el **módulo de autenticación**, cada método de inicio de sesión (correo/contraseña, Google, etc.) se implementa como una estrategia independiente. El controlador selecciona la estrategia adecuada según el tipo de autenticación que el usuario utiliza. Esto permite mantener el código organizado, escalable y abierto a futuros métodos de autenticación sin afectar al resto del sistema.

## Emergente \- DAO (Data Access Object)

### Justificación

El patrón *DAO* fue escogido para lograr una clara separación entre la lógica de negocio y la lógica de acceso a datos. Permite encapsular las operaciones con la base de datos dentro de una capa especializada, facilitando el mantenimiento, la reutilización y las pruebas del sistema.

### Integración

Cada entidad principal del backend (por ejemplo, “Trámites”) tiene su propio **DAO**, responsable de gestionar todas las consultas a Supabase. Los servicios del sistema utilizan estos DAO para obtener o modificar información sin conocer los detalles de la conexión o la consulta. Esto reduce el acoplamiento, mejora la organización del código y promueve una arquitectura más limpia y modular.