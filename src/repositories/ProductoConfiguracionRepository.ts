import { IProductoConfiguracionRepository } from './IProductoConfiguracionRepository';
import {
  ProductoConfiguracionCompletaDTO,
  ProductoDTO,
  GrupoOpcionCompletoDTO,
  OpcionConRecetaDTO,
  RecetaInsumoDTO,
  ModificadorProductoDTO
} from './dtos/ProductoConfiguracionDTO';
import { getPool } from '../core/config/Database';
import { QUERIES } from '../core/utils/Constans';
import { PostgresErrorHandler } from '../core/utils/PostgresErrorHandler';

export class ProductoConfiguracionRepository implements IProductoConfiguracionRepository {

  /**
   * Obtener configuración completa de un producto
   * Incluye: datos del producto, grupos de opciones, opciones, recetas y modificadores
   */
  async getConfiguracionCompleta(productoId: number, clienteId: number): Promise<ProductoConfiguracionCompletaDTO | null> {
    try {
      const pool = await getPool();

      // 1. Obtener datos básicos del producto
      const productoResult = await pool.query(QUERIES.GET_PRODUCTO_BY_ID, [productoId, clienteId]);

      if (productoResult.rows.length === 0) {
        return null; // Producto no encontrado
      }

      const producto: ProductoDTO = productoResult.rows[0];

      // 2. Obtener grupos de opciones del producto
      const gruposResult = await pool.query(QUERIES.LIST_GRUPOS_BY_PRODUCTO, [clienteId, productoId]);
      const grupos: GrupoOpcionCompletoDTO[] = [];

      // 3. Para cada grupo, obtener sus opciones
      for (const grupoRow of gruposResult.rows) {
        const grupoOpcionId = grupoRow.grupo_opcion_id;

        // Obtener opciones del grupo
        const opcionesResult = await pool.query(QUERIES.LIST_OPCIONES_BY_GRUPO, [clienteId, grupoOpcionId]);
        const opciones: OpcionConRecetaDTO[] = [];

        // 4. Para cada opción, obtener su receta
        for (const opcionRow of opcionesResult.rows) {
          const opcionId = opcionRow.opcion_id;

          // Obtener receta de la opción
          const recetaResult = await pool.query(QUERIES.GET_RECETA_BY_OPCION, [clienteId, opcionId]);
          const receta: RecetaInsumoDTO[] = recetaResult.rows.map(row => ({
            opcion_id: row.opcion_id,
            insumo_id: row.insumo_id,
            insumo_nombre: row.insumo_nombre,
            cantidad: row.cantidad_base,
            unidad_medida: 'unidad', // Por defecto, se puede ajustar según la lógica
            activo: row.activo
          }));

          // Construir OpcionConRecetaDTO
          opciones.push({
            opcion_id: opcionRow.opcion_id,
            grupo_opcion_id: opcionRow.grupo_opcion_id,
            nombre: opcionRow.nombre,
            descripcion: null, // La tabla producto_opcion no tiene descripcion según DDL
            precio_adicional: opcionRow.precio_adicional,
            disponible: opcionRow.por_defecto, // Mapeo temporal, ajustar según lógica
            orden: opcionRow.orden,
            activo: opcionRow.activo,
            created_at: opcionRow.created_at,
            receta: receta
          });
        }

        // Construir GrupoOpcionCompletoDTO
        grupos.push({
          grupo_opcion_id: grupoRow.grupo_opcion_id,
          producto_id: grupoRow.producto_id,
          nombre: grupoRow.nombre,
          descripcion: null, // La tabla producto_grupo_opcion no tiene descripcion según DDL
          obligatorio: grupoRow.obligatorio,
          multiple_seleccion: grupoRow.maximo_selecciones > 1, // Inferido
          min_selecciones: grupoRow.minimo_selecciones,
          max_selecciones: grupoRow.maximo_selecciones,
          orden: grupoRow.orden,
          activo: grupoRow.activo,
          created_at: grupoRow.created_at,
          opciones: opciones
        });
      }

      // 5. Obtener modificadores (específicos + globales)
      const modificadoresResult = await pool.query(
        QUERIES.GET_MODIFICADORES_BY_PRODUCTO_COMPLETO,
        [clienteId, productoId]
      );

      const modificadores: ModificadorProductoDTO[] = modificadoresResult.rows.map(row => ({
        modificador_id: row.modificador_id,
        producto_id: row.producto_id,
        tipo: row.tipo,
        nombre: row.nombre,
        descripcion: row.descripcion,
        precio_adicional: row.precio_adicional,
        orden: row.orden,
        es_global: row.es_global
      }));

      // 6. Ensamblar configuración completa
      const configuracionCompleta: ProductoConfiguracionCompletaDTO = {
        // Datos del producto
        producto_id: producto.producto_id,
        cliente_id: producto.cliente_id,
        tipo_producto_id: producto.tipo_producto_id,
        nombre: producto.nombre,
        cod_externo: producto.cod_externo,
        cod_barras: producto.cod_barras,
        imagen: producto.imagen,
        precio: producto.precio,
        unidad_medida: producto.unidad_medida,
        sigla: producto.sigla,
        stock_total: producto.stock_total,
        stock_reservado: producto.stock_reservado,
        stock_minimo: producto.stock_minimo,
        maneja_stock: producto.maneja_stock,
        usa_receta: producto.usa_receta,
        activo: producto.activo,
        iva_id: producto.iva_id,

        // Configuración de opciones y modificadores
        grupos_opciones: grupos,
        modificadores: modificadores
      };

      return configuracionCompleta;

    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'getConfiguracionCompleta');
    }
  }
}
