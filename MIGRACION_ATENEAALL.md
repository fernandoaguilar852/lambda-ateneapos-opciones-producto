# 📋 GUÍA DE MIGRACIÓN: Cambio de Nombres y Credenciales de Base de Datos

**Proyecto:** Lambda País - Sistema POS Atenea
**Fecha:** 2026-04-20
**Autor:** Equipo Atenea
**Versión:** 1.0

---

## 📖 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Contexto del Cambio](#contexto-del-cambio)
3. [Ajustes Realizados por Archivo](#ajustes-realizados-por-archivo)
4. [Validación de No Conflicto](#validación-de-no-conflicto)
5. [Proceso de Despliegue](#proceso-de-despliegue)
6. [Verificación Post-Despliegue](#verificación-post-despliegue)
7. [Rollback en Caso de Problemas](#rollback-en-caso-de-problemas)
8. [Checklist de Migración](#checklist-de-migración)

---

## 🎯 Resumen Ejecutivo

### Cambios Principales

#### **Cambio de Nomenclatura:**
- **Antes:** `ateneapos`
- **Después:** `ateneaall`

#### **Cambio de Base de Datos:**
| Componente | Valor Anterior | Valor Nuevo |
|------------|---------------|-------------|
| **Host** | `db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com` | `db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com` (sin cambio) |
| **Database** | `ateneapos` | `ateneaposall` |
| **User** | `postgres` | `postgres` (sin cambio) |
| **Port** | `5432` | `5432` (sin cambio) |

#### **Cambio de Configuración de Ambiente:**
- **NODE_ENVIRONMENT:** `DEV` → `QA`
- **Razón:** Para que la lambda use las variables de entorno definidas en `template.yaml` en lugar de valores hardcodeados

---

## 📚 Contexto del Cambio

### Problema Identificado

La lambda estaba configurada con:
1. **Nomenclatura inconsistente:** Algunos archivos usaban `ateneapos` y otros `ateneaall`
2. **Credenciales obsoletas:** Apuntaba a la base de datos antigua `ateneapos`
3. **Configuración incorrecta:** `NODE_ENVIRONMENT=DEV` causaba que la lambda ignorara las variables de entorno del template y usara valores hardcodeados

### Objetivo de la Migración

1. ✅ Estandarizar todos los nombres a `ateneaall`
2. ✅ Migrar a la nueva base de datos `ateneaposall`
3. ✅ Asegurar que la lambda existente en AWS no se vea afectada
4. ✅ Crear una nueva lambda independiente con la nueva configuración

---

## 🔧 Ajustes Realizados por Archivo

### 1. **template.yaml** (AWS SAM Template)

**Ruta:** `/template.yaml`

#### Cambios realizados:

**a) Nombre de la función Lambda**
```yaml
# ANTES
FunctionName: lambda-ateneapos-pais

# DESPUÉS
FunctionName: lambda-ateneaall-pais
```

**b) ARN del Log Group**
```yaml
# ANTES
arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/lambda-ateneapos-pais:*

# DESPUÉS
arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/lambda-ateneaall-pais:*
```

**c) Variable de Entorno NODE_ENVIRONMENT**
```yaml
# ANTES
Environment:
  Variables:
    NODE_ENVIRONMENT: DEV

# DESPUÉS
Environment:
  Variables:
    NODE_ENVIRONMENT: QA
```

**d) Variables de Entorno de BD (Ya estaban correctas, solo validación)**
```yaml
Environment:
  Variables:
    PG_HOST: db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com
    PG_USER: postgres
    PG_PASSWORD: KratosMilo123**
    PG_DATABASE: ateneaposall
    PG_PORT: 5432
    NODE_ENVIRONMENT: QA
```

**⚠️ CRÍTICO:** El cambio de `DEV` a `QA` es esencial porque:
- Con `DEV`: La lambda usa config hardcodeada en `src/core/config/index.ts` (BD antigua)
- Con `QA`: La lambda lee las variables de entorno del template.yaml (BD nueva)

---

### 2. **src/core/config/index.ts** (Configuración de Base de Datos)

**Ruta:** `/src/core/config/index.ts`

#### Cambios realizados:

**a) Host de Base de Datos en LOCAL/DEV/PROD**
```typescript
// ANTES (3 ocurrencias)
host: "db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com",

// DESPUÉS (3 ocurrencias)
host: "db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com",
```

**b) Nombre de Base de Datos en LOCAL/DEV/PROD**
```typescript
// ANTES (3 ocurrencias)
database: "ateneapos",

// DESPUÉS (3 ocurrencias)
database: "ateneaposall",
```

**c) Configuración QA (sin cambios, usa variables de entorno)**
```typescript
QA: {
    host: process.env.PG_HOST ?? DefaultValues.EMPTY_STRING,
    user: process.env.PG_USER ?? DefaultValues.EMPTY_STRING,
    password: process.env.PG_PASSWORD ?? DefaultValues.EMPTY_STRING,
    database: process.env.PG_DATABASE ?? DefaultValues.EMPTY_STRING,
    port: Number(process.env.PG_PORT) ?? 5432,
    ssl: {
        rejectUnauthorized: false
    }
}
```

**Resultado:** Ahora LOCAL/DEV/PROD apuntan a la BD nueva, pero como usamos `NODE_ENVIRONMENT=QA`, se usará la configuración QA que lee del template.yaml.

---

### 3. **samconfig.toml** (Configuración de Despliegue SAM)

**Ruta:** `/samconfig.toml`

**Estado:** ✅ Ya estaba correcto, sin cambios necesarios

```toml
[default.deploy.parameters]
stack_name = "lambda-ateneaall-pais-stack"  # ✅ Correcto
s3_prefix = "lambda-ateneaall-pais"         # ✅ Correcto
region = "us-east-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
disable_rollback = true
```

---

### 4. **package.json** (Metadatos del Proyecto)

**Ruta:** `/package.json`

#### Cambios realizados:

```json
// ANTES
{
  "name": "lambda-moneda",
  "version": "1.0.0",
  "description": "Lambda para gestión de emojis y monedas",
  ...
}

// DESPUÉS
{
  "name": "lambda-ateneaall-pais",
  "version": "1.0.0",
  "description": "Lambda para gestión de países (ISO 3166-1) - Sistema POS Atenea",
  ...
}
```

**Razón:** El `package.json` tenía información incorrecta de otra lambda (moneda).

---

### 5. **GIT_WORKFLOW.md** (Documentación de Git)

**Ruta:** `/GIT_WORKFLOW.md`

#### Cambios realizados:

**a) Actualizar host de BD en ejemplos (1 ocurrencia)**
```markdown
# ANTES
host: "db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com",

# DESPUÉS
host: "db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com",
```

**b) Actualizar referencias al repositorio (6 ocurrencias)**
```markdown
# ANTES
https://github.com/Hidrasoft/lambda-ateneapos-moneda.git
cd lambda-ateneapos-moneda

# DESPUÉS
https://github.com/Hidrasoft/lambda-ateneaall-pais.git
cd lambda-ateneaall-pais
```

---

### 6. **database/** (Schemas de Base de Datos)

#### Cambios realizados:

**a) Eliminado archivo incorrecto:**
```bash
❌ database/moneda_schema.sql  # Archivo de otra lambda
```

**b) Creado archivo correcto:**
```bash
✅ database/pais_schema.sql    # Schema correcto para esta lambda
```

**Contenido del nuevo archivo:**
```sql
-- Conectar a la base de datos correcta
\c ateneaposall;  # ← Base de datos nueva

-- Crear tabla pais
CREATE TABLE IF NOT EXISTS pais (
    pais_id SERIAL PRIMARY KEY,
    codigo_iso VARCHAR(5) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices y datos de prueba incluidos
```

---

### 7. **Archivos NO Modificados (Validación)**

Los siguientes archivos **NO requirieron cambios** porque ya estaban correctos o no contenían referencias a cambiar:

✅ `src/app.ts` - Entry point de la lambda
✅ `src/controller/PaisController.ts` - Controlador
✅ `src/domain/PaisBL.ts` - Business logic
✅ `src/repositories/PaisRepository.ts` - Repository
✅ `src/core/utils/Constans.ts` - Constantes y queries SQL
✅ `src/core/utils/DatabaseManager.ts` - Database pool manager
✅ `tsconfig.json` - Configuración de TypeScript
✅ `.gitignore` - Archivos ignorados por Git

---

## 🔍 Validación de No Conflicto

### Estado Actual en AWS

**Lambda existente (NO se tocará):**
```
Nombre:        lambda-ateneapos-pais
Runtime:       nodejs20.x
Estado:        Desplegada y funcionando
Última mod:    2026-01-17
```

**Lambda nueva (se creará):**
```
Nombre:        lambda-ateneaall-pais  ← NOMBRE DIFERENTE
Runtime:       nodejs20.x
Estado:        Por desplegar
Stack:         lambda-ateneaall-pais-stack
```

### ¿Por qué NO habrá conflicto?

| Aspecto | Lambda Vieja | Lambda Nueva | ¿Conflicto? |
|---------|-------------|--------------|-------------|
| **Nombre función** | lambda-ateneapos-pais | lambda-ateneaall-pais | ❌ NO - Nombres diferentes |
| **Stack CloudFormation** | (desconocido) | lambda-ateneaall-pais-stack | ❌ NO - Stacks separados |
| **API Gateway** | El actual | Uno nuevo | ❌ NO - Gateways separados |
| **Log Group** | /aws/lambda/lambda-ateneapos-pais | /aws/lambda/lambda-ateneaall-pais | ❌ NO - Logs separados |
| **Base de Datos** | (la que tenga) | ateneaposall | ❌ NO - Pueden usar BDs diferentes |
| **IAM Roles** | (el actual) | Uno nuevo | ❌ NO - Roles separados |

### Conclusión: ✅ CERO RIESGO DE CONFLICTO

Las lambdas son **recursos completamente independientes** en AWS. Es como tener dos servidores distintos con nombres diferentes.

---

## 🚀 Proceso de Despliegue

### Pre-requisitos

1. ✅ AWS CLI configurado con credenciales válidas
2. ✅ SAM CLI instalado (`sam --version`)
3. ✅ Node.js 20.x instalado
4. ✅ Permisos para crear lambdas, API Gateway, y CloudFormation stacks
5. ✅ Validar que todos los cambios están hechos (ver checklist abajo)

---

### Paso 1: Validar Cambios Locales

```bash
# Ver resumen de cambios
git status

# Ver cambios específicos
git diff

# Validar archivos modificados
git diff --stat
```

**Archivos esperados modificados:**
```
✏️  Modificados:
    - template.yaml
    - src/core/config/index.ts
    - package.json
    - GIT_WORKFLOW.md

🗑️  Eliminados:
    - database/moneda_schema.sql

➕  Nuevos:
    - database/pais_schema.sql
    - MIGRACION_ATENEAALL.md (este documento)
```

---

### Paso 2: Build de la Lambda

```bash
# Ejecutar build con SAM
npm run build

# O directamente
sam build
```

**Salida esperada:**
```
Building codeuri: /path/to/src runtime: nodejs20.x architecture: arm64 functions: PaisFunction
Running esbuild...
Build Succeeded
Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml
```

**⚠️ Si hay errores:**
- Verificar que Node.js 20.x esté instalado
- Verificar que todas las dependencias estén instaladas: `npm install`
- Verificar sintaxis TypeScript: `tsc --noEmit`

---

### Paso 3: Despliegue a AWS

```bash
# Opción 1: Deploy con confirmación (RECOMENDADO para primera vez)
npm run deploy

# Opción 2: Deploy directo
sam deploy
```

**SAM te mostrará un preview de los cambios:**
```
CloudFormation stack changeset
---------------------------------------------------------------------------
Operation                       LogicalResourceId               ResourceType
---------------------------------------------------------------------------
+ Add                          PaisFunction                     AWS::Lambda::Function
+ Add                          PaisFunctionRole                 AWS::IAM::Role
+ Add                          ServerlessRestApi                AWS::ApiGateway::RestApi
+ Add                          ...
---------------------------------------------------------------------------

Changeset created successfully. arn:aws:cloudformation:...

Preview source code diff against deployed version:
(mostrará los cambios en el código)

Deploy this changeset? [y/N]:
```

**Escribe `y` y presiona Enter para confirmar.**

---

### Paso 4: Monitorear el Despliegue

```bash
# SAM mostrará el progreso en tiempo real
CloudFormation events from stack operations
---------------------------------------------------------------------------
ResourceStatus              ResourceType                LogicalResourceId
---------------------------------------------------------------------------
CREATE_IN_PROGRESS          AWS::CloudFormation::Stack  lambda-ateneaall-pais-stack
CREATE_IN_PROGRESS          AWS::IAM::Role              PaisFunctionRole
CREATE_COMPLETE             AWS::IAM::Role              PaisFunctionRole
CREATE_IN_PROGRESS          AWS::Lambda::Function       PaisFunction
CREATE_COMPLETE             AWS::Lambda::Function       PaisFunction
CREATE_IN_PROGRESS          AWS::ApiGateway::RestApi    ServerlessRestApi
CREATE_COMPLETE             AWS::ApiGateway::RestApi    ServerlessRestApi
CREATE_COMPLETE             AWS::CloudFormation::Stack  lambda-ateneaall-pais-stack
---------------------------------------------------------------------------

Successfully created/updated stack - lambda-ateneaall-pais-stack in us-east-1
```

**Duración esperada:** 2-5 minutos

---

### Paso 5: Capturar Outputs

Al finalizar, SAM mostrará los outputs del stack:

```
CloudFormation outputs from deployed stack
---------------------------------------------------------------------------
Outputs
---------------------------------------------------------------------------
Key                 ApiUrl
Description         URL del API Gateway para País
Value               https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod/

Key                 PaisFunctionArn
Description         ARN de la función Lambda de País
Value               arn:aws:lambda:us-east-1:123456789012:function:lambda-ateneaall-pais

Key                 PaisFunctionName
Description         Nombre de la función Lambda de País
Value               lambda-ateneaall-pais
---------------------------------------------------------------------------
```

**⚠️ IMPORTANTE:** Guarda estos valores, especialmente el `ApiUrl`.

---

## ✅ Verificación Post-Despliegue

### 1. Verificar que la Lambda fue creada

```bash
# Listar todas las lambdas con "pais" en el nombre
aws lambda list-functions \
  --region us-east-1 \
  --query "Functions[?contains(FunctionName, 'pais')].{Name:FunctionName, Runtime:Runtime, Modified:LastModified}" \
  --output table
```

**Salida esperada:**
```
-------------------------------------------------------------------------
|                             ListFunctions                             |
+-------------------------------+-------------------------+-------------+
|           Modified            |          Name           |   Runtime   |
+-------------------------------+-------------------------+-------------+
|  2026-01-17T21:45:13.000+0000 |  lambda-ateneapos-pais  |  nodejs20.x | ← VIEJA
|  2026-04-20T16:30:45.000+0000 |  lambda-ateneaall-pais  |  nodejs20.x | ← NUEVA
+-------------------------------+-------------------------+-------------+
```

✅ **Validación:** Deben aparecer **DOS lambdas**, ambas funcionando.

---

### 2. Verificar configuración de la Lambda Nueva

```bash
# Obtener configuración completa
aws lambda get-function-configuration \
  --function-name lambda-ateneaall-pais \
  --region us-east-1
```

**Validar estos campos en la respuesta:**
```json
{
  "FunctionName": "lambda-ateneaall-pais",
  "Runtime": "nodejs20.x",
  "Environment": {
    "Variables": {
      "PG_HOST": "db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com",
      "PG_DATABASE": "ateneaposall",
      "PG_USER": "postgres",
      "PG_PORT": "5432",
      "NODE_ENVIRONMENT": "QA"
    }
  },
  "MemorySize": 256,
  "Timeout": 10,
  "Architectures": ["arm64"]
}
```

✅ **Validación:** Todos los valores deben coincidir con lo esperado.

---

### 3. Verificar conectividad a Base de Datos

```bash
# Invocar lambda con una prueba simple (GET /v1/pos/paises)
aws lambda invoke \
  --function-name lambda-ateneaall-pais \
  --region us-east-1 \
  --payload '{
    "httpMethod": "GET",
    "path": "/v1/pos/paises",
    "headers": {
      "message-uuid": "test-uuid-123",
      "request-app-id": "test-app-456"
    },
    "queryStringParameters": {
      "pageSize": "10",
      "pageNumber": "1"
    }
  }' \
  response.json

# Ver respuesta
cat response.json | jq
```

**Respuesta esperada (exitosa):**
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"headers\":{...},\"messageResponse\":{\"responseCode\":\"0000\"},\"data\":[...]}"
}
```

✅ **Validación:**
- `statusCode: 200`
- `responseCode: "0000"`
- `data` contiene array de países

---

### 4. Prueba Funcional Completa

**a) Listar países (GET)**
```bash
curl -X GET "https://[TU-API-URL]/Prod/v1/pos/paises?pageSize=5&pageNumber=1" \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-$(date +%s)" \
  -H "request-app-id: test-app"
```

**b) Crear país (POST)**
```bash
curl -X POST "https://[TU-API-URL]/Prod/v1/pos/paises" \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-$(date +%s)" \
  -H "request-app-id: test-app" \
  -d '{
    "codigoIso": "ZZ",
    "nombre": "País de Prueba",
    "activo": true
  }'
```

**c) Consultar país por ID (GET)**
```bash
curl -X GET "https://[TU-API-URL]/Prod/v1/pos/paises/1" \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-$(date +%s)" \
  -H "request-app-id: test-app"
```

**d) Actualizar país (PATCH)**
```bash
curl -X PATCH "https://[TU-API-URL]/Prod/v1/pos/paises/1" \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-$(date +%s)" \
  -H "request-app-id: test-app" \
  -d '{
    "activo": false
  }'
```

**e) Eliminar país de prueba (DELETE)**
```bash
curl -X DELETE "https://[TU-API-URL]/Prod/v1/pos/paises/1" \
  -H "Content-Type: application/json" \
  -H "message-uuid: test-$(date +%s)" \
  -H "request-app-id: test-app"
```

✅ **Validación:** Todas las operaciones deben retornar `statusCode: 200/201` según corresponda.

---

### 5. Verificar Logs en CloudWatch

```bash
# Ver logs recientes
aws logs tail /aws/lambda/lambda-ateneaall-pais \
  --follow \
  --region us-east-1
```

✅ **Validación:**
- No deben aparecer errores de conexión a BD
- Logs deben mostrar consultas exitosas
- No debe haber errores de autenticación PostgreSQL

---

## 🔄 Rollback en Caso de Problemas

### Escenario 1: Error durante el despliegue

Si el despliegue falla, SAM automáticamente hace rollback del stack.

**Verificar estado:**
```bash
aws cloudformation describe-stacks \
  --stack-name lambda-ateneaall-pais-stack \
  --region us-east-1 \
  --query "Stacks[0].StackStatus"
```

**Posibles estados:**
- `ROLLBACK_COMPLETE` - El despliegue falló y se revirtió automáticamente
- `CREATE_COMPLETE` - Despliegue exitoso
- `UPDATE_ROLLBACK_COMPLETE` - Actualización falló y se revirtió

**Acción:** Revisar logs de CloudFormation para identificar el error:
```bash
aws cloudformation describe-stack-events \
  --stack-name lambda-ateneaall-pais-stack \
  --region us-east-1 \
  --max-items 20
```

---

### Escenario 2: Lambda desplegada pero con errores funcionales

**Opción A: Eliminar completamente la lambda nueva**
```bash
# Eliminar stack completo (lambda, API Gateway, roles, todo)
sam delete --stack-name lambda-ateneaall-pais-stack --region us-east-1
```

**Opción B: Revertir cambios en el código y redesplegar**
```bash
# 1. Revertir cambios locales
git restore .

# 2. Rebuild y redeploy
sam build && sam deploy
```

**⚠️ IMPORTANTE:** La lambda vieja (`lambda-ateneapos-pais`) NO se verá afectada en ninguno de estos escenarios.

---

### Escenario 3: Problemas de conectividad a BD

**Posibles causas:**
1. Credenciales incorrectas en template.yaml
2. Base de datos `ateneaposall` no existe
3. Permisos de red (Security Groups)
4. Host incorrecto

**Diagnóstico:**
```bash
# Ver variables de entorno de la lambda
aws lambda get-function-configuration \
  --function-name lambda-ateneaall-pais \
  --query "Environment.Variables"

# Ver logs de error
aws logs tail /aws/lambda/lambda-ateneaall-pais --since 10m
```

**Solución:**
1. Corregir valores en `template.yaml`
2. Ejecutar `sam build && sam deploy` nuevamente

---

## ✅ Checklist de Migración

### Antes del Despliegue

- [ ] Verificar que todos los archivos fueron modificados según esta guía
- [ ] Validar que `template.yaml` tiene `NODE_ENVIRONMENT: QA`
- [ ] Validar que `template.yaml` tiene `FunctionName: lambda-ateneaall-pais`
- [ ] Validar que `samconfig.toml` tiene `stack_name = "lambda-ateneaall-pais-stack"`
- [ ] Verificar credenciales de BD en variables de entorno del template.yaml
- [ ] Confirmar que `package.json` tiene el nombre correcto
- [ ] Ejecutar `git status` para ver cambios pendientes
- [ ] Hacer commit de los cambios
- [ ] Ejecutar `sam build` sin errores

### Durante el Despliegue

- [ ] Ejecutar `sam deploy`
- [ ] Confirmar changeset cuando SAM lo solicite
- [ ] Monitorear que el stack se crea correctamente (CREATE_COMPLETE)
- [ ] Capturar el `ApiUrl` de los outputs
- [ ] Capturar el `PaisFunctionArn` de los outputs

### Después del Despliegue

- [ ] Verificar que existen DOS lambdas (vieja y nueva) con `aws lambda list-functions`
- [ ] Validar configuración de la lambda nueva con `aws lambda get-function-configuration`
- [ ] Probar endpoint GET /v1/pos/paises
- [ ] Probar endpoint POST /v1/pos/paises (crear país de prueba)
- [ ] Probar endpoint GET /v1/pos/paises/{id}
- [ ] Probar endpoint PATCH /v1/pos/paises/{id}
- [ ] Probar endpoint DELETE /v1/pos/paises/{id}
- [ ] Revisar logs en CloudWatch (sin errores críticos)
- [ ] Validar respuestas con estructura Swagger correcta
- [ ] Confirmar conexión exitosa a base de datos `ateneaposall`

### Validación Final

- [ ] Lambda vieja sigue funcionando sin cambios
- [ ] Lambda nueva funciona correctamente
- [ ] Ambas lambdas coexisten sin conflictos
- [ ] Documentación actualizada en el repositorio
- [ ] Equipo notificado del cambio

---

## 📊 Resumen de Recursos AWS Creados

Después del despliegue exitoso, se habrán creado los siguientes recursos nuevos:

| Recurso | Nombre/ID | Descripción |
|---------|-----------|-------------|
| **Lambda Function** | `lambda-ateneaall-pais` | Función principal de la API |
| **IAM Role** | `lambda-ateneaall-pais-stack-PaisFunctionRole-XXXXX` | Role con permisos para logs |
| **CloudWatch Log Group** | `/aws/lambda/lambda-ateneaall-pais` | Logs de la lambda |
| **API Gateway** | `lambda-ateneaall-pais-stack` | API REST para los endpoints |
| **API Gateway Stage** | `Prod` | Stage de producción |
| **CloudFormation Stack** | `lambda-ateneaall-pais-stack` | Stack que agrupa todos los recursos |

**Total de recursos nuevos:** ~10-15 (según configuración de API Gateway)

---

## 🔐 Consideraciones de Seguridad

### ⚠️ Credenciales Hardcodeadas

**Problema identificado:**
```yaml
# En template.yaml
PG_PASSWORD: KratosMilo123**  # ❌ Hardcodeado
```

**Recomendaciones para producción:**

1. **Usar AWS Secrets Manager:**
```yaml
Environment:
  Variables:
    PG_PASSWORD_SECRET_ARN: arn:aws:secretsmanager:us-east-1:123456789:secret:db-password
```

2. **Usar AWS Systems Manager Parameter Store:**
```yaml
Environment:
  Variables:
    PG_PASSWORD: !Sub '{{resolve:ssm-secure:/atenea/db/password:1}}'
```

3. **Rotar credenciales regularmente**

4. **Habilitar validación SSL/TLS:**
```typescript
ssl: {
    rejectUnauthorized: true,  // En producción
    ca: fs.readFileSync('/path/to/rds-ca-bundle.pem')
}
```

---

## 📞 Soporte y Contacto

Si encuentras problemas durante la migración:

1. **Revisar esta guía completa primero**
2. **Revisar logs de CloudWatch:** `/aws/lambda/lambda-ateneaall-pais`
3. **Revisar eventos de CloudFormation:** `aws cloudformation describe-stack-events`
4. **Contactar al equipo de infraestructura de Atenea**
5. **Crear issue en el repositorio con logs y detalles del error**

---

## 📚 Referencias

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [PostgreSQL Connection Pooling](https://node-postgres.com/features/pooling)
- [API Gateway CORS Configuration](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)

---

## 📝 Historial de Cambios

| Fecha | Versión | Autor | Descripción |
|-------|---------|-------|-------------|
| 2026-04-20 | 1.0 | Equipo Atenea | Creación inicial del documento |

---

**Última actualización:** 2026-04-20
**Próxima revisión:** Después del primer despliegue exitoso
**Mantenedor:** Equipo Atenea - Sistema POS
