

**[Tipos de Patrones	5](#tipos-de-patrones)**

[Patrones de diseño GoF	5](#patrones-de-diseño-gof)

[Patrones creacionales	5](#patrones-creacionales)

[Factory Method	5](#factory-method)

[Abstract Factory	5](#abstract-factory)

[Builder	6](#builder)

[Prototype	7](#prototype)

[Singleton	7](#singleton)

[Patrones estructurales	8](#patrones-estructurales)

[Adapter	8](#adapter)

[Bridge	8](#bridge)

[Composite	9](#composite)

[Decorator	10](#decorator)

[Facade	10](#facade)

[Flyweight	11](#flyweight)

[Proxy	11](#proxy)

[**Patrones de comportamiento	12**](#patrones-de-comportamiento)

[Chain of Responsibility	12](#chain-of-responsibility)

[Command	13](#command)

[Iterator	13](#iterator)

[Mediator	14](#mediator)

[Memento	15](#memento)

[Observer	15](#observer)

[State	16](#state)

[Strategy	17](#strategy)

[Template Method	17](#template-method)

[Visitor	18](#visitor)

[Patrones emergentes	19](#patrones-emergentes)

[MVC	19](#mvc)

[DAO	19](#dao)

[CQRS	20](#cqrs)

[DDD	20](#ddd)

[MVVM	21](#mvvm)

[MVP	21](#mvp)

[Anti-patrones	22](#anti-patrones)

[Spaghetti Code	22](#spaghetti-code)

[Por qué es dañino:	22](#por-qué-es-dañino:)

[Cómo evitarlo:	22](#cómo-evitarlo:)

[Reinventar la rueda	23](#reinventar-la-rueda)

[Por qué es dañino:	23](#por-qué-es-dañino:-1)

[Cómo evitarlo:	23](#cómo-evitarlo:-1)

[CI/CD: Integración y Entrega/Despliegue Continuos	24](#ci/cd:-integración-y-entrega/despliegue-continuos)

[¿Qué es CI/CD?	24](#¿qué-es-ci/cd?)

[Herramientas más usadas	24](#herramientas-más-usadas)

[Ejemplos de pipelines típicos	24](#ejemplos-de-pipelines-típicos)

[Beneficios en equipos profesionales	25](#beneficios-en-equipos-profesionales)

[Ejemplo de YAML de pipeline sencillo (GitHub Actions)	25](#ejemplo-de-yaml-de-pipeline-sencillo-\(github-actions\))

[Selección de Patrones	26](#selección-de-patrones)

[Creacional:	26](#creacional:)

[Builder	26](#builder-1)

[Estructural:	26](#estructural:)

[Adapter	26](#adapter-1)

[De Comportamiento:	26](#de-comportamiento:)

[Observer	26](#observer-1)

[Emergente:	26](#emergente:)

[Circuit Breaker	26](#circuit-breaker)

[Bibliografía	28](#bibliografía)

# 

# 

# **Tipos de Patrones** {#tipos-de-patrones}

## **Patrones de diseño GoF**  {#patrones-de-diseño-gof}

### **Patrones creacionales** {#patrones-creacionales}

Los patrones creacionales proporcionan varios mecanismos de creación de objetos que incrementan la flexibilidad y la reutilización del código existente.  
![Factory Method][image1]

#### **Factory Method** {#factory-method}

Proporciona una interfaz para la creación de objetos en una superclase, mientras permite a las subclases alterar el tipo de objetos que se crearán.

**Ventajas:**

* Desacopla la creación del objeto de su uso.  
* Facilita la extensión sin modificar el código existente.  
* Promueve el principio de abierto/cerrado.

**Desventajas:**

* Puede aumentar la complejidad del código con muchas clases.  
* Requiere subclases para cada tipo de producto.

**Ejemplos en la industria:**

* Frameworks como Spring usan Factory Method para crear beans.  
* Aplicaciones de procesamiento de pagos que instancian diferentes métodos de pago (tarjeta, PayPal, etc.) según el tipo.

![Abstract Factory][image2]

#### **Abstract Factory** {#abstract-factory}

Permite producir familias de objetos relacionados sin especificar sus clases concretas.

**Ventajas:**

* Garantiza la coherencia entre productos relacionados.  
* Facilita el cambio de familias de productos sin modificar el código cliente.

**Desventajas:**

* Complejidad adicional al manejar múltiples fábricas.  
* Difícil agregar nuevos productos sin modificar todas las fábricas.

**Ejemplos en la industria:**

* Interfaces gráficas multiplataforma (Windows, macOS, Linux) que usan fábricas para crear botones, menús, etc.  
* Sistemas de diseño de UI como Qt o Java Swing.

![Builder][image3]

#### **Builder** {#builder}

Permite construir objetos complejos paso a paso. Este patrón nos permite producir distintos tipos y representaciones de un objeto empleando el mismo código de construcción.

**Ventajas:**

* Ideal para construir objetos complejos paso a paso.  
* Permite diferentes representaciones del mismo objeto.  
* Mejora la legibilidad y mantenimiento del código.

**Desventajas:**

* Puede ser excesivo para objetos simples.  
* Requiere más clases y coordinación.

**Ejemplos en la industria:**

* Generación de documentos (PDF, HTML) con múltiples secciones.  
* Configuración de objetos en APIs como Jackson o Lombok en Java

![Prototype][image4]

#### **Prototype** {#prototype}

Permite copiar objetos existentes sin que el código dependa de sus clases.

**Ventajas:**

* Evita la creación costosa de objetos desde cero.  
* Permite copiar objetos sin conocer sus clases concretas.

**Desventajas:**

* Requiere implementar correctamente el método de clonación.  
* Puede ser difícil con objetos que tienen referencias complejas.

**Ejemplos en la industria:**

* Juegos que clonan enemigos o escenarios.  
* Sistemas de diseño gráfico que duplican elementos visuales

![Singleton][image5]

#### **Singleton** {#singleton}

Permite asegurarnos de que una clase tenga una única instancia, a la vez que proporciona un punto de acceso global a dicha instancia.

**Ventajas:**

* Controla el acceso a una única instancia.  
* Útil para recursos compartidos como conexiones o configuraciones.

**Desventajas:**

* Puede dificultar pruebas unitarias (acoplamiento global).  
* Riesgo de abuso como variable global disfrazada.

**Ejemplos en la industria:**

* Gestores de configuración en apps móviles.  
* Controladores de acceso a base de datos (DAO) en backend.

### **Patrones estructurales** {#patrones-estructurales}

Los patrones estructurales explican cómo ensamblar objetos y clases en estructuras más grandes, a la vez que se mantiene la flexibilidad y eficiencia de estas estructuras.  
![Adapter][image6]

#### **Adapter** {#adapter}

Permite la colaboración entre objetos con interfaces incompatibles.

**Ventajas:**

* Permite reutilizar clases existentes con interfaces incompatibles.  
* Facilita la integración de sistemas heredados.

**Desventajas:**

* Puede aumentar la complejidad si se abusa.  
* Requiere conocer bien ambas interfaces.

**Ejemplos en la industria:**

* Integración de APIs externas con modelos internos.  
* Adaptadores de bases de datos o servicios de autenticación (OAuth, LDAP).

![Bridge][image7]

#### **Bridge** {#bridge}

Permite dividir una clase grande o un grupo de clases estrechamente relacionadas, en dos jerarquías separadas (abstracción e implementación) que pueden desarrollarse independientemente la una de la otra.

**Ventajas:**

* Separa la abstracción de la implementación.  
* Facilita la extensión en múltiples dimensiones sin modificar el código base.

**Desventajas:**

* Puede ser complejo de implementar inicialmente.  
* Requiere diseño anticipado.

**Ejemplos en la industria:**

* Sistemas de renderizado multiplataforma (OpenGL vs DirectX).  
* Aplicaciones con múltiples modos de operación (modo gráfico, modo texto)

![Composite][image8]

#### **Composite** {#composite}

Permite componer objetos en estructuras de árbol y trabajar con esas estructuras como si fueran objetos individuales.

**Ventajas:**

* Permite tratar objetos individuales y compuestos de forma uniforme.  
* Facilita la construcción de estructuras jerárquicas.

**Desventajas:**

* Puede complicar el diseño si no se necesita jerarquía.  
* Requiere cuidado en la gestión de recursividad.

**Ejemplos en la industria:**

* Sistemas de archivos (archivos y carpetas).  
* Interfaces gráficas con componentes anidados (botones, paneles, formularios)

![Decorator][image9]

#### **Decorator** {#decorator}

Permite añadir funcionalidades a objetos colocando estos objetos dentro de objetos encapsuladores especiales que contienen estas funcionalidades.

**Ventajas:**

* Añade funcionalidades sin modificar la clase original.  
* Promueve el principio de abierto/cerrado.

**Desventajas:**

* Puede generar muchas clases decoradoras.  
* La estructura puede volverse difícil de seguir.

**Ejemplos en la industria:**

* Añadir compresión o cifrado a flujos de datos (InputStream en Java).  
* Extensiones de componentes visuales en frameworks como React.

![Facade][image10]

#### **Facade** {#facade}

Proporciona una interfaz simplificada a una biblioteca, un framework o cualquier otro grupo complejo de clases.

**Ventajas:**

* Simplifica el uso de subsistemas complejos.  
* Reduce el acoplamiento entre cliente y subsistema.

**Desventajas:**

* Puede ocultar funcionalidades importantes si no se diseña bien.  
* Riesgo de crear una interfaz demasiado rígida.

**Ejemplos en la industria:**

* Interfaces de servicios web para clientes móviles.  
* Controladores de acceso a bibliotecas gráficas o de red

![Flyweight][image11]

#### **Flyweight** {#flyweight}

Permite mantener más objetos dentro de la cantidad disponible de memoria RAM compartiendo las partes comunes del estado entre varios objetos en lugar de mantener toda la información en cada objeto.

**Ventajas:**

* Reduce el uso de memoria al compartir datos comunes.  
* Mejora el rendimiento en sistemas con muchos objetos similares.

**Desventajas:**

* Mayor complejidad en la gestión del estado compartido.  
* No es útil si los objetos tienen estados muy distintos.

**Ejemplos en la industria:**

* Representación de caracteres en editores de texto.  
* Juegos con muchos objetos similares (enemigos, balas, partículas).

![Proxy][image12]

#### **Proxy** {#proxy}

Permite proporcionar un sustituto o marcador de posición para otro objeto. Un proxy controla el acceso al objeto original, permitiéndote hacer algo antes o después de que la solicitud llegue al objeto original.

**Ventajas:**

* Controla el acceso a objetos sensibles o costosos.  
* Permite añadir lógica antes o después de acceder al objeto real.

**Desventajas:**

* Puede introducir latencia si no se gestiona bien.  
* Añade una capa adicional que puede complicar el diseño.

**Ejemplos en la industria:**

* Proxies de red para controlar acceso a recursos.  
* Proxies de seguridad para validar permisos antes de ejecutar acciones.

### 

### **Patrones de comportamiento** {#patrones-de-comportamiento}

Los patrones de comportamiento se tratan con algoritmos y la asignación de responsabilidades entre objetos.

![Chain of Responsibility][image13]

#### **Chain of Responsibility** {#chain-of-responsibility}

Permite pasar solicitudes a lo largo de una cadena de manejadores. Al recibir una solicitud, cada manejador decide si la procesa o si la pasa al siguiente manejador de la cadena.

**Ventajas:**

* Desacopla el emisor de la solicitud de sus receptores.  
* Permite añadir o modificar manejadores sin afectar el resto.

**Desventajas:**

* Difícil de depurar si la cadena es larga.  
* No garantiza que la solicitud sea procesada.

**Ejemplos en la industria:**

* Sistemas de validación de formularios.  
* Manejo de eventos en interfaces gráficas  
* 

![Command][image14]

#### **Command** {#command}

Convierte una solicitud en un objeto independiente que contiene toda la información sobre la solicitud. Esta transformación te permite parametrizar los métodos con diferentes solicitudes, retrasar o poner en cola la ejecución de una solicitud y soportar operaciones que no se pueden realizar.

**Ventajas:**

* Encapsula solicitudes como objetos.  
* Facilita operaciones como deshacer/rehacer.

**Desventajas:**

* Puede generar muchas clases.  
* Mayor complejidad en sistemas simples.

**Ejemplos en la industria:**

* Menús de aplicaciones con acciones reversibles.  
* Sistemas de automatización de tareas.

![Iterator][image15]

#### **Iterator** {#iterator}

Permite recorrer elementos de una colección sin exponer su representación subyacente (lista, pila, árbol, etc.).

**Ventajas:**

* Permite recorrer colecciones sin exponer su estructura interna.  
* Facilita la implementación de recorridos personalizados.

**Desventajas:**

* Puede ser innecesario para colecciones simples.  
* Requiere coordinación entre colección e iterador.

**Ejemplos en la industria:**

* APIs que exponen listas de resultados (por ejemplo, paginación).  
* Recorridos en estructuras de datos complejas (árboles, grafos).

![Mediator][image16]

#### **Mediator** {#mediator}

Permite reducir las dependencias caóticas entre objetos. El patrón restringe las comunicaciones directas entre los objetos, forzándolos a colaborar únicamente a través de un objeto mediador.

**Ventajas:**

* Reduce el acoplamiento entre objetos.  
* Centraliza la lógica de interacción.

**Desventajas:**

* El mediador puede volverse muy complejo.  
* Riesgo de sobrecarga si maneja demasiadas responsabilidades.

**Ejemplos en la industria:**

* Sistemas de chat o mensajería.  
* Interfaces gráficas con múltiples componentes interactivos

![Memento][image17]

#### **Memento** {#memento}

Permite guardar y restaurar el estado previo de un objeto sin revelar los detalles de su implementación.

**Ventajas:**

* Permite restaurar el estado de un objeto sin violar encapsulamiento.  
* Útil para implementar deshacer/rehacer.

**Desventajas:**

* Puede consumir mucha memoria si se guarda mucho estado.  
* Requiere cuidado en la gestión de versiones.

**Ejemplos en la industria:**

* Editores de texto o gráficos.  
* Juegos con puntos de guardado.

![Observer][image18]

#### **Observer** {#observer}

Permite definir un mecanismo de suscripción para notificar a varios objetos sobre cualquier evento que le suceda al objeto que están observando.

**Ventajas:**

* Permite notificar múltiples objetos ante cambios de estado.  
* Promueve la extensibilidad.

**Desventajas:**

* Puede generar dependencias difíciles de rastrear.  
* Riesgo de notificaciones redundantes o desordenadas.

**Ejemplos en la industria:**

* Sistemas de eventos y notificaciones.  
* Interfaces reactivas (por ejemplo, React, Vue).

![State][image19]

#### **State** {#state}

Permite a un objeto alterar su comportamiento cuando su estado interno cambia. Parece como si el objeto cambiará su clase.

**Ventajas:**

* Permite cambiar el comportamiento de un objeto según su estado.  
* Evita condicionales complejos.

**Desventajas:**

* Puede generar muchas clases de estado.  
* Requiere diseño anticipado.

**Ejemplos en la industria:**

* Máquinas de estados (por ejemplo, cajeros automáticos).  
* Sistemas de workflow o procesos

![Strategy][image20]

#### **Strategy** {#strategy}

Permite definir una familia de algoritmos, colocar cada uno de ellos en una clase separada y hacer sus objetos intercambiables.

**Ventajas:**

* Permite intercambiar algoritmos sin modificar el cliente.  
* Promueve el principio de abierto/cerrado.

**Desventajas:**

* Puede generar muchas clases.  
* Requiere que el cliente conozca las estrategias disponibles.

**Ejemplos en la industria:**

* Algoritmos de ordenamiento o búsqueda.  
* Cálculo de precios o descuentos en e-commerce.

![Template Method][image21]

#### **Template Method** {#template-method}

Define el esqueleto de un algoritmo en la superclase pero permite que las subclases sobrescriban pasos del algoritmo sin cambiar su estructura.

**Ventajas:**

* Define la estructura de un algoritmo y permite personalizar pasos.  
* Promueve la reutilización de código.

**Desventajas:**

* Puede limitar la flexibilidad si la estructura es rígida.  
* Riesgo de acoplamiento entre superclase y subclases.

**Ejemplos en la industria:**

* Procesos de autenticación con pasos comunes.  
* Generación de reportes con formato estándar.

![Visitor][image22]

#### **Visitor** {#visitor}

Permite separar algoritmos de los objetos sobre los que operan.

**Ventajas:**

* Permite añadir operaciones sin modificar las clases de los objetos.  
* Ideal para estructuras de datos complejas.

**Desventajas:**

* Requiere modificar todas las clases visitadas para aceptar visitantes.  
* Puede romper el encapsulamiento.

**Ejemplos en la industria:**

* Recorridos en árboles de sintaxis (compiladores).  
* Exportación de estructuras a diferentes formatos (PDF, XML).

## **Patrones emergentes**  {#patrones-emergentes}

### **MVC**   {#mvc}

El Model View Controller es considerado un patrón de diseño de software, lo que hace es separar la interfaz de usuario, la lógica y los datos en tres componentes diferentes.  Este nace con la necesidad de crear sistemas de software que contenga un ciclo de vida más práctico, que permita un mantenimiento más eficaz y con la opción de reutilizar código esto por la separación de componentes.    
**Sus componentes son:** 

* Modelo:  Es  la  representación  de  la  información  con  la  cual  el  sistema  opera  y gestiona.    
* Vista: Se representa en un modelo adecuado para interactuar con el usuario. Se trabajan con los datos los cuales devuelven una respuesta.    
* Controlador: responde a los eventos que son solicitados. Es el  enlace entre las vistas y los modelos.

**Aplicación recomendada:**  
 Ideal para aplicaciones web o móviles con interfaces dinámicas. Conviene cuando se necesita separar la lógica de negocio de la interfaz gráfica para facilitar el mantenimiento, pruebas y escalabilidad.

**Ejemplo típico:**  
 Frameworks como Django, Ruby on Rails, ASP.NET MVC.

### **DAO**   {#dao}

Se conoce como un patrón que provee una interfaz abstracta de una base de datos o algún otro mecanismo de persistencia. A través de un objeto DAO se administra la conexión con el recurso de información para obtener y guardar datos.  Su estructura esta conformada por BusinessObject, DataAccessObject, DataSource y TransferObject.  

* **BusinessObject**: Representa el cliente de datos, Es el objeto que requiere acceso al origen de datos para obtener y almacenar datos.    
* **DataAccessObject:**  Es  el  objeto  principal  de  este  patrón,  el  DataAccessObject abstrae la implementación de acceso a datos subyacente para BusinessObject.    
* **DataSource:** Representa el origen de los datos los cuales podrían ser una base de datos  como  un  RDBMS,  OODBMS,  repositorios  XML,  sistemas  de  archivos  de formato.    
* **TransferObject**: Es un objeto de transferencia a en el cual los datos se almacenan.

**Aplicación recomendada:**  
 Útil cuando se requiere desacoplar la lógica de negocio del acceso a datos. Conviene en sistemas con múltiples fuentes de datos o que pueden cambiar de tecnología de persistencia.

**Ejemplo típico:**  
 Aplicaciones Java con JDBC, Hibernate o Spring Data.

### **CQRS**   {#cqrs}

Command Query Responsibility Segregation (Segregación de Responsabilidad de Consultas de Comando). Es un patrón de diseño emergente que se basa en dividir en dos modelos de implementación: lectura y escritura.  El modelo de escritura, es aquella que se encarga de actualizar la base de datos y el modelo de lectura únicamente se encargará de consultarla.

Modelo de escritura 

* Aggregate   
* Commands   
* Dominios de escritura  
*  Repositorio de escritura  

Modelo de lectura 

* Projection   
* Queries   
* Dominios de lectura   
* Repositorio de lectura

**Aplicación recomendada:**  
 Recomendado en sistemas con alta carga de lectura y escritura, donde se necesita escalar cada operación por separado. Conviene en arquitecturas orientadas a eventos o microservicios.

**Ejemplo típico:**  
 Sistemas de comercio electrónico, banca digital, mensajería.

### **DDD**   {#ddd}

Es  un  patrón  de  diseño  con  un  enfoque  basado  en  dominios  (domains),  para necesidades complejas, haciendo un enfoque en el dominio principal, los aspectos del modelo y el núcleo del negocio.  

* Domain: El dominio en términos de DDD, es el problema de negocio para el que se está diseñando la solución.    
* Core Domain: El diferenciador clave para el negocio del cliente: algo que deben hacer bien y no pueden subcontratar.    
* Sub-Domain: Separan las características o aplicaciones que su software debe admitir o debe interactuar. 

**Aplicación recomendada:**  
 Ideal para proyectos complejos donde el dominio del negocio requiere modelado profundo. Conviene cuando se trabaja con expertos del dominio y se necesita reflejar fielmente las reglas del negocio.

**Ejemplo típico:**  
 ERP, CRM, sistemas financieros o logísticos

### **MVVM**   {#mvvm}

Es un patrón de diseño de software desarrollado por Microsoft en el 2008\.  Se caracteriza por tratar de desacoplar lo máximo posible la interfaz de usuario de la lógica de la aplicación.    
Este mismo se compone en 3 estructuras las cuales son:  

* **Modelo**: Encargado de representar el modelo del negocio, proveyendo de esta manera la base necesaria para la manipulación de los datos de la aplicación.    
* **Vista**: Encargada de la parte visual de nuestra aplicación, sin ocuparse en el manejo de datos.     
* **Vista-Modelo**: Encargado de ser la capa intermedia entre el modelo y la vista, procesando todas las peticiones que tenga la vista hacia el modelo.

**Aplicación recomendada:**  
 Diseñado para aplicaciones con binding de datos, especialmente en entornos como WPF, Xamarin o Angular. Conviene cuando se quiere desacoplar completamente la vista de la lógica.

**Ejemplo típico:**  
 Aplicaciones de escritorio o móviles con interfaces reactivas.

### **MVP**   {#mvp}

Modelo-vista-presentador  (MVP)  es  una  derivación  del  patrón  arquitectónico modelo-vista-controlador (MVC) y se usa principalmente para construir interfaces de usuario.    
Este mismo posee 3 capas las cuales son:  

* Modelo: Esta capa gestiona los datos. Son las clases que denominaremos de lógica de negocio.    
* Vista: Se encarga de mostrar los datos. Aquí se encontrarán nuestros Fragmentos y Vistas.    
* Presentador: Se sitúa entre el modelo y la vista, permitiendo conectar la interfaz gráfica con los datos.  

Por otra parte, este mismo también cuenta con 2 modos los cuales son: 

* MVP  como  Controlador  Supervisado:  se  puede  tener  un  presentador  que  no gestione la información de la vista, es la misma vista quién gestiona toda su lógica.    
* MVP  como  Vista  Pasiva:  es  posible  hacer  que  el  presentador  gestione  en  su totalidad la información de la vista, en pocas palabras, hace que la vista no tenga ninguna lógica, limitándose a sólo mostrar datos.

**Aplicación recomendada:**  
 Útil en entornos donde la vista no puede manejar lógica compleja (por ejemplo, Android). Conviene cuando se necesita testear la lógica de presentación sin depender de la interfaz gráfica.

**Ejemplo típico:**  
 Aplicaciones Android con arquitectura limpia.

## **Anti-patrones**  {#anti-patrones}

### **Spaghetti Code** {#spaghetti-code}

#### **Por qué es dañino:** {#por-qué-es-dañino:}

* Hace que el sistema sea difícil de entender, mantener y escalar.  
* Cualquier cambio puede romper otras partes del código.  
* El reuso es prácticamente imposible.  
* Consume tiempo: hasta el 50% del mantenimiento se dedica solo a entender el código.

#### **Cómo evitarlo:** {#cómo-evitarlo:}

* Aplicar principios SOLID y buenas prácticas de diseño.  
* Usar una arquitectura modular y patrones de diseño adecuados.  
* Documentar el código y mantener una estructura clara.  
* Evitar mezclar lenguajes en un mismo archivo (por ejemplo, PHP, HTML y JavaScript sin separación lógica).

### 

### **Reinventar la rueda** {#reinventar-la-rueda}

#### **Por qué es dañino:** {#por-qué-es-dañino:-1}

* Duplica esfuerzos innecesarios.  
* Aumenta el tiempo y costo de desarrollo.  
* Reduce la calidad al no aprovechar soluciones probadas.  
* Limita el reuso entre proyectos.

#### **Cómo evitarlo:** {#cómo-evitarlo:-1}

* Investigar y evaluar bibliotecas, frameworks y componentes existentes antes de desarrollar.  
* Fomentar una cultura de reuso y documentación interna.  
* Mantener un repositorio de soluciones reutilizables dentro del equipo o empresa.  
* Promover el conocimiento compartido entre desarrolladores y arquitectos.

## 

## **CI/CD: Integración y Entrega/Despliegue Continuos** {#ci/cd:-integración-y-entrega/despliegue-continuos}

### **¿Qué es CI/CD?** {#¿qué-es-ci/cd?}

CI/CD es una práctica de desarrollo que automatiza el proceso de integración, prueba y entrega de software. Su objetivo es acelerar los ciclos de desarrollo, mejorar la calidad del código y facilitar el despliegue frecuente.

* CI (Integración Continua):  
   Automatiza la integración de cambios en el código fuente. Cada vez que un desarrollador hace un commit, se ejecutan pruebas y compilaciones automáticamente para detectar errores temprano.

* CD (Entrega Continua):  
   Automatiza el paso del código probado hacia entornos de staging o preproducción. El despliegue de producción requiere aprobación manual.

* CD (Despliegue Continuo):  
   Va un paso más allá: el código pasa automáticamente a producción si supera todas las pruebas. No requiere intervención humana.

### **Herramientas más usadas** {#herramientas-más-usadas}

Según las tendencias actuales:

| Herramienta | Características clave |
| :---- | :---- |
| GitHub Actions | Integrado con GitHub, fácil configuración con YAML |
| GitLab CI/CD | Todo en uno: repositorio, CI/CD, gestión de proyectos |
| Jenkins | Altamente personalizable, gran comunidad, muchos plugins |
| CircleCI | Rápido, enfocado en eficiencia y simplicidad |

### **Ejemplos de pipelines típicos** {#ejemplos-de-pipelines-típicos}

Un pipeline básico que se suele incluir:

* Build: Compilar el código.  
* Test: Ejecutar pruebas unitarias y de integración.  
* Lint: Validar estilo y convenciones.  
* Deploy: Desplegar a staging o producción.

Ejemplo real:

* En una app web con React y Node.js:  
  * Se ejecutan pruebas con Jest.  
  * Se construye el frontend con Webpack.  
  * Se despliega automáticamente a Vercel o Heroku tras pasar las pruebas.

### **Beneficios en equipos profesionales** {#beneficios-en-equipos-profesionales}

* Menos errores en producción: Las pruebas automáticas detectan fallos antes.  
* Despliegues más rápidos y seguros: Automatización reduce el riesgo humano.  
* Mayor colaboración: Todos los cambios se integran y validan continuamente.  
* Feedback inmediato: Los desarrolladores saben si su código rompe algo en minutos.

### **Ejemplo de YAML de pipeline sencillo (GitHub Actions)** {#ejemplo-de-yaml-de-pipeline-sencillo-(github-actions)}

![][image23]

Explicación:

* Se activa cuando hay un push a la rama main.  
* Usa un entorno Ubuntu.  
* Descarga el código, instala dependencias y ejecuta pruebas.

## **Selección de Patrones** {#selección-de-patrones}

### **Creacional:**  {#creacional:}

#### **Builder** {#builder-1}

**Justificación**:  
Permite construir objetos complejos paso a paso, ideal para formularios de registro, configuración de usuarios o generación de reportes personalizados.  
**Integración en el sistema**:  
Se usará para construir objetos Usuario con múltiples atributos opcionales (roles, preferencias, datos extendidos) sin depender de constructores con muchos parámetros. Esto mejora la legibilidad y facilita la validación modular.

### **Estructural:**  {#estructural:}

#### **Adapter** {#adapter-1}

**Justificación**:  
Facilita la integración de componentes externos con interfaces incompatibles, sin modificar su código original.  
**Integración en el sistema**:  
Se aplicará para conectar el sistema con servicios externos de autenticación (por ejemplo, OAuth o LDAP), adaptando sus respuestas al modelo interno de Credenciales. Esto permite mantener una arquitectura limpia y desacoplada.

### **De Comportamiento:**  {#de-comportamiento:}

#### **Observer** {#observer-1}

**Justificación**:  
Permite que múltiples componentes reaccionen automáticamente a cambios en el estado de un objeto, sin acoplamiento directo.  
**Integración en el sistema**:  
Se usará para notificar a módulos como auditoría, historial de cambios o envío de correos cuando se actualicen datos sensibles de usuarios o se realicen operaciones críticas. Esto mejora la trazabilidad y la extensibilidad.

### **Emergente:**  {#emergente:}

#### **Circuit Breaker** {#circuit-breaker}

**Justificación**:  
Patrón emergente usado para evitar fallos en cascada cuando un servicio externo falla repetidamente.  
**Integración en el sistema:**  
Se aplicará al módulo de conexión con la base de datos o APIs externas. Si un servicio falla varias veces, el sistema corta temporalmente el acceso y responde con una alternativa segura (por ejemplo, caché o mensaje de error controlado). Esto mejora la resiliencia del sistema.

## **Bibliografía** {#bibliografía}

* Martínez Canelo, M. (s.f.). Qué son los patrones de diseño de software / Design Patterns. Profile. Recuperado el 8 de octubre de 2025, de [https://profile.es/blog/patrones-de-diseno-de-software/](https://profile.es/blog/patrones-de-diseno-de-software/)

* González Sánchez, J. (s.f.). Anti-patrones: la mejor forma de hacer un pésimo sistema de software. SG Buzz. Recuperado el 8 de octubre de 2025, de [https://sg.com.mx/revista/11/anti-patrones-la-mejor-forma-hacer-un-pesimo-sistema-software](https://sg.com.mx/revista/11/anti-patrones-la-mejor-forma-hacer-un-pesimo-sistema-software)

* Unity Technologies. (s.f.). ¿Qué es CI/CD? Explicación de CI/CD. Unity. Recuperado el 8 de octubre de 2025, de [https://unity.com/es/topics/what-is-ci-cd](https://unity.com/es/topics/what-is-ci-cd)

* García, E. (2020). Patrones de diseño emergentes \[Apuntes de clase, Universidad Tecnológica de Guadalajara\]. Studocu. Recuperado el 8 de octubre de 2025, de [https://www.studocu.com/es-mx/document/universidad-tecnologica-de-guadalajara/programacion-iii/patrones-de-diseno-emergentes/13116831](https://www.studocu.com/es-mx/document/universidad-tecnologica-de-guadalajara/programacion-iii/patrones-de-diseno-emergentes/13116831)

* Sanchis, L. (2022, febrero 10). Qué es un pipeline de ventas, ejemplos y plantillas. Connext. Actualizado el 27 de febrero de 2025\. Recuperado el 8 de octubre de 2025, de [https://www.connext.es/blog/pipeline-que-es-y-como-puede-ayudar-en-ventas-b2b/](https://www.connext.es/blog/pipeline-que-es-y-como-puede-ayudar-en-ventas-b2b/)

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,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>

[image7]: <data:image/png;base64,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>

[image8]: <data:image/png;base64,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>

[image9]: <data:image/png;base64,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>

[image10]: <data:image/png;base64,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>

[image11]: <data:image/png;base64,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>

[image12]: <data:image/png;base64,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>

[image13]: <data:image/png;base64,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>

[image14]: <data:image/png;base64,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>

[image15]: <data:image/png;base64,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>

[image16]: <data:image/png;base64,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>

[image17]: <data:image/png;base64,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>

[image18]: <data:image/png;base64,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>

[image19]: <data:image/png;base64,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>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAABkCAMAAABjCSjjAAADAFBMVEVHcEz//////v7////Q0NGztLXoyMjWm5vz4eGvsLHr0ND////s09PfsLDdrq7////z2trKc3Pjurrtz8///f347e3////pysrPh4fy39/it7fesLD//f357u7Cvr7t0NDZo6PjtrbmwsK5urrUlJTXnZ3Sjo7bpqZITE0uNDaWmJj////IyMn6+vqsra7m5ue/wMGIiotSVVaJi4vAwcHg4OBTVldqbW1YW1zUlpbTk5O6HR3ZoqJ8fn/Q0dHSjIzgq6vhtLT68fH89vbqz8/u19fx3Nzx0tK9NDTkvb3s7O3e39+/QkLPhYXt09PnxMTry8vOfn7Xnp7bqanOenq+Pj7ASkr47e3EXFzCUFDWmprGZGS8KCiRKCmyWVn15uZiLzH++vry4eGwHx+wl5e4HR27ISHJbW3DVlb26enqzs6qcHH24uKUkJEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjUhurAAAAKHRSTlMAA0pVhqqi9VOq5bXlqtsXzv6iuyJtCpL1Zcq+LkLFhd3psbbw4/HPQ/4wSgAACqtJREFUeF7tmltv28gVx8/wKkqy5IsiyZYvchLHzqW72I0gb4KiaYNin1ugz+1X65foSwsUm6JINoa33aaKc3MSx7YsyZGVWJZEUbx1hqTs4ZCyrcQu8uAfYI745+1wLuecGRPgggsuuOB8Qe4WueVpsW2blc4CwdnyV4c0Zt1gpbOAc7ZDVszQ558St2aGvP35NFK/Zr4Qvihj+s3kgYC0AIcQ6aCCbVtBzfRdcKb4a0Y0TRFrgs5jIwVeF7iAJvouOFt8NaO0ZaEtm5Idt3gAWY8jMGRG0+kLzhi6ZrAtuhrTorbZ6SFe1o2OhqKsRhruvKCNEWL4tdUYMg2wenhrgWGigHaO0M104GxVZ2t1ncII0c6PL2pof1HG9Jsp0fTJx5PYZ5UA0m0cX35C3UEle74D72zlUY3Rj0WD5klRu4idJJqqSQVEyvciUxqh0c2tGQNSQwXK+km2YLctIEDf1WRyXzQH/vLug9C66TfT3lDGsEIYSAbQoert+ctE4UmYMefVgUsjCitRDHhzxpi5OafIOzKXH6idCPrxE9yjP2oLVRBwdxDfRHsWcNIbWQ9oe74LTsssj1BjYp2VGXw1I/A2wrFZ0URe4DjJFjUxoLnO+ETs7+g7LzTFxt7T+kLW289CaPB3hzY/TtJOQTYNEw+CrmzYHIczFzOqChFGc8dR46RGuN2zcKVbbWcnw49yiYiCOpnMriOIJa5Dn+3hi9o4DuJoqOPGwRGSPFeV9YD2CYzFzUorkk/Mlb16rXJ1/xkutDETuFPg2HyZpCxGNkueq18OakOTbav7VlJrjzek166Sa0b8p7jQzfTR8R/2R0fad11+mAanaKYZ0tG8Zsqa3dpCFY1tp956R1Gu3qNO7uMZ832uE5EXdmFJj5yqHGBMWk14cWX/qmj3jeHUPdi93LUz1ZZ3XgTVwozxmumNXz2JZVbwQN8rmaT768jPXEkTKarsrouDrvNwfaH4R/SIOXAcd9Cfw1PhzK924LXdxa2ZROTBeg0KG0YmueIcHBlpvXLPS6Inbtbmx3N6D70Z5S0okSKXI5cXy+UB2hpE7NvulX6Mm0+vwPhqBew7iFRN1lhfK7y4lXh+M2NfKlkp77Rs7UQ/A1DQYW4H+8uWvVCGYr2Z3g9oozXcO+vl+NckFwjQfo/volbVvp9BYxHjYLa7mJGQodmbzsvBQD/j1cyyU5EFFfuBwupsM8vXi1BXstXZTVaT3Au4Z2ENNXJ78inkf4g2+kK1iitnotx7Tp9F/AwxOoBnjHj3kWNLCuqwVE08L+BSUbAJSwGNnL60Euq0QGw08j8cvr+Ldf3Nrut3j8itR8JSCM+Ytet401NTK7ghGolNWC1gh7wKm7PVcVbDPByU0MjWps+UGfy32DEylOSgheczXp/JXdrGhmVxY5UXuvgn7GTQz7jYnwhqhAF+prV94OXSrp9p8Tz/gWwYxlqhfsYb2sXrwwxtu/j37RRb9X7coT2IkUro0Pac3hLAvSTm3qnKgnjjD1dzc5zr384Oxs+ckm7uOcrDdXXjHXukj32nJcCoCj3SvQ5L2HfyZzwXCfUzXjNdHcoY277vdp7yhv/AEXdIlQulr5yuIZQSU04JbtQXSnZoDvGJOfDjEXKgMnjh6CfLtq1HB5cgT8q9yqpNykfYpjTZb4TZwtSMwANJn0TNzXc7Tg7s18QDUjM9lMmjt5Xj42sy9tXBa3GLUlD6N1v5fw5sW184wPkunghaiipKYCPJRj3JYjWSbAG85cdjVfNu6bhkazo229u1iE84or1XEa+/mnCz0QCfmgNL16KPbr22j5l0z0Sz8//+yLr9FqjCL99x4bNp2piYoVu2JWi4cSzEkcYxpJ7Aag6NVmezsjc+93qQL4bJO9bUSvcwSB1ijPb0MT0eus5AGzNF/Kpt5ckdrOn4B1LMBzVCw2o2Qbmx5y0mBZm7tz3zoBzWHE2z/a2pR8Os+ZwcuHMwerkWWuFp/bdba+X+/JpBU2qL1tKHfgpK8VlzbWs+GXJLPIyE++XX8Qor99l9+4+Zyn3XYfjoT28nhnJ6npfQ/3IjhXMtQLP+vpFOH+TffiSuyGV8E9dvyjrKgDqPFzeWDX9L6V3PGAFCndBgBOfGddm9HhV3/IcBNuapnaktm+Q1lAIHUM7T+wCr/ZoxIBnWoQaR2PcGVR6ipEA7MImLQ4tEfxaIdki165DDHU0bsHAwVbn98LCZmsM006HhrdSm94uMqkFOZ9QrLXzSwgCn7bxU35hPownfDpMH9Sl2Ijz2zNNm9KVvxH2eMQn4Fyv5KUY6TqLqF528EeAFwM2YN/t28BvDSUBij6AYZLlAEVQjqNFuLg6z3rQsjGyc01/C1cASkWYuyg14D5fGOy8mM2Q4evj8DCfZvMCReNnGyY/YxnsBzZdIW8f4qWJa0VDLHmHXG27tND48Xte0REKrbPPJ1MLRIfpm+LmmJgpR2e7ENFHR5A7io6xGD5TkLWAD4SELcqxtmRqSnekoxd6NzM7U1CvCmFTr/c3pui60Mfi5hoHfRjcsVdbasm717BarUedDSwWZ3j9i+Vq6NJEAoZkINBIHW1Mzbkda6c2u/JqKJ7QxOonJhimS/+PoPI+faxliQKNIHqyFzSshs/gCjNQHdZ77uj/0jzBw9+vH+qoMIjXPpY1x8wPDdNIn99/FVoh2SDoF6RDPXZydkJTWXvJ9+zn3gD0IUPuFrhw5tUKZuEuPT8yBHeziPJuv5FLFK714XY5NNWuXJ+psf3EoXSv1Lyskd3PUC/qNEapVMtbFNxJH+vMbMqFgtCN3nky+/ZH122NKb8+OJipIiaH+Ah5LtLQMRffnRy5pOksOLj5j2DXf49eB1fvzOjutLEU3lN19NZEudTapp/gopz+MuVWzPNEQaEfn+y3rBkjYoci6hp+Mc+BYW2S1wxR88t7T/krqIZnRVKoRO8i/N/opYRhjQi2ygJ1loa6YKr1YQhujkP/N9iRnzRd4dx1YI+PIp3nMLG+txf0VU6zG+ZZVmZKElz6d5XFa7phXEVSMyb/+jj5AN9Mw68CTy5WZCD0lwjSau9q7zbUJJWQM+dgd5+XxV69gsvWNry3pmtlwtpZbeDOtMA3zp9bWzCM2r2zlyunWzu//u8joQf6TzsmppZLGU4EJ2EDJfvcw4FuIu9ozmHzA2gJVLtXbgceFx+yBILvpd7l6zL/ExRojaoA7Byd0FeIoeTWCOwyjoW82f34GU082A7bANHR3prFN04xOJ+2vvIMfYQ8QdaITFHzGnOpbiE7vxlLvAclqzxzfaMLjV4+1E7qpcRIv6EZP4KNNRrNaWT36sHIetvj9TEw9+u5Bcr6FACmg4dAXiMRnBG1MyHcPp/4WInQyxxDsZQyDM7UhmFxjFT9rJDKPO4tXA7lZYheL2Hx3QA5s2+u+PAbljn/pSZKAoxNW6uL7/tGE46AgGGR9iKR0YjvBg8FqYamd7Wb7A3EOn/Q93b6/z5Ac2MQzVqR3Ys6A7ki8ZDFaaGp3RtDGkBwYgG9FnHyX5N49oaWw2jlCG6MTh2+Al+8ClQPT2jlCG+MupHqB2W1hJ/VltPPjTIb2WfFFGdNvppMG3v8Ft2aGNWXY80+J6xVP8o4s5/TZ9gUXXHDBefM/ZTB+UQVCwaEAAAAASUVORK5CYII=>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAABkCAMAAABjCSjjAAADAFBMVEVHcEz////////5+fnV1db///+ztLW2t7f///92eHkuNDb////o6OhITE3Ldna6HR337u6WmJjQ0dG+v7/WnJy8KSnHamraqKjPhobx3t7BTU3v2trlw8P05eX9+vrXnZ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+bCnHAAAACXRSTlMAM1WaeEuq1BgSVgjDAAACXklEQVR4Xu2YUXeiMBCFM4CAPXvOtv//R7bdh1ZESQHFtTcZMokrsj3zPeRhAubmziTEGKMoinJfCANBSPqKtRgJIf3lC1RLX7G7WDUZBkKIjYl4cqLAgADZILG2mARn7smqxKSkaYDoiKELefw6OvEjnLGWL+MOA1JW5cyqxKSmSQuYQwt4UVLTZHIy9si2afwMZ06z59o0VuXMqsQkp8ktWi3gE27RagHfj9Q06RGCQ48Qi5KSpsTyDBPtjHylyJ+c4MuQw7npoJKsIbvHsZcQgxQbspVpyLYH7Iolx0Aso5a2Kw+Upa/pM7c6c32rFn9vBkQX8D251ZmxnqmvGZtSsUDKPvONQUFvr721XgZEYjb8F3pkMCeQ77zFiAeJmKIOiOmpMADkVrDwAxMaycJaghwlA0mc6ef9jpFIfjcY8SETc/N2JkPi3mKoGA4Vw+GsJs9uS17N5Q4jZ+o9RgY8W7SzK+OHsti6Yvwcua2jkp6R8k/YlVGvfLd9wsAE24E4u7KTJlN5XUYqLkkDNWfaN0rnKRT3UFYlxk3TSP2Jkb9Y2QQ6XBtXbP1Jlv3wQjDO7GamNdN1zdw0/cbMvrI4qxLDpEkLmHNGC5hzxmyJ9i3bSvhFRPYP1+LTI4wzz23V/y/jWhFl9tFt2NYLI+YxMGLenhvTsK2IffeUtWzrBZdGWUjPM9Urxs68NNLzzAGG0gLWAvaW7v9SwIwzj4FZTXqE4JzRI8S6xLhpEi1LzugTs50X3IHQmU56n2E+MDDBdiA53qGiM4ed9E6kxMAEyYzpxQguzRVFUf4pX6eoIPqqIziIAAAAAElFTkSuQmCC>

[image22]: <data:image/png;base64,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>

[image23]: <data:image/png;base64,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>