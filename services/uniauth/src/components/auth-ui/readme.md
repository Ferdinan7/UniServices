# auth-widget



<!-- Auto Generated Below -->


## Overview

Componente de autenticación que implementa el patrón Strategy

Este componente usa AuthService que actúa como Context del patrón Strategy,
delegando las operaciones de autenticación a diferentes estrategias:
- EmailPasswordStrategy: Para autenticación con email y contraseña
- GoogleOAuthStrategy: Para autenticación con Google OAuth

Patrón Strategy aplicado:
- Context: AuthService
- Strategies: EmailPasswordStrategy, GoogleOAuthStrategy
- Client: Este componente (auth-widget)

El componente no necesita conocer los detalles de implementación de cada
estrategia, solo usa la interfaz común proporcionada por AuthService.

## Properties

| Property             | Attribute              | Description | Type     | Default                   |
| -------------------- | ---------------------- | ----------- | -------- | ------------------------- |
| `height`             | `height`               |             | `string` | `'600px'`                 |
| `image`              | `image`                |             | `string` | `'bike.png'`              |
| `redirectAfterLogin` | `redirect-after-login` |             | `string` | `'http://localhost:5173'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
