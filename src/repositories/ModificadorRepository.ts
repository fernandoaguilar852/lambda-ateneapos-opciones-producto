import { IModificadorRepository } from './IModificadorRepository';
import { ModificadorDTO, ModificadorRequestDTO, UpdateModificadorRequestDTO } from './dtos/ModificadorDTO';
import { mysqlClient } from '../core/utils/DatabaseManager';
import { QUERIES } from '../core/utils/Constans';
import { PostgresErrorHandler } from '../core/utils/PostgresErrorHandler';

export class ModificadorRepository implements IModificadorRepository {

  /**
   * Crear un nuevo modificador predefinido
   */
  async createModificador(clienteId: number, data: ModificadorRequestDTO): Promise<ModificadorDTO> {
    try {
      const result = await mysqlClient.query(
        QUERIES.CREATE_MODIFICADOR,
        [
          clienteId,
          data.productoId ?? null,  // NULL = modificador global
          data.tipo,
          data.nombre,
          data.descripcion ?? null,
          data.precioAdicional ?? 0,
          data.orden ?? 0
        ]
      );

      return result.rows[0] as ModificadorDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'createModificador');
    }
  }

  /**
   * Listar modificadores de un producto específico
   */
  async listModificadoresByProducto(clienteId: number, productoId: number): Promise<ModificadorDTO[]> {
    try {
      const result = await mysqlClient.query(
        QUERIES.LIST_MODIFICADORES_BY_PRODUCTO,
        [clienteId, productoId]
      );

      return result.rows as ModificadorDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'listModificadoresByProducto');
    }
  }

  /**
   * Listar modificadores globales (producto_id IS NULL)
   */
  async listModificadoresGlobales(clienteId: number): Promise<ModificadorDTO[]> {
    try {
      const result = await mysqlClient.query(
        QUERIES.LIST_MODIFICADORES_GLOBALES,
        [clienteId]
      );

      return result.rows as ModificadorDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'listModificadoresGlobales');
    }
  }

  /**
   * Actualizar un modificador
   */
  async updateModificador(
    modificadorId: number,
    clienteId: number,
    data: UpdateModificadorRequestDTO
  ): Promise<ModificadorDTO | null> {
    try {
      // Primero obtener el modificador actual para tener los valores actuales
      const current = await mysqlClient.query(
        `SELECT tipo, nombre, descripcion, precio_adicional, orden
         FROM producto_modificador_predefinido
         WHERE modificador_id = $1 AND cliente_id = $2 AND activo = true`,
        [modificadorId, clienteId]
      );

      if (current.rows.length === 0) {
        return null;
      }

      const currentData = current.rows[0];

      // Actualizar con valores nuevos o mantener los actuales
      const result = await mysqlClient.query(
        QUERIES.UPDATE_MODIFICADOR,
        [
          data.tipo ?? currentData.tipo,
          data.nombre ?? currentData.nombre,
          data.descripcion ?? currentData.descripcion,
          data.precioAdicional ?? currentData.precio_adicional,
          data.orden ?? currentData.orden,
          modificadorId,
          clienteId
        ]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as ModificadorDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'updateModificador');
    }
  }

  /**
   * Eliminar un modificador (soft delete)
   */
  async deleteModificador(modificadorId: number, clienteId: number): Promise<ModificadorDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.DELETE_MODIFICADOR,
        [modificadorId, clienteId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as ModificadorDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'deleteModificador');
    }
  }
}
