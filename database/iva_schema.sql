-- ============================================
-- Script de creación de tabla IVA
-- Sistema POS Atenea
-- ============================================

-- Conectar a la base de datos
\c ateneaposall;

-- Crear tabla iva
CREATE TABLE IF NOT EXISTS iva (
    iva_id SERIAL PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    valor NUMERIC(5,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,

    -- Constraints
    CONSTRAINT iva_descripcion_unique UNIQUE (descripcion),
    CONSTRAINT iva_valor_check CHECK (valor >= 0 AND valor <= 100)
);

-- Crear índices (solo si no existen)
CREATE INDEX IF NOT EXISTS idx_iva_activo ON iva(activo);
CREATE INDEX IF NOT EXISTS idx_iva_descripcion ON iva(descripcion);

-- Comentarios en la tabla
COMMENT ON TABLE iva IS 'Tabla de impuestos al valor agregado (IVA) del sistema POS';
COMMENT ON COLUMN iva.iva_id IS 'Identificador único del IVA';
COMMENT ON COLUMN iva.descripcion IS 'Descripción del tipo de IVA (ej: IVA General, IVA Reducido)';
COMMENT ON COLUMN iva.valor IS 'Porcentaje del IVA (entre 0 y 100)';
COMMENT ON COLUMN iva.activo IS 'Indica si el IVA está activo en el sistema';

-- Insertar datos de ejemplo (IVAs comunes en Colombia)
INSERT INTO iva (descripcion, valor, activo) VALUES
    ('IVA General', 19.00, true),
    ('IVA Reducido', 5.00, true),
    ('IVA Excluido', 0.00, true),
    ('IVA Bienes Raíces', 16.00, false)
ON CONFLICT (descripcion) DO NOTHING;

-- Verificar inserción
SELECT * FROM iva;

-- ============================================
-- Información de la tabla
-- ============================================
-- Para ver la estructura:
-- \d iva

-- Para ver datos:
-- SELECT * FROM iva ORDER BY iva_id;
