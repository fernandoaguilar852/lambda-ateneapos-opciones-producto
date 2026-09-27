import { ModificadorDTO } from '../../repositories/dtos/ModificadorDTO';
import { Modificador } from '../models/ModificadorDomain';

export class ModificadorMapper {

  /**
   * Transformar ModificadorDTO a Modificador (dominio)
   */
  static toDomain(dto: ModificadorDTO): Modificador {
    return {
      modificadorId: dto.modificador_id,
      clienteId: dto.cliente_id,
      productoId: dto.producto_id,
      tipo: dto.tipo,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precioAdicional: dto.precio_adicional,
      activo: dto.activo,
      orden: dto.orden,
      createdAt: dto.created_at
    };
  }

  /**
   * Transformar array de DTOs a array de modelos de dominio
   */
  static toDomainList(dtos: ModificadorDTO[]): Modificador[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
