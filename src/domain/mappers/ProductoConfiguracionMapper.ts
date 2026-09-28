import {
  ProductoConfiguracionCompletaDTO,
  GrupoOpcionCompletoDTO,
  OpcionConRecetaDTO,
  RecetaInsumoDTO,
  ModificadorProductoDTO
} from '../../repositories/dtos/ProductoConfiguracionDTO';

import {
  ProductoConfiguracionCompleta,
  GrupoOpcionCompleto,
  OpcionConReceta,
  RecetaInsumo,
  ModificadorProducto
} from '../models/ProductoConfiguracionDomain';

/**
 * Mapper para transformar entre DTOs (snake_case) y Domain Models (camelCase)
 * para la configuración completa del producto
 */
export class ProductoConfiguracionMapper {

  /**
   * Convertir RecetaInsumoDTO a RecetaInsumo
   */
  static recetaInsumoToDomain(dto: RecetaInsumoDTO): RecetaInsumo {
    return {
      opcionId: dto.opcion_id,
      insumoId: dto.insumo_id,
      insumoNombre: dto.insumo_nombre,
      cantidadBase: dto.cantidad_base,
      mermaPct: dto.merma_pct,
      activo: dto.activo
    };
  }

  /**
   * Convertir OpcionConRecetaDTO a OpcionConReceta
   */
  static opcionConRecetaToDomain(dto: OpcionConRecetaDTO): OpcionConReceta {
    return {
      opcionId: dto.opcion_id,
      grupoOpcionId: dto.grupo_opcion_id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precioAdicional: dto.precio_adicional,
      disponible: dto.disponible,
      orden: dto.orden,
      activo: dto.activo,
      createdAt: dto.created_at,
      receta: dto.receta.map(this.recetaInsumoToDomain)
    };
  }

  /**
   * Convertir GrupoOpcionCompletoDTO a GrupoOpcionCompleto
   */
  static grupoOpcionCompletoToDomain(dto: GrupoOpcionCompletoDTO): GrupoOpcionCompleto {
    return {
      grupoOpcionId: dto.grupo_opcion_id,
      productoId: dto.producto_id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      obligatorio: dto.obligatorio,
      multipleSeleccion: dto.multiple_seleccion,
      minSelecciones: dto.min_selecciones,
      maxSelecciones: dto.max_selecciones,
      orden: dto.orden,
      activo: dto.activo,
      createdAt: dto.created_at,
      opciones: dto.opciones.map(this.opcionConRecetaToDomain)
    };
  }

  /**
   * Convertir ModificadorProductoDTO a ModificadorProducto
   */
  static modificadorProductoToDomain(dto: ModificadorProductoDTO): ModificadorProducto {
    return {
      modificadorId: dto.modificador_id,
      productoId: dto.producto_id,
      tipo: dto.tipo,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precioAdicional: dto.precio_adicional,
      orden: dto.orden,
      esGlobal: dto.es_global
    };
  }

  /**
   * Convertir ProductoConfiguracionCompletaDTO a ProductoConfiguracionCompleta
   */
  static toDomain(dto: ProductoConfiguracionCompletaDTO): ProductoConfiguracionCompleta {
    return {
      // Datos del producto
      productoId: dto.producto_id,
      clienteId: dto.cliente_id,
      tipoProductoId: dto.tipo_producto_id,
      nombre: dto.nombre,
      codExterno: dto.cod_externo,
      codBarras: dto.cod_barras,
      imagen: dto.imagen,
      precio: dto.precio,
      unidadMedida: dto.unidad_medida,
      sigla: dto.sigla,
      stockTotal: dto.stock_total,
      stockReservado: dto.stock_reservado,
      stockMinimo: dto.stock_minimo,
      manejaStock: dto.maneja_stock,
      usaReceta: dto.usa_receta,
      activo: dto.activo,
      ivaId: dto.iva_id,

      // Configuración de opciones y modificadores
      gruposOpciones: dto.grupos_opciones.map(this.grupoOpcionCompletoToDomain),
      modificadores: dto.modificadores.map(this.modificadorProductoToDomain)
    };
  }
}
