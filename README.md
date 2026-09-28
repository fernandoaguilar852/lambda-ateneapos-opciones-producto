# Lambda AteneaPOS - Opciones de Producto

Lambda function para la gestión completa de opciones de producto en el sistema POS Atenea. Permite administrar grupos de opciones, opciones individuales, recetas de opciones y modificadores predefinidos.

## 📋 Descripción

Esta Lambda proporciona una API REST completa para gestionar la configuración de opciones de productos en el sistema POS:

- **Grupos de Opciones**: Agrupaciones de opciones para productos (ej: "Tamaño", "Temperatura")
- **Opciones**: Opciones individuales dentro de grupos (ej: "Grande", "Mediano", "Pequeño")
- **Recetas de Opciones**: Insumos necesarios para cada opción
- **Modificadores Predefinidos**: Modificaciones estándar aplicables a productos (ej: "Sin cebolla", "Extra queso")
- **Configuración Completa**: Endpoint que retorna toda la configuración de un producto en una sola llamada

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Lambda Handler                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AuthMiddleware (JWT)                    │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Controllers                         │   │
│  │  • GrupoOpcionController                             │   │
│  │  • OpcionController                                  │   │
│  │  • OpcionRecetaController                            │   │
│  │  • ModificadorController                             │   │
│  │  • ProductoConfiguracionController                   │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Business Logic                         │   │
│  │  • GrupoOpcionBL                                     │   │
│  │  • OpcionBL                                          │   │
│  │  • OpcionRecetaBL                                    │   │
│  │  • ModificadorBL                                     │   │
│  │  • ProductoConfiguracionBL                           │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Repositories                         │   │
│  │  • GrupoOpcionRepository                             │   │
│  │  • OpcionRepository                                  │   │
│  │  • OpcionRecetaRepository                            │   │
│  │  • ModificadorRepository                             │   │
│  │  • ProductoConfiguracionRepository                   │   │
│  └──────────────────┬───────────────────────────────────┘   │
└────────────────────┼────────────────────────────────────────┘
                     ▼
        ┌────────────────────────┐
        │  PostgreSQL (RDS)      │
        │  Database: ateneapos   │
        └────────────────────────┘
```

## 🚀 Endpoints (21 total)

### Base URL
```
https://{api-id}.execute-api.{region}.amazonaws.com/Prod
```

### Autenticación
Todos los endpoints requieren:
- **Header `Authorization`**: `Bearer {JWT_TOKEN}`
- **Header `message-uuid`**: UUID único para la petición
- **Header `request-app-id`**: ID de la aplicación que hace la petición

---

## 📚 Módulo 1: Grupos de Opciones

### 1. Crear Grupo de Opciones
```bash
curl -X POST https://your-api-url/v1/pos/productos/123/grupos-opciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440000" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": 123,
    "nombre": "Tamaño",
    "descripcion": "Seleccione el tamaño de su bebida",
    "obligatorio": true,
    "multipleSeleccion": false,
    "minSelecciones": 1,
    "maxSelecciones": 1,
    "orden": 1
  }'
```

### 2. Obtener Grupo por ID
```bash
curl -X GET https://your-api-url/v1/pos/grupos-opciones/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440001" \
  -H "request-app-id: pos-admin-app"
```

### 3. Listar Grupos por Producto
```bash
curl -X GET https://your-api-url/v1/pos/productos/123/grupos-opciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440002" \
  -H "request-app-id: pos-admin-app"
```

### 4. Actualizar Grupo de Opciones
```bash
curl -X PUT https://your-api-url/v1/pos/grupos-opciones/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440003" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tamaño de Bebida",
    "descripcion": "Elija el tamaño",
    "obligatorio": false,
    "multipleSeleccion": false,
    "minSelecciones": 0,
    "maxSelecciones": 1,
    "orden": 2
  }'
```

### 5. Eliminar Grupo de Opciones
```bash
curl -X DELETE https://your-api-url/v1/pos/grupos-opciones/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440004" \
  -H "request-app-id: pos-admin-app"
```

---

## 📚 Módulo 2: Opciones

### 6. Crear Opción
```bash
curl -X POST https://your-api-url/v1/pos/grupos-opciones/1/opciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440005" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "grupoOpcionId": 1,
    "nombre": "Grande",
    "descripcion": "16 oz",
    "precioAdicional": 5.00,
    "disponible": true,
    "orden": 1
  }'
```

### 7. Obtener Opción por ID
```bash
curl -X GET https://your-api-url/v1/pos/opciones/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440006" \
  -H "request-app-id: pos-admin-app"
```

### 8. Listar Opciones por Grupo
```bash
curl -X GET https://your-api-url/v1/pos/grupos-opciones/1/opciones \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440007" \
  -H "request-app-id: pos-admin-app"
```

### 9. Actualizar Opción
```bash
curl -X PUT https://your-api-url/v1/pos/opciones/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440008" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Extra Grande",
    "descripcion": "20 oz",
    "precioAdicional": 8.00,
    "disponible": true,
    "orden": 2
  }'
```

### 10. Eliminar Opción
```bash
curl -X DELETE https://your-api-url/v1/pos/opciones/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440009" \
  -H "request-app-id: pos-admin-app"
```

---

## 📚 Módulo 3: Recetas de Opciones

### 11. Agregar Insumo a Receta
```bash
curl -X POST https://your-api-url/v1/pos/opciones/1/receta \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440010" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "opcionId": 1,
    "insumoId": 321,
    "cantidadBase": 150.5,
    "mermaPct": 5
  }'
```

**Nota:** `mermaPct` es el porcentaje de merma/desperdicio (0-100). Por ejemplo, 5 = 5% de merma.

### 12. Obtener Receta Completa
```bash
curl -X GET https://your-api-url/v1/pos/opciones/1/receta \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440011" \
  -H "request-app-id: pos-admin-app"
```

### 13. Actualizar Insumo en Receta
```bash
curl -X PUT https://your-api-url/v1/pos/opciones/1/receta/321 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440012" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "cantidadBase": 200.0,
    "mermaPct": 10
  }'
```

### 14. Eliminar Insumo de Receta
```bash
curl -X DELETE https://your-api-url/v1/pos/opciones/1/receta/321 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440013" \
  -H "request-app-id: pos-admin-app"
```

---

## 📚 Módulo 4: Modificadores Predefinidos

### 15. Crear Modificador
```bash
# Modificador Global (aplicable a cualquier producto)
curl -X POST https://your-api-url/v1/pos/modificadores \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440014" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": null,
    "tipo": "SIN",
    "nombre": "Sin cebolla",
    "descripcion": "Preparar sin cebolla",
    "precioAdicional": 0.00,
    "orden": 1
  }'

# Modificador Específico de Producto
curl -X POST https://your-api-url/v1/pos/modificadores \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440015" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": 123,
    "tipo": "EXTRA",
    "nombre": "Extra queso",
    "descripcion": "Doble porción de queso",
    "precioAdicional": 10.00,
    "orden": 1
  }'
```

### 16. Obtener Modificador por ID
```bash
curl -X GET https://your-api-url/v1/pos/modificadores/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440016" \
  -H "request-app-id: pos-admin-app"
```

### 17. Listar Modificadores por Producto
```bash
curl -X GET https://your-api-url/v1/pos/productos/123/modificadores \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440017" \
  -H "request-app-id: pos-admin-app"
```

### 18. Listar Modificadores Globales
```bash
curl -X GET https://your-api-url/v1/pos/modificadores/globales \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440018" \
  -H "request-app-id: pos-admin-app"
```

### 19. Actualizar Modificador
```bash
curl -X PUT https://your-api-url/v1/pos/modificadores/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440019" \
  -H "request-app-id: pos-admin-app" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "MODIFICACION",
    "nombre": "Sin sal",
    "descripcion": "Preparar sin sal",
    "precioAdicional": 0.00,
    "orden": 2
  }'
```

### 20. Eliminar Modificador
```bash
curl -X DELETE https://your-api-url/v1/pos/modificadores/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440020" \
  -H "request-app-id: pos-admin-app"
```

---

## 📚 Módulo 5: Configuración Completa ⭐

### 21. Obtener Configuración Completa del Producto
```bash
# Retorna: datos del producto + grupos + opciones + recetas + modificadores
curl -X GET https://your-api-url/v1/pos/productos/123/configuracion-completa \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "message-uuid: 550e8400-e29b-41d4-a716-446655440021" \
  -H "request-app-id: pos-admin-app"
```

**Respuesta de ejemplo:**
```json
{
  "headers": {
    "httpStatusCode": 200,
    "httpStatusDesc": "OK",
    "messageUuid": "550e8400-e29b-41d4-a716-446655440021",
    "requestDatetime": "2026-09-27T23:31:24.605Z",
    "requestAppId": "pos-admin-app"
  },
  "messageResponse": {
    "responseCode": "0000",
    "responseMessage": "Success"
  },
  "data": {
    "productoId": 123,
    "clienteId": 5,
    "tipoProductoId": 1,
    "nombre": "Hamburguesa Clásica",
    "codExterno": "HAM-001",
    "codBarras": "7501234567890",
    "imagen": "https://...",
    "precio": 45.00,
    "unidadMedida": "UNIDAD",
    "sigla": "Un",
    "stockTotal": 100,
    "stockReservado": 5,
    "stockMinimo": 10,
    "manejaStock": true,
    "usaReceta": true,
    "activo": true,
    "ivaId": 2,
    "gruposOpciones": [
      {
        "grupoOpcionId": 1,
        "productoId": 123,
        "nombre": "Tamaño",
        "descripcion": null,
        "obligatorio": true,
        "multipleSeleccion": false,
        "minSelecciones": 1,
        "maxSelecciones": 1,
        "orden": 1,
        "activo": true,
        "createdAt": "2026-01-01T00:00:00Z",
        "opciones": [
          {
            "opcionId": 1,
            "grupoOpcionId": 1,
            "nombre": "Grande",
            "descripcion": null,
            "precioAdicional": 5.00,
            "disponible": true,
            "orden": 1,
            "activo": true,
            "createdAt": "2026-01-01T00:00:00Z",
            "receta": [
              {
                "opcionId": 1,
                "insumoId": 10,
                "insumoNombre": "Pan grande",
                "cantidadBase": 150.0,
                "mermaPct": 5,
                "activo": true
              }
            ]
          }
        ]
      }
    ],
    "modificadores": [
      {
        "modificadorId": 1,
        "productoId": 123,
        "tipo": "SIN",
        "nombre": "Sin cebolla",
        "descripcion": "Preparar sin cebolla",
        "precioAdicional": 0.00,
        "orden": 1,
        "esGlobal": false
      },
      {
        "modificadorId": 2,
        "productoId": null,
        "tipo": "EXTRA",
        "nombre": "Extra queso",
        "descripcion": "Doble porción de queso",
        "precioAdicional": 10.00,
        "orden": 1,
        "esGlobal": true
      }
    ]
  }
}
```

---

## 🔧 Variables de Entorno

```bash
PG_HOST=db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com
PG_USER=postgres
PG_PASSWORD=your-password
PG_DATABASE=ateneapos
PG_PORT=5432
NODE_ENVIRONMENT=DEV
JWT_SECRET_PARAMETER_NAME=/ateneaall/jwt-secret
```

---

## 📦 Instalación y Deployment

### Requisitos
- AWS CLI configurado
- AWS SAM CLI instalado
- Node.js 20.x
- PostgreSQL 13+

### Build
```bash
npm install
sam build
```

### Deploy
```bash
sam deploy --guided
```

### Deploy directo (después de la primera vez)
```bash
sam build && sam deploy
```

### Testing local
```bash
sam local start-api --port 3000
```

---

## 📁 Estructura del Proyecto

```
lambda-ateneapos-opciones-producto/
├── src/
│   ├── app.ts                          # Lambda handler principal
│   ├── auth/
│   │   └── AuthMiddleware.ts           # Validación JWT
│   ├── controller/                     # Capa de controladores
│   │   ├── GrupoOpcionController.ts
│   │   ├── OpcionController.ts
│   │   ├── OpcionRecetaController.ts
│   │   ├── ModificadorController.ts
│   │   └── ProductoConfiguracionController.ts
│   ├── domain/                         # Lógica de negocio
│   │   ├── GrupoOpcionBL.ts
│   │   ├── OpcionBL.ts
│   │   ├── OpcionRecetaBL.ts
│   │   ├── ModificadorBL.ts
│   │   ├── ProductoConfiguracionBL.ts
│   │   ├── mappers/                    # Transformadores DTO ↔ Domain
│   │   ├── models/                     # Modelos de dominio
│   │   └── exceptions/                 # Excepciones personalizadas
│   ├── repositories/                   # Capa de datos
│   │   ├── GrupoOpcionRepository.ts
│   │   ├── OpcionRepository.ts
│   │   ├── OpcionRecetaRepository.ts
│   │   ├── ModificadorRepository.ts
│   │   ├── ProductoConfiguracionRepository.ts
│   │   └── dtos/                       # Data Transfer Objects
│   └── core/
│       ├── common/                     # Utilidades comunes
│       │   └── SwaggerResponseBuilder.ts
│       ├── config/                     # Configuración
│       │   ├── index.ts
│       │   └── ParameterStore.ts
│       └── utils/                      # Utilidades
│           ├── Constans.ts             # Queries SQL y constantes
│           ├── DatabaseManager.ts      # Pool de PostgreSQL
│           └── PostgresErrorHandler.ts # Manejo de errores PG
├── template.yaml                       # SAM template
├── package.json
└── README.md
```

---

## 🔐 Autenticación

La Lambda valida tokens JWT almacenados en AWS Systems Manager Parameter Store.

**Estructura del JWT:**
```json
{
  "clienteId": 5,
  "userId": 123,
  "userName": "admin@atenea.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

**Obtener token:**
- El token JWT debe ser obtenido del servicio de autenticación de AteneaPOS
- El token se incluye en el header `Authorization: Bearer {token}`

---

## 📊 Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - Token inválido o expirado |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: registro duplicado) |
| 500 | Internal Server Error - Error del servidor |
| 503 | Service Unavailable - Base de datos no disponible |

---

## 🗄️ Base de Datos

### Tablas principales:
- `producto` - Productos del catálogo
- `producto_grupo_opcion` - Grupos de opciones por producto
- `producto_opcion` - Opciones dentro de grupos
- `producto_opcion_receta` - Insumos de cada opción
- `producto_modificador_predefinido` - Modificadores (globales y específicos)
- `insumo` - Catálogo de insumos

### Relaciones:
```
producto (1) ──────> (N) producto_grupo_opcion
                            │
                            └──> (N) producto_opcion
                                      │
                                      └──> (N) producto_opcion_receta ──> (1) insumo

producto (1) ──────> (N) producto_modificador_predefinido
producto (NULL) ───> (N) producto_modificador_predefinido (globales)
```

---

## 🧪 Ejemplos de Pruebas

### Flujo completo: Configurar un producto con opciones

```bash
# 1. Crear grupo de opciones "Tamaño"
curl -X POST https://your-api-url/v1/pos/productos/123/grupos-opciones \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "message-uuid: $(uuidgen)" \
  -H "request-app-id: pos-test" \
  -H "Content-Type: application/json" \
  -d '{"productoId":123,"nombre":"Tamaño","obligatorio":true,"minSelecciones":1,"maxSelecciones":1,"orden":1}'

# 2. Crear opción "Grande" dentro del grupo
curl -X POST https://your-api-url/v1/pos/grupos-opciones/1/opciones \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "message-uuid: $(uuidgen)" \
  -H "request-app-id: pos-test" \
  -H "Content-Type: application/json" \
  -d '{"grupoOpcionId":1,"nombre":"Grande","precioAdicional":5.00,"orden":1}'

# 3. Agregar insumo a la receta de la opción
curl -X POST https://your-api-url/v1/pos/opciones/1/receta \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "message-uuid: $(uuidgen)" \
  -H "request-app-id: pos-test" \
  -H "Content-Type: application/json" \
  -d '{"opcionId":1,"insumoId":321,"cantidadBase":150.0,"mermaPct":5}'

# 4. Crear modificador global
curl -X POST https://your-api-url/v1/pos/modificadores \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "message-uuid: $(uuidgen)" \
  -H "request-app-id: pos-test" \
  -H "Content-Type: application/json" \
  -d '{"productoId":null,"tipo":"SIN","nombre":"Sin cebolla","precioAdicional":0,"orden":1}'

# 5. Obtener configuración completa
curl -X GET https://your-api-url/v1/pos/productos/123/configuracion-completa \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "message-uuid: $(uuidgen)" \
  -H "request-app-id: pos-test"
```

---

## 📝 Notas Importantes

1. **Soft Delete**: Todos los endpoints DELETE hacen soft delete (activo = false)
2. **Multi-tenant**: Todas las operaciones filtran por `clienteId` del JWT
3. **Modificadores Globales**: `productoId = NULL` indica que aplica a todos los productos
4. **Modificadores Específicos**: `productoId = {id}` indica que solo aplica a ese producto
5. **Endpoint de Configuración Completa**: Optimizado para cargar toda la configuración en una sola llamada

---

## 🤝 Contribución

Este proyecto sigue las convenciones de código de AteneaPOS:
- Arquitectura en capas (Controller → BL → Repository)
- Interfaces en cada capa
- DTOs en snake_case (base de datos)
- Domain models en camelCase (lógica de negocio)
- Manejo centralizado de excepciones

---

## 📄 Licencia

Propiedad de AteneaPOS © 2026

---

## 👥 Contacto

Para soporte técnico, contactar al equipo de desarrollo de AteneaPOS.
