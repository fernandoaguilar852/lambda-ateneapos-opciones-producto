# Comandos de Testing para Lambda IVA

## Pre-requisitos

1. **Build del proyecto:**
```bash
sam build
```

2. **Iniciar API local:**
```bash
sam local start-api --port 3000
```

Esto levantará el API Gateway en `http://127.0.0.1:3000`

---

## Autenticación JWT

**IMPORTANTE:** Todos los endpoints de IVA requieren autenticación JWT mediante el header `Authorization: Bearer <token>`.

### Obtener un Token JWT

Para obtener un token JWT, debes hacer login en la lambda de autenticación (lambda-ateneaall-login):

```bash
# POST /v1/auth/login (ajusta la URL según tu deployment)
curl -X POST https://tu-api-url/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ateneapos.com",
    "password": "MiPassword123"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "userId": 123,
      "clienteId": 2,
      "nombre": "Juan Pérez",
      "email": "admin@ateneapos.com",
      "roles": ["admin"]
    },
    "expiresAt": "2026-07-10T10:30:00.000Z"
  }
}
```

**Nota:** Copia el valor del campo `token` y úsalo en el header `Authorization: Bearer <token>` en todos los requests.

### Validaciones JWT

- ✅ Valida firma con JWT_SECRET de Parameter Store
- ✅ Valida que el token no esté expirado
- ✅ Cache del secret en RAM por 10 minutos (performance)
- ❌ NO valida clienteId (IVA es global para todo el sistema)

### Errores de Autenticación

**Token faltante (401):**
```json
{
  "errors": [{
    "errorCode": "E004",
    "errorDetail": "Header Authorization requerido"
  }]
}
```

**Token inválido (401):**
```json
{
  "errors": [{
    "errorCode": "E004",
    "errorDetail": "Token inválido"
  }]
}
```

**Token expirado (401):**
```json
{
  "errors": [{
    "errorCode": "E004",
    "errorDetail": "Token expirado. Por favor, inicie sesión nuevamente."
  }]
}
```

---

## Testing con CURL

**IMPORTANTE:** Todos los comandos curl deben incluir el header `Authorization: Bearer <TOKEN>`. En los ejemplos siguientes, asegúrate de agregar este header a cada request.

### 1. POST - Crear IVA

**Crear IVA General (19%):**
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT_AQUI>" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA General",
    "valor": 19.00,
    "activo": true
  }'
```

**Nota:** Reemplaza `<TU_TOKEN_JWT_AQUI>` con el token obtenido del login.

**Crear IVA Reducido (5%):**
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT_AQUI>" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA Reducido",
    "valor": 5.00,
    "activo": true
  }'
```

**Crear IVA Excluido (0%):**
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN_JWT_AQUI>" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA Excluido",
    "valor": 0.00,
    "activo": true
  }'
```

**Respuesta esperada (201 CREATED):**
```json
{
  "headers": {
    "httpStatusCode": 201,
    "httpStatusDesc": "CREATED",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success",
    "responseDetails": "Resource created successfully"
  },
  "data": {
    "ivaId": 1,
    "descripcion": "IVA General",
    "valor": 19.00,
    "activo": true
  }
}
```

---

### 2. GET - Listar todos los IVAs con paginación

**NOTA:** El listado solo retorna IVAs con `activo = true`. Los IVAs eliminados (soft delete) no aparecen.

**Sin paginación (usa valores por defecto: pageSize=10, pageNumber=1):**
```bash
curl -X GET http://127.0.0.1:3000/v1/pos/ivas \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd"
```

**Con paginación personalizada:**
```bash
curl -X GET "http://127.0.0.1:3000/v1/pos/ivas?pageSize=5&pageNumber=1" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd"
```

**Respuesta esperada (200 OK):**
```json
{
  "headers": {
    "httpStatusCode": 200,
    "httpStatusDesc": "OK",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success",
    "responseDetails": "Operation completed successfully"
  },
  "data": {
    "ivas": [
      {
        "ivaId": 1,
        "descripcion": "IVA General",
        "valor": 19.00,
        "activo": true
      },
      {
        "ivaId": 2,
        "descripcion": "IVA Reducido",
        "valor": 5.00,
        "activo": true
      }
    ]
  },
  "pagination": {
    "totalElement": 2,
    "pageSize": 10,
    "pageNumber": 1,
    "hasMoreElements": false
  }
}
```

---

### 3. GET - Consultar IVA por ID

**NOTA:** Este endpoint retorna el IVA aunque esté marcado como `activo = false` (eliminado lógicamente).

```bash
# Consultar IVA con ID 1
curl -X GET http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd"
```

**Respuesta esperada (200 OK):**
```json
{
  "headers": {
    "httpStatusCode": 200,
    "httpStatusDesc": "OK",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success",
    "responseDetails": "Operation completed successfully"
  },
  "data": {
    "ivaId": 1,
    "descripcion": "IVA General",
    "valor": 19.00,
    "activo": true
  }
}
```

**Error - IVA no encontrado (404):**
```bash
curl -X GET http://127.0.0.1:3000/v1/pos/ivas/999 \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd"
```

**Respuesta esperada (404 NOT FOUND):**
```json
{
  "headers": {
    "httpStatusCode": 404,
    "httpStatusDesc": "NOT_FOUND",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0404",
    "responseMessage": "Not Found",
    "responseDetails": "Resource not found"
  },
  "errors": [
    {
      "errorCode": "E002",
      "errorDetail": "IVA con ID 999 no encontrado"
    }
  ]
}
```

---

### 4. PUT - Actualizar IVA (completo)

```bash
# Actualizar IVA con ID 1 (todos los campos son requeridos)
curl -X PUT http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA General Actualizado",
    "valor": 21.00,
    "activo": true
  }'
```

**Respuesta esperada (200 OK):**
```json
{
  "headers": {
    "httpStatusCode": 200,
    "httpStatusDesc": "OK",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success",
    "responseDetails": "Operation completed successfully"
  },
  "data": {
    "ivaId": 1,
    "descripcion": "IVA General Actualizado",
    "valor": 21.00,
    "activo": true
  }
}
```

---

### 5. PATCH - Actualizar IVA (parcial)

**Actualizar solo la descripción:**
```bash
curl -X PATCH http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA General (Colombia)"
  }'
```

**Actualizar solo el valor:**
```bash
curl -X PATCH http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "valor": 16.00
  }'
```

**Actualizar solo el estado activo:**
```bash
curl -X PATCH http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "activo": false
  }'
```

**Actualizar múltiples campos:**
```bash
curl -X PATCH http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA Estándar",
    "valor": 19.00
  }'
```

**Respuesta esperada (200 OK):**
```json
{
  "headers": {
    "httpStatusCode": 200,
    "httpStatusDesc": "OK",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success",
    "responseDetails": "Operation completed successfully"
  },
  "data": {
    "ivaId": 1,
    "descripcion": "IVA Estándar",
    "valor": 19.00,
    "activo": true
  }
}
```

---

### 6. DELETE - Eliminar IVA (Soft Delete)

**NOTA:** El DELETE es lógico, no físico. El IVA se marca como `activo = false` pero permanece en la base de datos.

```bash
# Eliminar IVA con ID 1 (soft delete - marca como inactivo)
curl -X DELETE http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd"
```

**Respuesta esperada (200 OK) - Retorna el IVA marcado como inactivo:**
```json
{
  "headers": {
    "httpStatusCode": 200,
    "httpStatusDesc": "OK",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success",
    "responseDetails": "Resource deleted successfully"
  },
  "data": {
    "ivaId": 1,
    "descripcion": "IVA General",
    "valor": 19.00,
    "activo": false
  }
}
```

---

## Testing de Validaciones (Errores)

### Error 400 - Descripción vacía
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "",
    "valor": 19.00
  }'
```

**Respuesta esperada (400 BAD REQUEST):**
```json
{
  "errors": [
    {
      "errorCode": "E001",
      "errorDetail": "El campo descripcion es requerido"
    }
  ]
}
```

### Error 400 - Valor fuera de rango (< 0)
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA Prueba",
    "valor": -5
  }'
```

**Respuesta esperada (400 BAD REQUEST):**
```json
{
  "errors": [
    {
      "errorCode": "E001",
      "errorDetail": "El valor debe estar entre 0 y 100"
    }
  ]
}
```

### Error 400 - Valor fuera de rango (> 100)
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA Prueba",
    "valor": 150
  }'
```

**Respuesta esperada (400 BAD REQUEST):**
```json
{
  "errors": [
    {
      "errorCode": "E001",
      "errorDetail": "El valor debe estar entre 0 y 100"
    }
  ]
}
```

### Error 400 - Campo requerido faltante
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA Prueba"
  }'
```

**Respuesta esperada:**
```json
{
  "errors": [
    {
      "errorCode": "E001",
      "errorDetail": "El campo valor es requerido"
    }
  ]
}
```

### Error 409 - Descripción duplicada
```bash
# Primero crear un IVA
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA General",
    "valor": 19.00
  }'

# Intentar crear otro con la misma descripción
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{
    "descripcion": "IVA General",
    "valor": 21.00
  }'
```

**Respuesta esperada (409 CONFLICT):**
```json
{
  "headers": {
    "httpStatusCode": 409,
    "httpStatusDesc": "CONFLICT",
    "messageUuid": "c4e6bd04-5149-11e7-b114-a2f933d5fe66",
    "requestDatetime": "2026-01-07T...",
    "requestAppId": "acxff62e-6f12-42de-9012-1e7304418abd"
  },
  "messageResponse": {
    "responseCode": "0409",
    "responseMessage": "Conflict",
    "responseDetails": "Resource already exists or violates unique constraint"
  },
  "errors": [
    {
      "errorCode": "E003",
      "errorDetail": "Ya existe un IVA con la descripción: IVA General"
    }
  ]
}
```

### Error 400 - Headers faltantes
```bash
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "IVA Prueba",
    "valor": 19.00
  }'
```

**Respuesta esperada (400 BAD REQUEST):**
```json
{
  "errors": [
    {
      "errorCode": "E000",
      "errorDetail": "Headers requeridos: message-uuid y request-app-id"
    }
  ]
}
```

### Error 400 - PATCH sin campos
```bash
curl -X PATCH http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: c4e6bd04-5149-11e7-b114-a2f933d5fe66" \
  -H "request-app-id: acxff62e-6f12-42de-9012-1e7304418abd" \
  -d '{}'
```

**Respuesta esperada:**
```json
{
  "errors": [
    {
      "errorCode": "E001",
      "errorDetail": "Debe proporcionar al menos un campo para actualizar"
    }
  ]
}
```

---

## Secuencia Completa de Testing

Ejecuta estos comandos en orden para probar todo el flujo CRUD:

```bash
# 1. Crear 3 IVAs
curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-uuid-001" \
  -H "request-app-id: test-app-001" \
  -d '{"descripcion": "IVA General", "valor": 19.00, "activo": true}'

curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-uuid-002" \
  -H "request-app-id: test-app-001" \
  -d '{"descripcion": "IVA Reducido", "valor": 5.00, "activo": true}'

curl -X POST http://127.0.0.1:3000/v1/pos/ivas \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-uuid-003" \
  -H "request-app-id: test-app-001" \
  -d '{"descripcion": "IVA Excluido", "valor": 0.00, "activo": false}'

# 2. Listar todos
curl -X GET http://127.0.0.1:3000/v1/pos/ivas \
  -H "message-uuid: test-uuid-004" \
  -H "request-app-id: test-app-001"

# 3. Consultar uno específico (ID 1)
curl -X GET http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "message-uuid: test-uuid-005" \
  -H "request-app-id: test-app-001"

# 4. Actualizar completo (PUT - ID 1)
curl -X PUT http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-uuid-006" \
  -H "request-app-id: test-app-001" \
  -d '{"descripcion": "IVA General Actualizado", "valor": 21.00, "activo": true}'

# 5. Actualizar parcial (PATCH - ID 1, solo descripción)
curl -X PATCH http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-uuid-007" \
  -H "request-app-id: test-app-001" \
  -d '{"descripcion": "IVA Estándar Colombia"}'

# 6. Verificar actualización parcial
curl -X GET http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "message-uuid: test-uuid-008" \
  -H "request-app-id: test-app-001"

# 7. Eliminar (ID 1) - Soft delete
curl -X DELETE http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "message-uuid: test-uuid-009" \
  -H "request-app-id: test-app-001"

# 8. Verificar eliminación por ID (debe retornar el IVA con activo = false)
curl -X GET http://127.0.0.1:3000/v1/pos/ivas/1 \
  -H "message-uuid: test-uuid-010" \
  -H "request-app-id: test-app-001"

# 9. Verificar que NO aparece en el listado
curl -X GET http://127.0.0.1:3000/v1/pos/ivas \
  -H "message-uuid: test-uuid-011" \
  -H "request-app-id: test-app-001"
```

---

## Notas Importantes

1. **Headers requeridos:** Todos los endpoints de IVA requieren:
   - `Authorization: Bearer <token>`: Token JWT obtenido del login
   - `message-uuid`: UUID de trazabilidad
   - `request-app-id`: UUID de la aplicación

2. **Autenticación JWT:**
   - Todos los endpoints requieren un token JWT válido
   - El token se obtiene haciendo login en la lambda de autenticación
   - El token tiene una duración de 24 horas (configurable)
   - Si el token expira, recibirás un error 401 y deberás hacer login nuevamente

3. **Content-Type:** Para POST, PUT y PATCH, siempre incluir:
   - `Content-Type: application/json`

4. **Formato de respuesta:** Todas las respuestas siguen el formato Swagger definido en el contrato

5. **Diferencia entre PUT y PATCH:**
   - **PUT**: Actualización completa - requiere todos los campos
   - **PATCH**: Actualización parcial - solo los campos que quieras cambiar

6. **Validaciones del valor:**
   - Debe ser un número entre 0 y 100
   - Acepta decimales (ej: 19.50, 5.25, 0.00)

7. **Descripción única:**
   - No se pueden crear dos IVAs con la misma descripción
   - Esta validación también aplica en actualizaciones

8. **Eliminación lógica (Soft Delete):**
   - El DELETE no borra físicamente el registro de la base de datos
   - Marca el campo `activo = false` en el IVA
   - El IVA eliminado sigue siendo consultable con GET por ID
   - **NO aparecerá en el listado** (el listado solo muestra IVAs con `activo = true`)
