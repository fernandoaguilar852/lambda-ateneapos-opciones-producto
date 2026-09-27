import { OpcionRecetaDTO, OpcionRecetaConInsumoDTO } from '../../repositories/dtos/OpcionRecetaDTO';
import { OpcionReceta, OpcionRecetaConInsumo } from '../models/OpcionRecetaDomain';

export class OpcionRecetaMapper {

  /**
   * Transformar OpcionRecetaDTO a OpcionReceta (dominio)
   */
  static toDomain(dto: OpcionRecetaDTO): OpcionReceta {
    return {
      opcionRecetaId: dto.opcion_receta_id,
      clienteId: dto.cliente_id,
      opcionId: dto.opcion_id,
      insumoId: dto.insumo_id,
      cantidadBase: dto.cantidad_base,
      mermaPct: dto.merma_pct,
      activo: dto.activo,
      createdAt: dto.created_at
    };
  }

  /**
   * Transformar OpcionRecetaConInsumoDTO a OpcionRecetaConInsumo (dominio extendido)
   */
  static toDomainConInsumo(dto: OpcionRecetaConInsumoDTO): OpcionRecetaConInsumo {
    return {
      opcionRecetaId: dto.opcion_receta_id,
      clienteId: dto.cliente_id,
      opcionId: dto.opcion_id,
      insumoId: dto.insumo_id,
      cantidadBase: dto.cantidad_base,
      mermaPct: dto.merma_pct,
      activo: dto.activo,
      createdAt: dto.created_at,
      insumoNombre: dto.insumo_nombre
    };
  }

  /**
   * Transformar array de DTOs con insumo a array de modelos de dominio
   */
  static toDomainListConInsumo(dtos: OpcionRecetaConInsumoDTO[]): OpcionRecetaConInsumo[] {
    return dtos.map(dto => this.toDomainConInsumo(dto));
  }
}
