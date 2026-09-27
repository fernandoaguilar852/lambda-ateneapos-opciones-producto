import { IOpcionRecetaRepository } from './IOpcionRecetaRepository';
import { OpcionRecetaRequestDTO, OpcionRecetaDTO, OpcionRecetaConInsumoDTO, UpdateOpcionRecetaRequestDTO } from './dtos/OpcionRecetaDTO';
import { mysqlClient } from '../core/utils/DatabaseManager';
import { QUERIES } from '../core/utils/Constans';
import { PostgresErrorHandler } from '../core/utils/PostgresErrorHandler';

export class OpcionRecetaRepository implements IOpcionRecetaRepository {

  /**
   * Crear una nueva receta de opción (agregar insumo)
   */
  async createOpcionReceta(clienteId: number, data: OpcionRecetaRequestDTO): Promise<OpcionRecetaDTO> {
    try {
      // Valor por defecto para merma
      const mermaPct = data.mermaPct ?? 0;

      // Ejecutar INSERT
      const result = await mysqlClient.query(
        QUERIES.CREATE_OPCION_RECETA,
        [
          clienteId,
          data.opcionId,
          data.insumoId,
          data.cantidadBase,
          mermaPct
        ]
      );

      return result.rows[0] as OpcionRecetaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'createOpcionReceta');
    }
  }

  /**
   * Obtener receta completa de una opción (todos sus insumos)
   */
  async getRecetaByOpcion(clienteId: number, opcionId: number): Promise<OpcionRecetaConInsumoDTO[]> {
    try {
      const result = await mysqlClient.query(
        QUERIES.GET_RECETA_BY_OPCION,
        [clienteId, opcionId]
      );

      return result.rows as OpcionRecetaConInsumoDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'getRecetaByOpcion');
    }
  }

  /**
   * Actualizar insumo en receta
   */
  async updateOpcionReceta(
    opcionId: number,
    insumoId: number,
    clienteId: number,
    data: UpdateOpcionRecetaRequestDTO
  ): Promise<OpcionRecetaDTO | null> {
    try {
      // Valor por defecto para merma
      const mermaPct = data.mermaPct ?? 0;

      const result = await mysqlClient.query(
        QUERIES.UPDATE_OPCION_RECETA,
        [
          data.cantidadBase,
          mermaPct,
          opcionId,
          insumoId,
          clienteId
        ]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as OpcionRecetaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'updateOpcionReceta');
    }
  }

  /**
   * Eliminar (soft delete) insumo de receta
   */
  async deleteOpcionReceta(opcionId: number, insumoId: number, clienteId: number): Promise<OpcionRecetaDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.DELETE_OPCION_RECETA,
        [opcionId, insumoId, clienteId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as OpcionRecetaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'deleteOpcionReceta');
    }
  }
}
