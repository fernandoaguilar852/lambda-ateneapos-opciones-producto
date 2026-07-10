-- ============================================
-- Script para ELIMINAR la tabla IVA
-- ADVERTENCIA: Esto eliminará todos los datos
-- ============================================

-- Conectar a la base de datos
\c ateneaposall;

-- Eliminar tabla iva (si existe)
DROP TABLE IF EXISTS iva CASCADE;

-- Verificar que fue eliminada
SELECT tablename FROM pg_tables WHERE tablename = 'iva';
-- Si no devuelve resultados, la tabla fue eliminada exitosamente

-- Ahora puedes ejecutar iva_schema.sql para crearla de nuevo
