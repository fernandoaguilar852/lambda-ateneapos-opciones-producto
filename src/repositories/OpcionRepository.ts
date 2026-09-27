import { IOpcionRepository } from './IOpcionRepository';
import { OpcionRequestDTO, OpcionDTO, UpdateOpcionRequestDTO } from './dtos/OpcionDTO';
import { mysqlClient } from '../core/utils/DatabaseManager';
import { QUERIES } from '../core/utils/Constans';
import { PostgresErrorHandler } from '../core/utils/PostgresErrorHandler';

export class OpcionRepository implements IOpcionRepository {

  /**
   * Crear una nueva opción
   */
  async createOpcion(clienteId: number, data: OpcionRequestDTO): Promise<OpcionDTO> {
    try {
      // Valores por defecto
      const precioAdicional = data.precioAdicional ?? 0;
      const porDefecto = data.porDefecto ?? false;
      const orden = data.orden ?? 0;

      // Ejecutar INSERT
      const result = await mysqlClient.query(
        QUERIES.CREATE_OPCION,
        [
          data.grupoOpcionId,
          clienteId,
          data.nombre,
          precioAdicional,
          porDefecto,
          orden
        ]
      );

      return result.rows[0] as OpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'createOpcion');
    }
  }

  /**
   * Obtener opción por ID
   */
  async getOpcionById(opcionId: number, clienteId: number): Promise<OpcionDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.GET_OPCION_BY_ID,
        [opcionId, clienteId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as OpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'getOpcionById');
    }
  }

  /**
   * Listar opciones por grupo
   */
  async listOpcionesByGrupo(clienteId: number, grupoOpcionId: number): Promise<OpcionDTO[]> {
    try {
      const result = await mysqlClient.query(
        QUERIES.LIST_OPCIONES_BY_GRUPO,
        [clienteId, grupoOpcionId]
      );

      return result.rows as OpcionDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'listOpcionesByGrupo');
    }
  }

  /**
   * Actualizar opción
   */
  async updateOpcion(
    opcionId: number,
    clienteId: number,
    data: UpdateOpcionRequestDTO
  ): Promise<OpcionDTO | null> {
    try {
      // Valores por defecto
      const precioAdicional = data.precioAdicional ?? 0;
      const porDefecto = data.porDefecto ?? false;
      const orden = data.orden ?? 0;

      const result = await mysqlClient.query(
        QUERIES.UPDATE_OPCION,
        [
          data.nombre,
          precioAdicional,
          porDefecto,
          orden,
          opcionId,
          clienteId
        ]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as OpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'updateOpcion');
    }
  }

  /**
   * Eliminar (soft delete) opción
   */
  async deleteOpcion(opcionId: number, clienteId: number): Promise<OpcionDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.DELETE_OPCION,
        [opcionId, clienteId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as OpcionDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'deleteOpcion');
    }
  }
}
