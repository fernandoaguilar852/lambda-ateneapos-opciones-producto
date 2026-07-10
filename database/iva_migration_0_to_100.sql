-- ============================================
-- Script de MIGRACIÓN: Actualizar constraint de valor
-- Cambiar rango de 1-100 a 0-100 para soportar IVA Excluido (0%)
-- ============================================

-- Conectar a la base de datos
\c ateneaposall;

-- Paso 1: Eliminar el constraint antiguo
ALTER TABLE iva DROP CONSTRAINT IF EXISTS iva_valor_check;

-- Paso 2: Crear el nuevo constraint con rango 0-100
ALTER TABLE iva ADD CONSTRAINT iva_valor_check CHECK (valor >= 0 AND valor <= 100);

-- Paso 3: Actualizar el comentario de la columna
COMMENT ON COLUMN iva.valor IS 'Porcentaje del IVA (entre 0 y 100)';

-- Verificar que el constraint fue actualizado correctamente
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'iva'::regclass
    AND conname = 'iva_valor_check';

-- Probar que ahora acepta valor 0
-- Esto debería funcionar sin errores:
-- INSERT INTO iva (descripcion, valor, activo) VALUES ('IVA Test 0%', 0.00, true);

-- Resultado esperado: iva_valor_check | CHECK (valor >= 0::numeric AND valor <= 100::numeric)
