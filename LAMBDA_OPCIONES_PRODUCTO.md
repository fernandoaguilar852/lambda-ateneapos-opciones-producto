# Lambda de Administración - Opciones de Producto

**Nombre Oficial:** `lambda-ateneapos-opciones-producto`
**Fecha:** 2024
**Versión:** 1.0

---

## 📋 Información General

| Propiedad | Valor |
|-----------|-------|
| **Nombre Lambda** | `lambda-ateneapos-opciones-producto` |
| **Propósito** | Administración de opciones, grupos y modificadores de productos |
| **Usuario** | Administrador |
| **Base Path** | `/v1/pos/admin` |
| **Runtime** | Node.js 20.x |
| **Endpoints** | 20 endpoints CRUD |

---

## 🏗️ Separación de Responsabilidades

```
┌────────────────────────────────────────────────────────────────────┐
│                         LAMBDAS DEL SISTEMA                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  lambda-ateneapos-opciones-producto (NUEVA)                 │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │  Rol: Administración                                        │  │
│  │  Usuario: Admin                                             │  │
│  │  Función: CRUD de configuración                             │  │
│  │                                                             │  │
│  │  • Crear/Editar grupos de opciones                         │  │
│  │  • Crear/Editar opciones                                   │  │
│  │  • Definir recetas de opciones                             │  │
│  │  • Crear/Editar modificadores predefinidos                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  lambda-ateneapos-orden-detalle (EXISTENTE)                 │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │  Rol: Operación                                             │  │
│  │  Usuario: Mesero/Cajero                                     │  │
│  │  Función: Gestión de pedidos                                │  │
│  │                                                             │  │
│  │  • Crear órdenes (CON opciones ya configuradas)            │  │
│  │  • Validar stock (productos Y opciones)                    │  │
│  │  • Actualizar órdenes                                      │  │
│  │  • Eliminar órdenes                                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 20 Endpoints de Administración

### 1. Grupos de Opciones (5 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| **POST** | `/v1/pos/admin/productos/{productoId}/grupos-opciones` | Crear grupo |
| **GET** | `/v1/pos/admin/productos/{productoId}/grupos-opciones` | Listar grupos |
| **GET** | `/v1/pos/admin/grupos-opciones/{grupoId}` | Obtener grupo |
| **PUT** | `/v1/pos/admin/grupos-opciones/{grupoId}` | Actualizar grupo |
| **DELETE** | `/v1/pos/admin/grupos-opciones/{grupoId}` | Eliminar grupo |

**Ejemplo - Crear Grupo:**
```json
POST /v1/pos/admin/productos/45/grupos-opciones
{
  "nombre": "Tipo de Papa",
  "obligatorio": true,
  "minimoSelecciones": 1,
  "maximoSelecciones": 1,
  "incluidosEnPrecio": 1,
  "cobrarAdicionales": true,
  "orden": 1
}
```

---

### 2. Opciones (5 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| **POST** | `/v1/pos/admin/grupos-opciones/{grupoId}/opciones` | Crear opción |
| **GET** | `/v1/pos/admin/grupos-opciones/{grupoId}/opciones` | Listar opciones |
| **GET** | `/v1/pos/admin/opciones/{opcionId}` | Obtener opción |
| **PUT** | `/v1/pos/admin/opciones/{opcionId}` | Actualizar opción |
| **DELETE** | `/v1/pos/admin/opciones/{opcionId}` | Eliminar opción |

**Ejemplo - Crear Opción:**
```json
POST /v1/pos/admin/grupos-opciones/1/opciones
{
  "nombre": "Papa Criolla",
  "precioAdicional": 500,
  "porDefecto": false,
  "orden": 2
}
```

---

### 3. Recetas de Opciones (4 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| **POST** | `/v1/pos/admin/opciones/{opcionId}/receta` | Agregar insumo |
| **GET** | `/v1/pos/admin/opciones/{opcionId}/receta` | Obtener receta |
| **PUT** | `/v1/pos/admin/opciones/{opcionId}/receta/{insumoId}` | Actualizar insumo |
| **DELETE** | `/v1/pos/admin/opciones/{opcionId}/receta/{insumoId}` | Eliminar insumo |

**Ejemplo - Agregar Insumo a Receta:**
```json
POST /v1/pos/admin/opciones/102/receta
{
  "insumoId": 202,
  "cantidadBase": 150,
  "mermaPct": 5
}
```

---

### 4. Modificadores Predefinidos (5 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| **POST** | `/v1/pos/admin/modificadores` | Crear modificador |
| **GET** | `/v1/pos/admin/productos/{productoId}/modificadores` | Listar por producto |
| **GET** | `/v1/pos/admin/modificadores/globales` | Listar globales |
| **PUT** | `/v1/pos/admin/modificadores/{modificadorId}` | Actualizar |
| **DELETE** | `/v1/pos/admin/modificadores/{modificadorId}` | Eliminar |

**Ejemplo - Modificador Global:**
```json
POST /v1/pos/admin/modificadores
{
  "productoId": null,
  "tipo": "SIN",
  "nombre": "cebolla",
  "descripcion": "Sin cebolla",
  "precioAdicional": 0,
  "orden": 1
}
```

**Ejemplo - Modificador Específico:**
```json
POST /v1/pos/admin/modificadores
{
  "productoId": 45,
  "tipo": "EXTRA",
  "nombre": "queso",
  "descripcion": "Extra queso",
  "precioAdicional": 2000,
  "orden": 2
}
```

---

### 5. Configuración Completa (1 endpoint)

| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/v1/pos/admin/productos/{productoId}/configuracion-completa` | Obtener todo |

**Ejemplo Response:**
```json
{
  "productoId": 45,
  "nombre": "Hamburguesa Especial",
  "precio": 15000,
  "gruposOpciones": [
    {
      "grupoOpcionId": 1,
      "nombre": "Tipo de Papa",
      "obligatorio": true,
      "incluidosEnPrecio": 1,
      "opciones": [
        {
          "opcionId": 102,
          "nombre": "Papa Criolla",
          "precioAdicional": 500,
          "receta": [
            {
              "insumoId": 202,
              "insumoNombre": "Papa Criolla Fresca",
              "cantidadBase": 150,
              "mermaPct": 5
            }
          ]
        }
      ]
    }
  ],
  "modificadoresPredefinidos": [
    {
      "modificadorId": 1,
      "tipo": "SIN",
      "descripcion": "Sin cebolla",
      "precioAdicional": 0
    }
  ]
}
```

---

## 📁 Estructura de Archivos

```
lambda-ateneapos-opciones-producto/
│
├── src/
│   ├── app.ts                          # Lambda handler
│   │
│   ├── controllers/
│   │   ├── GrupoOpcionController.ts
│   │   ├── OpcionController.ts
│   │   ├── OpcionRecetaController.ts
│   │   └── ModificadorController.ts
│   │
│   ├── domain/
│   │   ├── GrupoOpcionBL.ts
│   │   ├── OpcionBL.ts
│   │   ├── OpcionRecetaBL.ts
│   │   └── ModificadorBL.ts
│   │
│   ├── repositories/
│   │   ├── GrupoOpcionRepository.ts
│   │   ├── OpcionRepository.ts
│   │   ├── OpcionRecetaRepository.ts
│   │   ├── ModificadorRepository.ts
│   │   │
│   │   └── dtos/
│   │       ├── GrupoOpcionDTO.ts
│   │       ├── OpcionDTO.ts
│   │       ├── OpcionRecetaDTO.ts
│   │       └── ModificadorDTO.ts
│   │
│   ├── core/
│   │   ├── database/
│   │   │   └── PostgresClient.ts
│   │   ├── utils/
│   │   │   └── Constans.ts
│   │   └── common/
│   │       └── SwaggerResponseBuilder.ts
│   │
│   └── auth/
│       └── AuthMiddleware.ts           # JWT + Validación rol ADMIN
│
├── template.yaml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Seguridad

### Validación de Rol Administrativo

**CRÍTICO:** Esta lambda SOLO permite acceso a usuarios con rol `admin`

```typescript
// src/auth/AuthMiddleware.ts
export async function authenticateAdmin(
  event: APIGatewayProxyEvent,
  clienteId: number
): Promise<AuthResult> {

  // 1. Validar JWT
  const authResult = await authenticateRequest(event, clienteId);

  if (!authResult.authorized) {
    return authResult;
  }

  // 2. Validar rol ADMIN
  const userPayload = authResult.payload!;

  if (!userPayload.roles.includes('admin')) {
    return {
      authorized: false,
      statusCode: 403,
      message: 'Solo administradores pueden acceder a esta funcionalidad'
    };
  }

  return authResult;
}
```

---

## 🔄 Flujo Completo de Trabajo

### Paso 1: Admin Configura (Lambda Nueva)

```
1. Admin crea grupo de opciones
   POST /v1/pos/admin/productos/45/grupos-opciones
   → Crea "Tipo de Papa"

2. Admin crea opciones
   POST /v1/pos/admin/grupos-opciones/1/opciones
   → Crea "Papa Francesa", "Papa Criolla", "Papa Cascos"

3. Admin define recetas
   POST /v1/pos/admin/opciones/102/receta
   → Papa Criolla consume 150g de Papa Fresca

4. Admin crea modificadores
   POST /v1/pos/admin/modificadores
   → Crea "Sin cebolla", "Extra queso"
```

### Paso 2: Mesero Usa Configuración (Lambda Existente)

```
1. Frontend consulta configuración
   GET /v1/pos/admin/productos/45/configuracion-completa
   → Obtiene todas las opciones y modificadores disponibles

2. Mesero selecciona en el POS
   - Producto: Hamburguesa
   - Opción: Papa Criolla
   - Modificador: Sin cebolla

3. Mesero crea orden
   POST /v1/pos/ordenes-detalle
   {
     "productoId": 45,
     "opciones": [{ "opcionId": 102 }],
     "modificadores": [{ "modificadorId": 1 }]
   }
```

---

## 📊 Tablas de Base de Datos

**Tablas de Configuración (escribe esta lambda):**
- ✅ `producto_grupo_opcion`
- ✅ `producto_opcion`
- ✅ `producto_opcion_receta`
- ✅ `producto_modificador_predefinido`

**Tablas de Operación (escribe lambda-orden-detalle):**
- ✅ `orden_detalle_opcion`
- ✅ `orden_detalle_modificador`

---

## ⚙️ template.yaml

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Lambda para administración de opciones de productos

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs20.x
    Architectures:
      - arm64

Resources:
  OpcionesProductoFunction:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: lambda-ateneapos-opciones-producto
      CodeUri: src/
      Handler: app.lambdaHandler
      Events:
        CreateGrupo:
          Type: Api
          Properties:
            Path: /v1/pos/admin/productos/{productoId}/grupos-opciones
            Method: POST
        # ... resto de endpoints

      Metadata:
        BuildMethod: esbuild
        BuildProperties:
          Minify: true
          Target: es2020
          EntryPoints:
            - app.ts
```

---

## 💡 Ventajas de esta Separación

| Ventaja | Descripción |
|---------|-------------|
| **Responsabilidad Única** | Cada lambda hace UNA cosa |
| **Seguridad** | Admin endpoints separados con rol validation |
| **Escalabilidad** | Lambda de pedidos escala independiente |
| **Deploy Independiente** | Cambios en config no afectan pedidos |
| **Testing** | Cada lambda se prueba por separado |
| **Costos** | Lambda admin se usa poco → menos costos |

---

## ✅ Resumen

**Nombre Lambda:** `lambda-ateneapos-opciones-producto`

**Responsabilidades:**
- ✅ CRUD de grupos de opciones
- ✅ CRUD de opciones
- ✅ CRUD de recetas de opciones
- ✅ CRUD de modificadores predefinidos
- ✅ Endpoint de configuración completa

**NO hace:**
- ❌ Crear órdenes
- ❌ Validar stock
- ❌ Gestionar inventario
- ❌ Procesar pedidos

**Usuario:** Solo ADMIN

**Estado:** Por implementar (después de deployment de lambda-orden-detalle)

---

**Documento creado por:** Claude Sonnet 4.5
**Fecha:** 2024
**Lambda asociada:** lambda-ateneapos-orden-detalle (consume la configuración)
