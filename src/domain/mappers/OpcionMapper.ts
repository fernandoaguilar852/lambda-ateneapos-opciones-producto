import { OpcionDTO } from '../../repositories/dtos/OpcionDTO';
import { Opcion } from '../models/OpcionDomain';

export class OpcionMapper {

  /**
   * Transformar OpcionDTO (snake_case de BD) a Opcion (camelCase de dominio)
   */
  static toDomain(dto: OpcionDTO): Opcion {
    return {
      opcionId: dto.opcion_id,
      grupoOpcionId: dto.grupo_opcion_id,
      clienteId: dto.cliente_id,
      nombre: dto.nombre,
      precioAdicional: dto.precio_adicional,
      porDefecto: dto.por_defecto,
      orden: dto.orden,
      activo: dto.activo,
      createdAt: dto.created_at
    };
  }

  /**
   * Transformar array de DTOs a array de modelos de dominio
   */
  static toDomainList(dtos: OpcionDTO[]): Opcion[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
