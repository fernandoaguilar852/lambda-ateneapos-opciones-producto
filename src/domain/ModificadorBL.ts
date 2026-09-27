import { IModificadorBL } from './IModificadorBL';
import { IModificadorRepository } from '../repositories/IModificadorRepository';
import { ModificadorRequestDTO, UpdateModificadorRequestDTO } from '../repositories/dtos/ModificadorDTO';
import { Modificador, ModificadorListData } from './models/ModificadorDomain';
import { ModificadorMapper } from './mappers/ModificadorMapper';
import { ValidationError, NotFoundError } from './exceptions/CustomExceptions';

export class ModificadorBL implements IModificadorBL {

  constructor(private modificadorRepository: IModificadorRepository) {}

  /**
   * Crear un nuevo modificador predefinido
   */
  async createModificador(clienteId: number, data: ModificadorRequestDTO): Promise<Modificador> {
    // Validar clienteId
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateModificadorData(data);

    // Crear el modificador
    const modificadorDTO = await this.modificadorRepository.createModificador(clienteId, data);

    // Transformar a modelo de dominio
    return ModificadorMapper.toDomain(modificadorDTO);
  }

  /**
   * Listar modificadores de un producto específico
   */
  async listModificadoresByProducto(clienteId: number, productoId: number): Promise<ModificadorListData> {
    // Validar IDs
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    if (!productoId || productoId <= 0) {
      throw new ValidationError('El productoId debe ser un número positivo válido');
    }

    // Obtener modificadores
    const modificadoresDTOs = await this.modificadorRepository.listModificadoresByProducto(clienteId, productoId);

    // Transformar a modelos de dominio
    const modificadores = ModificadorMapper.toDomainList(modificadoresDTOs);

    return {
      modificadores,
      total: modificadores.length
    };
  }

  /**
   * Listar modificadores globales
   */
  async listModificadoresGlobales(clienteId: number): Promise<ModificadorListData> {
    // Validar clienteId
    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Obtener modificadores globales
    const modificadoresDTOs = await this.modificadorRepository.listModificadoresGlobales(clienteId);

    // Transformar a modelos de dominio
    const modificadores = ModificadorMapper.toDomainList(modificadoresDTOs);

    return {
      modificadores,
      total: modificadores.length
    };
  }

  /**
   * Actualizar un modificador
   */
  async updateModificador(
    modificadorId: number,
    clienteId: number,
    data: UpdateModificadorRequestDTO
  ): Promise<Modificador> {
    // Validar IDs
    if (!modificadorId || modificadorId <= 0) {
      throw new ValidationError('El modificadorId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateUpdateModificadorData(data);

    // Actualizar el modificador
    const modificadorDTO = await this.modificadorRepository.updateModificador(modificadorId, clienteId, data);

    if (!modificadorDTO) {
      throw new NotFoundError(`Modificador ${modificadorId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return ModificadorMapper.toDomain(modificadorDTO);
  }

  /**
   * Eliminar un modificador (soft delete)
   */
  async deleteModificador(modificadorId: number, clienteId: number): Promise<Modificador> {
    // Validar IDs
    if (!modificadorId || modificadorId <= 0) {
      throw new ValidationError('El modificadorId debe ser un número positivo válido');
    }

    if (!clienteId || clienteId <= 0) {
      throw new ValidationError('El clienteId debe ser un número positivo válido');
    }

    // Eliminar el modificador
    const modificadorDTO = await this.modificadorRepository.deleteModificador(modificadorId, clienteId);

    if (!modificadorDTO) {
      throw new NotFoundError(`Modificador ${modificadorId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return ModificadorMapper.toDomain(modificadorDTO);
  }

  /**
   * Validar datos de creación de modificador
   */
  private validateModificadorData(data: ModificadorRequestDTO): void {
    // Validar tipo
    if (!data.tipo) {
      throw new ValidationError('El tipo es requerido');
    }

    if (!['SIN', 'EXTRA', 'MODIFICACION'].includes(data.tipo)) {
      throw new ValidationError('El tipo debe ser SIN, EXTRA o MODIFICACION');
    }

    // Validar nombre
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new ValidationError('El nombre es requerido');
    }

    if (data.nombre.length > 100) {
      throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }

    // Validar descripción
    if (data.descripcion && data.descripcion.length > 255) {
      throw new ValidationError('La descripción no puede exceder 255 caracteres');
    }

    // Validar precio adicional
    if (data.precioAdicional !== undefined && data.precioAdicional < 0) {
      throw new ValidationError('El precioAdicional no puede ser negativo');
    }

    // Validar orden
    if (data.orden !== undefined && data.orden < 0) {
      throw new ValidationError('El orden no puede ser negativo');
    }

    // Validar productoId si se proporciona
    if (data.productoId !== undefined && data.productoId !== null && data.productoId <= 0) {
      throw new ValidationError('El productoId debe ser un número positivo válido o null para modificador global');
    }
  }

  /**
   * Validar datos de actualización de modificador
   */
  private validateUpdateModificadorData(data: UpdateModificadorRequestDTO): void {
    // Al menos un campo debe ser proporcionado
    if (!data.tipo && !data.nombre && !data.descripcion && data.precioAdicional === undefined && data.orden === undefined) {
      throw new ValidationError('Debe proporcionar al menos un campo para actualizar');
    }

    // Validar tipo si se proporciona
    if (data.tipo && !['SIN', 'EXTRA', 'MODIFICACION'].includes(data.tipo)) {
      throw new ValidationError('El tipo debe ser SIN, EXTRA o MODIFICACION');
    }

    // Validar nombre si se proporciona
    if (data.nombre !== undefined) {
      if (data.nombre.trim().length === 0) {
        throw new ValidationError('El nombre no puede estar vacío');
      }

      if (data.nombre.length > 100) {
        throw new ValidationError('El nombre no puede exceder 100 caracteres');
      }
    }

    // Validar descripción si se proporciona
    if (data.descripcion !== undefined && data.descripcion && data.descripcion.length > 255) {
      throw new ValidationError('La descripción no puede exceder 255 caracteres');
    }

    // Validar precio adicional si se proporciona
    if (data.precioAdicional !== undefined && data.precioAdicional < 0) {
      throw new ValidationError('El precioAdicional no puede ser negativo');
    }

    // Validar orden si se proporciona
    if (data.orden !== undefined && data.orden < 0) {
      throw new ValidationError('El orden no puede ser negativo');
    }
  }
}
