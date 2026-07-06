# SmartLocker WhatsApp Service
# Documento 01 - Visión del Proyecto

## Objetivo

Desarrollar un microservicio independiente en **Node.js** encargado de integrar el sistema **SmartLocker** con **WhatsApp** mediante **Evolution API**.

El servicio tendrá como responsabilidad recibir solicitudes del sistema SmartLocker, consultar la información necesaria en la base de datos, procesarla y comunicarse con Evolution API para enviar mensajes de WhatsApp.

El servicio será completamente independiente del sistema SmartLocker y se comunicará exclusivamente mediante una API REST.

---

# Alcance

En su primera versión el servicio será capaz de:

- Exponer una API REST.
- Consultar la base de datos MySQL de SmartLocker.
- Generar códigos QR.
- Enviar mensajes de WhatsApp utilizando Evolution API.
- Devolver el resultado del proceso al sistema que realizó la solicitud.

---

# Responsabilidades

El servicio será responsable de:

- Recibir solicitudes HTTP.
- Consultar información en la base de datos.
- Procesar la información obtenida.
- Generar códigos QR.
- Enviar mensajes mediante Evolution API.
- Devolver una respuesta estructurada en formato JSON.

---

# No será responsabilidad del servicio

Este proyecto **NO** realizará las siguientes tareas:

- Modificar registros de la base de datos SmartLocker.
- Registrar auditorías.
- Guardar historial de mensajes.
- Administrar usuarios.
- Administrar edificios.
- Administrar departamentos.
- Actualizar estados de movimientos.
- Ejecutar migraciones de base de datos.

Todas esas responsabilidades seguirán perteneciendo al sistema SmartLocker.

---

# Filosofía del Proyecto

El servicio será completamente **Stateless**.

Esto significa que:

- No tendrá base de datos propia.
- No almacenará información entre peticiones.
- No mantendrá sesiones.
- No actualizará registros.
- Cada solicitud será procesada de forma independiente.

---

# Arquitectura General

```
Cliente

↓

API REST

↓

Controller

↓

Service

↓

Repository

↓

MySQL

↓

Service

↓

QR Service

↓

WhatsApp Service

↓

Evolution API

↓

WhatsApp
```

---

# Stack Tecnológico

- Node.js
- Express
- mysql2
- Axios
- QRCode
- Docker
- Docker Compose
- Evolution API
- aaPanel (Despliegue)
- Nginx (Reverse Proxy)

---

# Principios de Desarrollo

Durante el desarrollo del proyecto seguiremos las siguientes reglas:

### 1. Una única responsabilidad por capa

Cada capa tendrá una única responsabilidad.

- Route
- Controller
- Service
- Repository

---

### 2. Documentación primero

Antes de implementar una funcionalidad:

- Se diseña.
- Se documenta.
- Luego se desarrolla.

---

### 3. Desarrollo incremental

Cada funcionalidad seguirá este ciclo:

1. Diseño.
2. Implementación.
3. Pruebas.
4. Correcciones.
5. Documentación.

Solo después comenzará la siguiente funcionalidad.

---

### 4. Seguridad

Todas las consultas SQL utilizarán parámetros preparados.

Nunca se concatenarán parámetros directamente en las consultas SQL.

---

### 5. Código limpio

Se evitarán:

- Código duplicado.
- Lógica SQL dentro del Service.
- Lógica de negocio dentro del Repository.

Cada componente tendrá una única responsabilidad.

---

# Primera Funcionalidad

```
GET /api/v1/movement/:codigo
```

Proceso:

```
Recibir código

↓

Buscar movimiento

↓

Buscar contactos asociados

↓

Generar QR

↓

Enviar WhatsApp

↓

Retornar resultado
```

---

# Objetivo a Futuro

El servicio será la plataforma de integración de SmartLocker con WhatsApp.

Además del envío de códigos QR, en futuras versiones podrá incorporar nuevas funcionalidades como:

- Recepción de Webhooks desde Evolution API.
- Recepción de mensajes de WhatsApp.
- Automatización de respuestas.
- Envío de imágenes.
- Envío de documentos.
- Envío de mensajes personalizados.
- Integración con nuevos procesos del sistema SmartLocker.

Estas funcionalidades se desarrollarán sin modificar la arquitectura base del proyecto.

---

# Estado Actual

Versión del documento:

**1.0**

Estado del proyecto:

- Arquitectura definida.
- Estructura del proyecto creada.
- API REST inicial implementada.
- Flujo Route → Controller → Service → Repository funcionando.
- Pendiente la integración con MySQL y Evolution API.