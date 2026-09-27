import { IGrupoOpcionRepository } from './IGrupoOpcionRepository';
import { GrupoOpcionRequestDTO, GrupoOpcionDTO, UpdateGrupoOpcionRequestDTO } from './dtos/GrupoOpcionDTO';
import { mysqlClient } from '../core/utils/DatabaseManager';
import { QUERIES } from '../core/utils/Constans';
import { PostgresErrorHandler } from '../core/utils/PostgresErrorHandler';

export class GrupoOpcionRepository implements IGrupoOpcionRepository {

  /**
   * Crear un nuevo grupo de opciones
   */
  async createGrupoOpcion(clienteId: number, data: GrupoOpcionRequestDTO): Promise<GrupoOpcionDTO> {
    try {
      // Valores por defecto
      const obligatorio = data.obligatorio ?? false;
      const minimoSelecciones = data.minimoSelecciones ?? 0;
      const maximoSelecciones = data.maximoSelecciones ?? 1;
      const incluidosEnPrecio = data.incluidosEnPrecio ?? 0;
      const cobrarAdicionales = data.cobrarAdicionales ?? true;
      const orden = data.orden ?? 0;

      // Ejecutar INSERT
      const result = await mysqlClient.query(
        QUERIES.CREATE_GRUPO_OPCION,
        [
          clienteId,
          data.productoId,
          data.nombre,
          obligatorio,
          minimoSelecciones,
          maximoSelecciones,
          incluidosEnPrecio,
          cobrarAdicionales,
          orden
        ]
      );

      return result.rows[0] as GrupoOpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'createGrupoOpcion');
    }
  }

  /**
   * Obtener grupo de opciones por ID
   */
  async getGrupoOpcionById(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcionDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.GET_GRUPO_OPCION_BY_ID,
        [grupoOpcionId, clienteId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as GrupoOpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'getGrupoOpcionById');
    }
  }

  /**
   * Listar grupos de opciones por producto
   */
  async listGruposByProducto(clienteId: number, productoId: number): Promise<GrupoOpcionDTO[]> {
    try {
      const result = await mysqlClient.query(
        QUERIES.LIST_GRUPOS_BY_PRODUCTO,
        [clienteId, productoId]
      );

      return result.rows as GrupoOpcionDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'listGruposByProducto');
    }
  }

  /**
   * Actualizar grupo de opciones
   */
  async updateGrupoOpcion(
    grupoOpcionId: number,
    clienteId: number,
    data: UpdateGrupoOpcionRequestDTO
  ): Promise<GrupoOpcionDTO | null> {
    try {
      // Valores por defecto
      const obligatorio = data.obligatorio ?? false;
      const minimoSelecciones = data.minimoSelecciones ?? 0;
      const maximoSelecciones = data.maximoSelecciones ?? 1;
      const incluidosEnPrecio = data.incluidosEnPrecio ?? 0;
      const cobrarAdicionales = data.cobrarAdicionales ?? true;
      const orden = data.orden ?? 0;

      const result = await mysqlClient.query(
        QUERIES.UPDATE_GRUPO_OPCION,
        [
          data.nombre,
          obligatorio,
          minimoSelecciones,
          maximoSelecciones,
          incluidosEnPrecio,
          cobrarAdicionales,
          orden,
          grupoOpcionId,
          clienteId
        ]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as GrupoOpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'updateGrupoOpcion');
    }
  }

  /**
   * Eliminar (soft delete) grupo de opciones
   */
  async deleteGrupoOpcion(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcionDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.DELETE_GRUPO_OPCION,
        [grupoOpcionId, clienteId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as GrupoOpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'deleteGrupoOpcion');
    }
  }
}
