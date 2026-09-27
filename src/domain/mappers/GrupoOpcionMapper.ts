import { GrupoOpcionDTO } from '../../repositories/dtos/GrupoOpcionDTO';
import { GrupoOpcion } from '../models/GrupoOpcionDomain';

export class GrupoOpcionMapper {

  /**
   * Transformar GrupoOpcionDTO (snake_case de BD) a GrupoOpcion (camelCase de dominio)
   */
  static toDomain(dto: GrupoOpcionDTO): GrupoOpcion {
    return {
      grupoOpcionId: dto.grupo_opcion_id,
      clienteId: dto.cliente_id,
      productoId: dto.producto_id,
      nombre: dto.nombre,
      obligatorio: dto.obligatorio,
      minimoSelecciones: dto.minimo_selecciones,
      maximoSelecciones: dto.maximo_selecciones,
      incluidosEnPrecio: dto.incluidos_en_precio,
      cobrarAdicionales: dto.cobrar_adicionales,
      orden: dto.orden,
      activo: dto.activo,
      createdAt: dto.created_at
    };
  }

  /**
   * Transformar array de DTOs a array de modelos de dominio
   */
  static toDomainList(dtos: GrupoOpcionDTO[]): GrupoOpcion[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
