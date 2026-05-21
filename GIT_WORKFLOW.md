# Guía: Subir Código al Repositorio de Hidrasoft

## 📋 Pre-requisitos

1. **Cuenta de GitHub:** `fernandoaguilar852`
2. **Permisos:** Debes ser colaborador del repositorio Hidrasoft
3. **Personal Access Token:** Token de acceso personal de GitHub
4. **Git configurado localmente:**
   ```bash
   git config --global user.name "fernando-aguilar"
   git config --global user.email "ferchosys8812@gmail.com"
   ```

---

## 🔑 Crear Personal Access Token (PAT)

**Solo necesitas hacerlo UNA VEZ** (o cuando el token expire)

### Pasos:

1. Ir a: https://github.com/settings/tokens/new

2. Configurar el token:
   - **Note (Nombre):** `Lambda Atenea POS`
   - **Expiration:** `90 days` (o el que prefieras)
   - **Select scopes:** Marcar la casilla **`repo`** (acceso completo a repositorios)

3. Click en **"Generate token"**

4. **COPIAR el token inmediatamente** (se muestra UNA SOLA VEZ)
   - El token se ve así: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. **GUARDAR el token en un lugar seguro:**
   - Puedes usar Notes, 1Password, o un gestor de contraseñas
   - **NUNCA** lo compartas con nadie
   - **NUNCA** lo subas a Git

---

## 🚀 Configuración Inicial del Proyecto

**Solo la primera vez que configuras el proyecto:**

### 1. Clonar el repositorio (si empiezas desde cero)

```bash
git clone https://github.com/Hidrasoft/lambda-ateneaall-moneda.git
cd lambda-ateneaall-moneda
```

### 2. O configurar remote en proyecto existente

```bash
cd /ruta/a/tu/proyecto
git remote add origin https://github.com/Hidrasoft/lambda-ateneaall-moneda.git
```

### 3. Verificar configuración

```bash
git remote -v
```

Debe mostrar:
```
origin  https://github.com/Hidrasoft/lambda-ateneaall-moneda.git (fetch)
origin  https://github.com/Hidrasoft/lambda-ateneaall-moneda.git (push)
```

---

## 📝 Flujo de Trabajo Normal

### Paso 1: Verificar el estado del repositorio

```bash
git status
```

### Paso 2: Agregar archivos modificados

```bash
# Agregar todos los archivos modificados
git add .

# O agregar archivos específicos
git add src/app.ts
git add template.yaml
```

### Paso 3: Crear un commit

```bash
git commit -m "Descripción clara de los cambios realizados"
```

**Ejemplo de buenos mensajes de commit:**
- `git commit -m "Add endpoint para actualizar moneda"`
- `git commit -m "Fix validación de código ISO en MonedaBL"`
- `git commit -m "Update configuración SSL de base de datos"`

### Paso 4: Hacer push al repositorio

```bash
git push origin main
```

**Cuando Git pida credenciales:**
- **Username for 'https://github.com':** `fernandoaguilar852`
- **Password for 'https://fernandoaguilar852@github.com':** *Pegar tu Personal Access Token*

**IMPORTANTE:** Cuando pegues el token, NO SE VERÁ en pantalla (es por seguridad). Solo pégalo y presiona Enter.

---

## 🔄 Flujo Completo de Trabajo

```bash
# 1. Ver cambios realizados
git status

# 2. Ver diferencias en archivos
git diff

# 3. Agregar archivos al staging
git add .

# 4. Crear commit
git commit -m "Descripción de cambios"

# 5. Sincronizar con el repositorio remoto (opcional pero recomendado)
git pull origin main

# 6. Subir cambios
git push origin main
```

---

## 🛠️ Comandos Útiles

### Ver historial de commits
```bash
git log --oneline
```

### Ver cambios específicos en archivos
```bash
git diff src/app.ts
```

### Descartar cambios en un archivo
```bash
git checkout -- nombre-archivo.ts
```

### Ver archivos ignorados por .gitignore
```bash
git status --ignored
```

### Sincronizar con cambios del equipo
```bash
git pull origin main
```

---

## ⚠️ Solución de Problemas Comunes

### Problema 1: "Permission denied"

**Causa:** No tienes permisos o el token es inválido.

**Solución:**
1. Verificar que eres colaborador del repositorio Hidrasoft
2. Generar un nuevo Personal Access Token
3. Intentar el push nuevamente

---

### Problema 2: "Repository not found"

**Causa:** El remote no está configurado correctamente.

**Solución:**
```bash
git remote set-url origin https://github.com/Hidrasoft/lambda-ateneaall-moneda.git
git remote -v  # Verificar
```

---

### Problema 3: Git sigue pidiendo credenciales en cada push

**Solución:** Configurar credential helper para guardar las credenciales

**En Mac:**
```bash
git config --global credential.helper osxkeychain
```

**En Windows:**
```bash
git config --global credential.helper wincred
```

Después del primer push exitoso, Git guardará tus credenciales.

---

### Problema 4: Conflictos al hacer pull

**Causa:** Alguien más hizo cambios en los mismos archivos.

**Solución:**
```bash
git pull origin main

# Git te mostrará los archivos en conflicto
# Edita los archivos para resolver los conflictos
# Busca las líneas que dicen <<<<<<< HEAD

# Después de resolver:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

---

### Problema 5: "Push protection - secrets detected"

**Causa:** GitHub detectó posibles credenciales en el código.

**Solución:**
1. Asegúrate de que `.gitignore` incluya:
   ```
   .env
   .env.local
   node_modules/
   .aws-sam/
   ```

2. Si el commit ya existe, necesitas limpiar el historial:
   ```bash
   # Contactar al administrador del repositorio
   ```

---

## 🔐 Mejores Prácticas de Seguridad

### ✅ HACER:

- ✅ Usar Personal Access Tokens (PAT) en lugar de contraseñas
- ✅ Guardar tokens en un gestor de contraseñas seguro
- ✅ Configurar credential helper para no escribir el token cada vez
- ✅ Usar `.gitignore` para excluir archivos sensibles
- ✅ Revocar tokens que ya no uses
- ✅ Crear commits descriptivos y claros

### ❌ NO HACER:

- ❌ NUNCA compartir tu Personal Access Token
- ❌ NUNCA subir archivos `.env` con credenciales
- ❌ NUNCA hacer commits con contraseñas de base de datos en el código
- ❌ NUNCA usar `git add .` sin verificar antes con `git status`
- ❌ NUNCA hacer `git push --force` sin consultar al equipo

---

## 📦 Archivos que NO deben subirse a Git

Ya están configurados en `.gitignore`, pero por precaución:

```
node_modules/          # Dependencias de Node.js
.aws-sam/              # Build artifacts de AWS SAM
.env                   # Variables de entorno locales
.env.local             # Variables de entorno locales
dist/                  # Archivos compilados
build/                 # Archivos de build
.DS_Store              # Archivos de macOS
*.log                  # Archivos de log
samconfig.toml         # Configuración local de SAM
```

---

## 🔄 Mantener Credenciales Fuera del Código

**NUNCA** colocar credenciales directamente en `src/core/config/index.ts`

**❌ MAL:**
```typescript
DATABASE: {
    host: "db-atenea-pos.ctiw48myq04p.us-east-1.rds.amazonaws.com",
    password: "KratosMilo123**"  // ❌ Credencial hardcodeada
}
```

**✅ BIEN:**
```typescript
DATABASE: {
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD  // ✅ Desde variables de entorno
}
```

Las credenciales deben estar en:
- Variables de entorno de Lambda (configuradas en AWS)
- Archivo `.env` local (NUNCA subir a Git)

---

## 📞 Soporte

Si tienes problemas:

1. Verificar este documento primero
2. Consultar la documentación oficial de Git: https://git-scm.com/doc
3. Consultar la documentación de GitHub: https://docs.github.com
4. Contactar al administrador del repositorio Hidrasoft

---

## 📚 Recursos Adicionales

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Última actualización:** 2026-01-09
**Repositorio:** https://github.com/Hidrasoft/lambda-ateneaall-moneda
