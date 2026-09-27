import { IGrupoOpcionBL } from './IGrupoOpcionBL';
import { IGrupoOpcionRepository } from '../repositories/IGrupoOpcionRepository';
import { GrupoOpcionRequestDTO, UpdateGrupoOpcionRequestDTO } from '../repositories/dtos/GrupoOpcionDTO';
import { GrupoOpcion, GrupoOpcionListData } from './models/GrupoOpcionDomain';
import { GrupoOpcionMapper } from './mappers/GrupoOpcionMapper';
import { ValidationError, NotFoundError } from './exceptions/CustomExceptions';

export class GrupoOpcionBL implements IGrupoOpcionBL {

  constructor(private grupoOpcionRepository: IGrupoOpcionRepository) {}

  /**
   * Crear un nuevo grupo de opciones
   */
  async createGrupoOpcion(clienteId: number, data: GrupoOpcionRequestDTO): Promise<GrupoOpcion> {
    // Validar clienteId
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateGrupoOpcionData(data);

    // Crear el grupo de opciones
    const grupoDTO = await this.grupoOpcionRepository.createGrupoOpcion(clienteId, data);

    // Transformar a modelo de dominio
    return GrupoOpcionMapper.toDomain(grupoDTO);
  }

  /**
   * Obtener grupo de opciones por ID
   */
  async getGrupoOpcionById(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcion> {
    // Validar IDs
    if (!grupoOpcionId || grupoOpcionId <= 0) {
      throw new ValidationError('El grupoOpcionId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Buscar grupo
    const grupoDTO = await this.grupoOpcionRepository.getGrupoOpcionById(grupoOpcionId, clienteId);

    if (!grupoDTO) {
      throw new NotFoundError(`Grupo de opciones con ID ${grupoOpcionId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return GrupoOpcionMapper.toDomain(grupoDTO);
  }

  /**
   * Listar grupos de opciones por producto
   */
  async listGruposByProducto(clienteId: number, productoId: number): Promise<GrupoOpcionListData> {
    // Validar IDs
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    if (!productoId || productoId <= 0) {
      throw new ValidationError('El productoId debe ser un número positivo válido');
    }

    // Obtener grupos
    const gruposDTO = await this.grupoOpcionRepository.listGruposByProducto(clienteId, productoId);

    // Transformar a modelos de dominio
    const gruposOpciones = GrupoOpcionMapper.toDomainList(gruposDTO);

    return {
      gruposOpciones,
      total: gruposOpciones.length
    };
  }

  /**
   * Actualizar grupo de opciones
   */
  async updateGrupoOpcion(
    grupoOpcionId: number,
    clienteId: number,
    data: UpdateGrupoOpcionRequestDTO
  ): Promise<GrupoOpcion> {
    // Validar IDs
    if (!grupoOpcionId || grupoOpcionId <= 0) {
      throw new ValidationError('El grupoOpcionId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateUpdateGrupoOpcionData(data);

    // Verificar que el grupo existe
    const existingGrupo = await this.grupoOpcionRepository.getGrupoOpcionById(grupoOpcionId, clienteId);
    if (!existingGrupo) {
      throw new NotFoundError(`Grupo de opciones con ID ${grupoOpcionId} no encontrado`);
    }

    // Actualizar el grupo
    const grupoDTO = await this.grupoOpcionRepository.updateGrupoOpcion(grupoOpcionId, clienteId, data);

    if (!grupoDTO) {
      throw new NotFoundError(`Grupo de opciones con ID ${grupoOpcionId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return GrupoOpcionMapper.toDomain(grupoDTO);
  }

  /**
   * Eliminar grupo de opciones (soft delete)
   */
  async deleteGrupoOpcion(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcion> {
    // Validar IDs
    if (!grupoOpcionId || grupoOpcionId <= 0) {
      throw new ValidationError('El grupoOpcionId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Eliminar el grupo
    const grupoDTO = await this.grupoOpcionRepository.deleteGrupoOpcion(grupoOpcionId, clienteId);

    if (!grupoDTO) {
      throw new NotFoundError(`Grupo de opciones con ID ${grupoOpcionId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return GrupoOpcionMapper.toDomain(grupoDTO);
  }

  /**
   * Validar datos de creación de grupo de opciones
   */
  private validateGrupoOpcionData(data: GrupoOpcionRequestDTO): void {
    if (!data.productoId || data.productoId <= 0) {
      throw new ValidationError('El productoId es requerido y debe ser un número positivo');
    }

    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new ValidationError('El nombre es requerido');
    }

    if (data.nombre.length > 100) {
      throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }

    // Validar rangos si están presentes
    if (data.minimoSelecciones !== undefined && data.minimoSelecciones < 0) {
      throw new ValidationError('El minimoSelecciones no puede ser negativo');
    }

    if (data.maximoSelecciones !== undefined && data.maximoSelecciones < 1) {
      throw new ValidationError('El maximoSelecciones debe ser al menos 1');
    }

    if (data.minimoSelecciones !== undefined && data.maximoSelecciones !== undefined) {
      if (data.minimoSelecciones > data.maximoSelecciones) {
        throw new ValidationError('El minimoSelecciones no puede ser mayor que maximoSelecciones');
      }
    }

    if (data.incluidosEnPrecio !== undefined && data.incluidosEnPrecio < 0) {
      throw new ValidationError('El incluidosEnPrecio no puede ser negativo');
    }
  }

  /**
   * Validar datos de actualización de grupo de opciones
   */
  private validateUpdateGrupoOpcionData(data: UpdateGrupoOpcionRequestDTO): void {
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new ValidationError('El nombre es requerido');
    }

    if (data.nombre.length > 100) {
      throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }

    // Validar rangos si están presentes
    if (data.minimoSelecciones !== undefined && data.minimoSelecciones < 0) {
      throw new ValidationError('El minimoSelecciones no puede ser negativo');
    }

    if (data.maximoSelecciones !== undefined && data.maximoSelecciones < 1) {
      throw new ValidationError('El maximoSelecciones debe ser al menos 1');
    }

    if (data.minimoSelecciones !== undefined && data.maximoSelecciones !== undefined) {
      if (data.minimoSelecciones > data.maximoSelecciones) {
        throw new ValidationError('El minimoSelecciones no puede ser mayor que maximoSelecciones');
      }
    }

    if (data.incluidosEnPrecio !== undefined && data.incluidosEnPrecio < 0) {
      throw new ValidationError('El incluidosEnPrecio no puede ser negativo');
    }
  }
}
