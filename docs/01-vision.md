# SmartLocker WhatsApp Service

# Documento 01 - Visión del Proyecto

## Objetivo

Desarrollar un microservicio independiente en **Node.js** encargado de
integrar el sistema **SmartLocker** con **WhatsApp** mediante
**Evolution API**.

El servicio tendrá como responsabilidad recibir solicitudes del sistema
SmartLocker, consultar la información necesaria en la base de datos,
procesarla y comunicarse con Evolution API para enviar mensajes de
WhatsApp.

El servicio será completamente independiente del sistema SmartLocker y
se comunicará exclusivamente mediante una API REST.

------------------------------------------------------------------------

# Alcance

## Funcionalidades implementadas

-   Exponer una API REST.
-   Consultar la base de datos MySQL de SmartLocker.
-   Generar códigos QR.
-   Publicar los códigos QR mediante HTTP.
-   Preparar la integración con Evolution API.

## Funcionalidades pendientes

-   Integrar y validar el envío real de mensajes mediante Evolution API.
-   Confirmar la recepción de mensajes enviados.
-   Desplegar la solución completa en producción.

------------------------------------------------------------------------

# Responsabilidades

El servicio será responsable de:

-   Recibir solicitudes HTTP.
-   Consultar información en la base de datos.
-   Procesar la información obtenida.
-   Generar códigos QR.
-   Publicar los códigos QR.
-   Enviar mensajes mediante Evolution API.
-   Devolver una respuesta estructurada en formato JSON.

------------------------------------------------------------------------

# No será responsabilidad del servicio

Este proyecto **NO** realizará las siguientes tareas:

-   Modificar registros de la base de datos SmartLocker.
-   Registrar auditorías.
-   Guardar historial de mensajes.
-   Administrar usuarios.
-   Administrar edificios.
-   Administrar departamentos.
-   Actualizar estados de movimientos.
-   Ejecutar migraciones de base de datos.

Todas esas responsabilidades seguirán perteneciendo al sistema
SmartLocker.

------------------------------------------------------------------------

# Filosofía del Proyecto

El servicio será completamente **Stateless**.

Esto significa que:

-   No tendrá base de datos propia.
-   No almacenará información entre peticiones.
-   No mantendrá sesiones.
-   No actualizará registros.
-   Cada solicitud será procesada de forma independiente.

------------------------------------------------------------------------

# Arquitectura General

    Cliente

    ↓

    API REST

    ↓

    Routes

    ↓

    Controllers

    ↓

    Movement Service

    ├── Repository (MySQL)
    ├── QR Service
    └── WhatsApp Service

    ↓

    Evolution API

    ↓

    WhatsApp

------------------------------------------------------------------------

# Stack Tecnológico

-   Node.js
-   Express
-   mysql2
-   Axios
-   QRCode
-   Docker
-   Docker Compose
-   Evolution API
-   aaPanel
-   Nginx

------------------------------------------------------------------------

# Principios de Desarrollo

### 1. Una única responsabilidad por capa

-   Route
-   Controller
-   Service
-   Repository

### 2. Documentación primero

Diseñar → Documentar → Implementar → Probar → Documentar cambios.

### 3. Desarrollo incremental

Cada funcionalidad se completa antes de comenzar la siguiente.

### 4. Seguridad

Todas las consultas SQL utilizarán parámetros preparados.

### 5. Código limpio

Cada componente tendrá una única responsabilidad.

------------------------------------------------------------------------

# Primera Funcionalidad

    GET /api/v1/movement/:codigo

Proceso:

    Recibir código

    ↓

    Buscar movimiento

    ↓

    Buscar contactos asociados

    ↓

    Generar QR

    ↓

    Guardar QR

    ↓

    Publicar QR por HTTP

    ↓

    Enviar WhatsApp (pendiente de validar con Evolution API)

    ↓

    Retornar resultado

------------------------------------------------------------------------

# Objetivo a Futuro

El servicio será la plataforma de integración de SmartLocker con
WhatsApp.

Se prevé incorporar:

-   Recepción de Webhooks desde Evolution API.
-   Recepción de mensajes de WhatsApp.
-   Automatización de respuestas.
-   Envío de documentos.
-   Envío de mensajes personalizados.
-   Integración con nuevos procesos de SmartLocker.

------------------------------------------------------------------------

# Estado Actual

**Versión del documento:** 1.1

## Implementado

-   Arquitectura definida.
-   API REST funcional.
-   Route → Controller → Service → Repository.
-   Integración con MySQL.
-   Consultas reales sobre SmartLocker.
-   Generación de códigos QR.
-   Publicación de QR mediante HTTP.
-   Servicio de integración con Evolution API implementado.
-   Proyecto versionado con Git y GitHub.

## En desarrollo

-   Levantar Evolution API en Docker local.
-   Crear la instancia SmartLock.
-   Validar el primer envío de texto.
-   Validar el primer envío de QR.

## Pendiente

-   Dockerizar smartlocker-whatsapp-service.
-   Docker Compose.
-   Despliegue en VPS.
-   Reverse Proxy.
-   SSL.
-   Producción.
