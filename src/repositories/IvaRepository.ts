import { IIvaRepository } from './IIvaRepository';
import { IvaRequestDTO, IvaDTO, PatchIvaRequestDTO } from './dtos/IvaDTO';
import { mysqlClient } from '../core/utils/DatabaseManager';
import { QUERIES } from '../core/utils/Constans';
import { PostgresErrorHandler } from '../core/utils/PostgresErrorHandler';

export class IvaRepository implements IIvaRepository {

  /**
   * Crear un nuevo IVA
   */
  async createIva(data: IvaRequestDTO): Promise<IvaDTO> {
    try {
      // Valor por defecto para activo
      const activo = data.activo ?? true;

      // Ejecutar INSERT y retornar el registro creado
      const result = await mysqlClient.query(
        QUERIES.CREATE_IVA,
        [data.descripcion, data.valor, activo]
      );

      return result.rows[0] as IvaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'createIva');
    }
  }

  /**
   * Obtener IVA por ID
   */
  async getIvaById(ivaId: number): Promise<IvaDTO | null> {
    try {
      const result = await mysqlClient.query(
        QUERIES.GET_IVA_BY_ID,
        [ivaId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as IvaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'getIvaById');
    }
  }

  /**
   * Listar todos los IVAs
   */
  async listAllIvas(): Promise<IvaDTO[]> {
    try {
      const result = await mysqlClient.query(QUERIES.LIST_ALL_IVAS);
      return result.rows as IvaDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'listAllIvas');
    }
  }

  /**
   * Contar total de IVAs
   */
  async countAllIvas(): Promise<number> {
    try {
      const result = await mysqlClient.query(QUERIES.COUNT_ALL_IVAS);
      return parseInt(result.rows[0]?.count || '0');
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'countAllIvas');
    }
  }

  /**
   * Listar IVAs con paginación
   */
  async listIvasPaginated(pageSize: number, offset: number): Promise<IvaDTO[]> {
    try {
      const result = await mysqlClient.query(
        QUERIES.LIST_IVAS_PAGINATED,
        [pageSize, offset]
      );
      return result.rows as IvaDTO[];
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'listIvasPaginated');
    }
  }

  /**
   * Actualizar IVA existente (PUT - actualización completa)
   */
  async updateIva(ivaId: number, data: IvaRequestDTO): Promise<IvaDTO | null> {
    try {
      // Valor por defecto
      const activo = data.activo ?? true;

      // Ejecutar UPDATE y retornar el registro actualizado
      const result = await mysqlClient.query(
        QUERIES.UPDATE_IVA,
        [data.descripcion, data.valor, activo, ivaId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as IvaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'updateIva');
    }
  }

  /**
   * Actualizar parcialmente IVA (PATCH - actualización parcial)
   */
  async patchIva(ivaId: number, data: PatchIvaRequestDTO): Promise<IvaDTO | null> {
    try {
      // Ejecutar UPDATE con COALESCE para actualizar solo campos proporcionados
      const result = await mysqlClient.query(
        QUERIES.PATCH_IVA,
        [
          data.descripcion !== undefined ? data.descripcion : null,
          data.valor !== undefined ? data.valor : null,
          data.activo !== undefined ? data.activo : null,
          ivaId
        ]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as IvaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'patchIva');
    }
  }

  /**
   * Eliminar IVA (soft delete - marca como inactivo)
   * Retorna la data del IVA después de marcarlo como inactivo
   */
  async deleteIva(ivaId: number): Promise<IvaDTO | null> {
    try {
      // Ejecutar soft delete (UPDATE activo = false) y retornar el registro
      const result = await mysqlClient.query(
        QUERIES.DELETE_IVA,
        [ivaId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as IvaDTO;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'deleteIva');
    }
  }

  /**
   * Verificar si ya existe un IVA con la descripción
   * (excluyendo opcionalmente un ID específico para actualizaciones)
   */
  async checkIvaExistsByDescripcion(descripcion: string, excludeId: number = 0): Promise<boolean> {
    try {
      const result = await mysqlClient.query(
        QUERIES.CHECK_IVA_EXISTS_BY_DESCRIPCION,
        [descripcion, excludeId]
      );

      const count = parseInt(result.rows[0]?.count || '0');
      return count > 0;
    } catch (error: any) {
      PostgresErrorHandler.handleError(error, 'checkIvaExistsByDescripcion');
    }
  }
}
