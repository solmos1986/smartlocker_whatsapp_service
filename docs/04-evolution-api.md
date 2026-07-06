# SmartLocker WhatsApp Service

# Documento 04 - Evolution API

## Objetivo

Documentar la integración entre **SmartLocker WhatsApp Service** y
**Evolution API**, describiendo su arquitectura, componentes y
responsabilidades.

------------------------------------------------------------------------

# ¿Qué es Evolution API?

Evolution API es un servidor que expone una API REST para interactuar
con WhatsApp Web.

Nuestro microservicio **no se comunica directamente con WhatsApp**; toda
la comunicación pasa por Evolution API.

    SmartLocker WhatsApp Service
                │
                ▼
          Evolution API
                │
                ▼
           WhatsApp Web
                │
                ▼
            WhatsApp

------------------------------------------------------------------------

# Responsabilidades de Evolution API

-   Administrar las instancias de WhatsApp.
-   Mantener la sesión autenticada.
-   Enviar mensajes de texto.
-   Enviar imágenes.
-   Enviar documentos.
-   Recibir mensajes (Webhooks).
-   Administrar el estado de conexión.

------------------------------------------------------------------------

# ¿Por qué necesita una base de datos?

Evolution API requiere persistencia para conservar información crítica
entre reinicios.

La base de datos almacena:

-   Instancias creadas.
-   Credenciales de WhatsApp Web.
-   Estado de conexión.
-   Configuración de cada instancia.
-   API Keys.
-   Webhooks configurados.
-   (Opcionalmente) historial de eventos y mensajes.

Sin una base de datos, cada reinicio obligaría a volver a vincular el
teléfono escaneando nuevamente el código QR.

Para este proyecto utilizaremos **PostgreSQL**.

------------------------------------------------------------------------

# Arquitectura Local

    Windows

    ├── SmartLocker WhatsApp Service (Node.js)
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

    Docker

    ├── smartlocker-whatsapp-service
    ├── evolution-api
    └── postgresql

            │
            ▼

        WhatsApp Web

------------------------------------------------------------------------

# Flujo del envío de un QR

    GET /api/v1/movement/:codigo

    ↓

    Consultar MySQL

    ↓

    Obtener contactos

    ↓

    Generar QR

    ↓

    Publicar QR por HTTP

    ↓

    Enviar solicitud REST a Evolution API

    ↓

    Evolution API descarga la imagen

    ↓

    WhatsApp entrega el mensaje

------------------------------------------------------------------------

# Endpoints utilizados

## Enviar imagen

    POST /message/sendMedia/{instance}

Payload:

``` json
{
  "number": "5917XXXXXXX",
  "mediatype": "image",
  "mimetype": "image/png",
  "caption": "Tiene un paquete pendiente de recoger.",
  "media": "http://localhost:3000/storage/qr/114133.png",
  "fileName": "114133.png"
}
```

## Enviar texto

    POST /message/sendText/{instance}

------------------------------------------------------------------------

# Componentes que utilizaremos

## Obligatorios

-   Evolution API
-   PostgreSQL

## No utilizados inicialmente

-   Redis
-   RabbitMQ
-   MinIO
-   Amazon S3

Estos componentes podrán incorporarse en futuras versiones si el
proyecto lo requiere.

------------------------------------------------------------------------

# Próxima etapa

1.  Levantar Evolution API en Docker local.
2.  Levantar PostgreSQL.
3.  Crear la instancia **SmartLock**.
4.  Vincular el teléfono mediante QR.
5.  Probar envío de texto.
6.  Probar envío de imagen.
7.  Integrar completamente el microservicio.
