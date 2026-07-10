import { IIvaBL } from './IIvaBL';
import { IIvaRepository } from '../repositories/IIvaRepository';
import { IvaRequestDTO, PatchIvaRequestDTO } from '../repositories/dtos/IvaDTO';
import { Iva, IvaListData } from './models/IvaDomain';
import { IvaMapper } from './mappers/IvaMapper';
import { ValidationError, NotFoundError, ConflictError } from './exceptions/CustomExceptions';

// Re-exportar excepciones para compatibilidad con imports existentes
export { ValidationError, NotFoundError, ConflictError };

export class IvaBL implements IIvaBL {

  constructor(private ivaRepository: IIvaRepository) {}

  /**
   * Crear un nuevo IVA
   */
  async createIva(data: IvaRequestDTO): Promise<Iva> {
    // Validar datos de entrada
    this.validateIvaData(data);

    // Verificar que no exista un IVA con la misma descripción
    const exists = await this.ivaRepository.checkIvaExistsByDescripcion(data.descripcion);
    if (exists) {
      throw new ConflictError(`Ya existe un IVA con la descripción: ${data.descripcion}`);
    }

    // Crear el IVA
    const ivaDTO = await this.ivaRepository.createIva(data);

    // Transformar a modelo de dominio
    return IvaMapper.toDomain(ivaDTO);
  }

  /**
   * Obtener IVA por ID
   */
  async getIvaById(ivaId: number): Promise<Iva> {
    // Validar ID
    if (!ivaId || ivaId <= 0) {
      throw new ValidationError('El ivaId debe ser un número positivo válido');
    }

    // Buscar IVA
    const ivaDTO = await this.ivaRepository.getIvaById(ivaId);

    if (!ivaDTO) {
      throw new NotFoundError(`IVA con ID ${ivaId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return IvaMapper.toDomain(ivaDTO);
  }

  /**
   * Listar todos los IVAs con paginación
   */
  async listAllIvas(pageSize: number = 10, pageNumber: number = 1): Promise<IvaListData> {
    // Validar parámetros de paginación
    if (pageSize <= 0 || pageSize > 100) {
      throw new ValidationError('El pageSize debe estar entre 1 y 100');
    }

    if (pageNumber <= 0) {
      throw new ValidationError('El pageNumber debe ser mayor a 0');
    }

    // Calcular offset
    const offset = (pageNumber - 1) * pageSize;

    // Obtener total de elementos
    const totalElement = await this.ivaRepository.countAllIvas();

    // Obtener IVAs paginados
    const ivasDTO = await this.ivaRepository.listIvasPaginated(pageSize, offset);

    // Transformar a modelos de dominio
    const ivas = IvaMapper.toDomainList(ivasDTO);

    // Calcular si hay más elementos
    const hasMoreElements = (offset + ivas.length) < totalElement;

    return {
      ivas,
      pagination: {
        totalElement,
        pageSize,
        pageNumber,
        hasMoreElements
      }
    };
  }

  /**
   * Actualizar IVA existente (PUT - actualización completa)
   */
  async updateIva(ivaId: number, data: IvaRequestDTO): Promise<Iva> {
    // Validar ID
    if (!ivaId || ivaId <= 0) {
      throw new ValidationError('El ivaId debe ser un número positivo válido');
    }

    // Validar datos de entrada
    this.validateIvaData(data);

    // Verificar que el IVA existe
    const existingIva = await this.ivaRepository.getIvaById(ivaId);
    if (!existingIva) {
      throw new NotFoundError(`IVA con ID ${ivaId} no encontrado`);
    }

    // Verificar que no exista otro IVA con la misma descripción
    const exists = await this.ivaRepository.checkIvaExistsByDescripcion(data.descripcion, ivaId);
    if (exists) {
      throw new ConflictError(`Ya existe otro IVA con la descripción: ${data.descripcion}`);
    }

    // Actualizar el IVA
    const ivaDTO = await this.ivaRepository.updateIva(ivaId, data);

    if (!ivaDTO) {
      throw new NotFoundError(`No se pudo actualizar el IVA con ID ${ivaId}`);
    }

    // Transformar a modelo de dominio
    return IvaMapper.toDomain(ivaDTO);
  }

  /**
   * Actualizar parcialmente IVA (PATCH - actualización parcial)
   */
  async patchIva(ivaId: number, data: PatchIvaRequestDTO): Promise<Iva> {
    // Validar ID
    if (!ivaId || ivaId <= 0) {
      throw new ValidationError('El ivaId debe ser un número positivo válido');
    }

    // Validar que al menos un campo esté presente
    if (!data.descripcion && data.valor === undefined && data.activo === undefined) {
      throw new ValidationError('Debe proporcionar al menos un campo para actualizar');
    }

    // Verificar que el IVA existe
    const existingIva = await this.ivaRepository.getIvaById(ivaId);
    if (!existingIva) {
      throw new NotFoundError(`IVA con ID ${ivaId} no encontrado`);
    }

    // Validar campos individuales si están presentes
    if (data.descripcion !== undefined) {
      this.validateDescripcion(data.descripcion);

      // Verificar que no exista otro IVA con la misma descripción
      const exists = await this.ivaRepository.checkIvaExistsByDescripcion(data.descripcion, ivaId);
      if (exists) {
        throw new ConflictError(`Ya existe otro IVA con la descripción: ${data.descripcion}`);
      }
    }

    if (data.valor !== undefined) {
      this.validateValor(data.valor);
    }

    if (data.activo !== undefined && typeof data.activo !== 'boolean') {
      throw new ValidationError('El campo activo debe ser un valor booleano (true o false)');
    }

    // Actualizar el IVA
    const ivaDTO = await this.ivaRepository.patchIva(ivaId, data);

    if (!ivaDTO) {
      throw new NotFoundError(`No se pudo actualizar el IVA con ID ${ivaId}`);
    }

    // Transformar a modelo de dominio
    return IvaMapper.toDomain(ivaDTO);
  }

  /**
   * Eliminar IVA (soft delete - marca como inactivo)
   * Retorna la data del IVA después de marcarlo como inactivo
   */
  async deleteIva(ivaId: number): Promise<Iva> {
    // Validar ID
    if (!ivaId || ivaId <= 0) {
      throw new ValidationError('El ivaId debe ser un número positivo válido');
    }

    // Soft delete: marcar como inactivo y obtener la data
    const ivaDTO = await this.ivaRepository.deleteIva(ivaId);

    if (!ivaDTO) {
      throw new NotFoundError(`IVA con ID ${ivaId} no encontrado`);
    }

    // Transformar a modelo de dominio
    return IvaMapper.toDomain(ivaDTO);
  }

  /**
   * Validar datos completos de IVA
   */
  private validateIvaData(data: IvaRequestDTO): void {
    this.validateDescripcion(data.descripcion);
    this.validateValor(data.valor);

    // Validar activo (opcional, pero si viene debe ser booleano)
    if (data.activo !== undefined && typeof data.activo !== 'boolean') {
      throw new ValidationError('El campo activo debe ser un valor booleano (true o false)');
    }
  }

  /**
   * Validar descripción
   */
  private validateDescripcion(descripcion: string): void {
    if (!descripcion || descripcion.trim().length === 0) {
      throw new ValidationError('El campo descripcion es requerido');
    }

    if (descripcion.length > 200) {
      throw new ValidationError('La descripcion no puede exceder 200 caracteres');
    }
  }

  /**
   * Validar valor
   */
  private validateValor(valor: number): void {
    if (valor === undefined || valor === null) {
      throw new ValidationError('El campo valor es requerido');
    }

    if (typeof valor !== 'number' || isNaN(valor)) {
      throw new ValidationError('El campo valor debe ser un número válido');
    }

    if (valor < 0 || valor > 100) {
      throw new ValidationError('El valor debe estar entre 0 y 100');
    }
  }
}
