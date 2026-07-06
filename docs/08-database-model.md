# SmartLocker WhatsApp Service
# Documento 08 - Modelo de Datos

## Objetivo

Documentar las tablas de la base de datos utilizadas por el microservicio **SmartLocker WhatsApp Service**.

Este documento únicamente contempla las entidades necesarias para el envío de mensajes de WhatsApp. El servicio es de **solo lectura** y no modificará información de la base de datos.

---

# Arquitectura de Consulta

El microservicio seguirá el siguiente flujo:

```
Movimiento
      │
      ▼
Departamento
      │
      ▼
Usuarios Activos
      │
      ▼
Generar QR
      │
      ▼
Enviar WhatsApp
      │
      ▼
Retornar Resultado
```

---

# Modelo Relacional

```
Building (1)
│
├─────────────────────┐
│                     │
▼                     │
Department (N)        │
│                     │
▼                     │
User (N)              │
                      │
Movement -------------┘
```

---

# Tabla: movement

Representa un movimiento generado por SmartLocker.

| Campo | Tipo | Descripción |
|--------|------|-------------|
| movement_id | bigint | Identificador del movimiento |
| door_id | int | Puerta asociada |
| department_id | int | Departamento asociado |
| building_id | int | Edificio asociado |
| code | text | Código único del movimiento |
| type_movement_id | int | Tipo de movimiento |
| id_ref | text | Referencia externa |
| status_notificate | tinyint | Estado de notificación |
| status_integrate | tinyint | Estado de integración |
| create_at | datetime | Fecha creación |
| update_at | datetime | Fecha actualización |

---

# Tabla: department

Representa un departamento perteneciente a un edificio.

| Campo | Tipo | Descripción |
|--------|------|-------------|
| department_id | int | Identificador |
| building_id | int | Edificio al que pertenece |
| name | varchar(250) | Nombre del departamento |
| key | tinyint | Llave del departamento |
| create_at | datetime | Fecha creación |
| update_at | datetime | Fecha actualización |

---

# Tabla: user

Representa una persona asociada a un departamento.

| Campo | Tipo | Descripción |
|--------|------|-------------|
| user_id | int | Identificador |
| department_id | int | Departamento asociado |
| name | varchar(250) | Nombre de la persona |
| celular | varchar(250) | Número de celular |
| state | tinyint | Estado (1 = Activo) |
| create_at | datetime | Fecha creación |
| update_at | datetime | Fecha actualización |

---

# Relaciones

## Movimiento → Departamento

```
movement.department_id
        │
        ▼
department.department_id
```

---

## Departamento → Edificio

```
department.building_id
        │
        ▼
building.building_id
```

---

## Departamento → Usuarios

```
department.department_id
        │
        ▼
user.department_id
```

---

# Flujo de Consulta

Cuando el endpoint recibe:

```
GET /api/v1/movement/{codigo}
```

el flujo será:

```
1. Buscar el movimiento.

↓

2. Obtener el department_id.

↓

3. Buscar los usuarios activos.

↓

4. Generar el QR.

↓

5. Enviar el WhatsApp.

↓

6. Devolver el resultado.
```

---

# Consulta 1
## Buscar Movimiento

```sql
SELECT
    movement_id,
    door_id,
    department_id,
    building_id,
    code,
    type_movement_id,
    id_ref,
    status_notificate,
    status_integrate
FROM movement
WHERE code = ?
LIMIT 1;
```

---

# Consulta 2
## Buscar contactos del departamento

```sql
SELECT
    u.user_id,
    u.name,
    u.celular,
    d.department_id,
    d.name AS department_name,
    b.building_id,
    b.name AS building_name
FROM user u
INNER JOIN department d
    ON u.department_id = d.department_id
INNER JOIN building b
    ON d.building_id = b.building_id
WHERE
    u.department_id = ?
    AND u.state = 1;
```

---

# Responsabilidades del Servicio

Este microservicio únicamente realizará operaciones de lectura.

No realizará:

- INSERT
- UPDATE
- DELETE

Toda modificación de estados, auditorías e historial será responsabilidad del sistema SmartLocker (Laravel) que consume esta API.

---

# Responsabilidades por Capa

## Route

Expone el endpoint.

```
GET /api/v1/movement/:codigo
```

---

## Controller

- Recibe la petición.
- Obtiene el parámetro `codigo`.
- Invoca al Service.
- Devuelve el JSON.

---

## Service

Coordina todo el proceso.

```
Buscar Movimiento

↓

Buscar Contactos

↓

Generar QR

↓

Enviar WhatsApp

↓

Construir Respuesta
```

---

## Repository

Únicamente contiene consultas SQL.

Funciones previstas:

```javascript
findMovementByCode(codigo)

findDepartmentContacts(departmentId)
```

No contiene lógica de negocio.

---

# Filosofía del Proyecto

El microservicio será completamente **stateless**.

No tendrá base de datos propia.

No almacenará historial.

No actualizará registros.

No ejecutará migraciones.

Su única responsabilidad será procesar la solicitud y devolver el resultado.

---

# Estado Actual del Proyecto

## Arquitectura implementada

```
Route
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
MySQL
```

## Endpoint implementado

```
GET /api/v1/movement/:codigo
```

Actualmente devuelve datos simulados.

La siguiente etapa consistirá en reemplazar el Repository por consultas reales a MySQL.

---

# Observaciones

- El `department_id` será la entidad principal de navegación.
- Aunque `movement` almacena también `building_id`, el servicio navegará principalmente a través de `department`, ya que es la relación natural del modelo de datos.
- Las consultas utilizarán siempre parámetros (`?`) para evitar vulnerabilidades de SQL Injection.
- Se evitará el uso de `SELECT *`, seleccionando únicamente las columnas necesarias.