# SmartLocker WhatsApp Service

# Documento 10 - Evolution Architecture

## Objetivo

Documentar la arquitectura de Evolution API dentro de la solución
SmartLocker WhatsApp Service y explicar el propósito de cada componente.

------------------------------------------------------------------------

# Arquitectura General

                     SmartLocker

                           │
                           ▼

          SmartLocker WhatsApp Service
                   (Node.js)

                           │
                    REST API (HTTP)

                           ▼

                    Evolution API

                           │

                  WhatsApp Web Session

                           │

                        WhatsApp

------------------------------------------------------------------------

# Componentes

## SmartLocker WhatsApp Service

Responsable de:

-   Consultar MySQL.
-   Obtener los contactos.
-   Generar el código QR.
-   Publicar el QR por HTTP.
-   Consumir la API REST de Evolution API.

No administra sesiones de WhatsApp.

------------------------------------------------------------------------

## Evolution API

Responsable de:

-   Administrar instancias de WhatsApp.
-   Mantener la sesión autenticada.
-   Enviar textos, imágenes y documentos.
-   Exponer endpoints REST.
-   Administrar Webhooks.

------------------------------------------------------------------------

## PostgreSQL

Evolution API utiliza PostgreSQL para almacenar información persistente.

Se almacenan, entre otros:

-   Instancias.
-   Estado de conexión.
-   Credenciales de WhatsApp Web.
-   Configuración.
-   API Keys.
-   Webhooks.
-   Información interna necesaria para restaurar la sesión después de
    reinicios.

Sin PostgreSQL sería necesario volver a escanear el código QR cada vez
que el servicio reinicie.

------------------------------------------------------------------------

# Arquitectura Local

    Windows

    ├── SmartLocker WhatsApp Service
    │      localhost:3000
    │
    └── Docker Desktop
           │
           ├── Evolution API
           │      localhost:8080
           │
           └── PostgreSQL

------------------------------------------------------------------------

# Arquitectura de Producción

    VPS

    Docker Network

    ├── smartlocker-whatsapp-service
    ├── evolution-api
    └── postgresql

               │
               ▼

          WhatsApp Web

Los contenedores se comunicarán por su nombre dentro de la red Docker.

------------------------------------------------------------------------

# Flujo del envío

    Cliente

    ↓

    GET /api/v1/movement/:codigo

    ↓

    Consultar MySQL

    ↓

    Obtener contactos

    ↓

    Generar QR

    ↓

    Publicar QR

    ↓

    Evolution API

    ↓

    WhatsApp

------------------------------------------------------------------------

# Decisiones de Arquitectura

-   El microservicio será stateless.
-   Evolution API será el único componente que interactúe con WhatsApp.
-   PostgreSQL será la base de datos de Evolution API.
-   SmartLocker continuará utilizando su propia base de datos MySQL.
-   Ambos sistemas permanecerán desacoplados y se comunicarán únicamente
    mediante HTTP.

------------------------------------------------------------------------

# Roadmap

1.  Levantar Evolution API en Docker local.
2.  Crear la instancia SmartLock.
3.  Vincular el teléfono.
4.  Validar el envío de texto.
5.  Validar el envío de imágenes.
6.  Integrar completamente el microservicio.
7.  Dockerizar SmartLocker WhatsApp Service.
8.  Desplegar ambos servicios en el VPS.
