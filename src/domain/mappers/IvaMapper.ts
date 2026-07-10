import { IvaDTO } from '../../repositories/dtos/IvaDTO';
import { Iva } from '../models/IvaDomain';

export class IvaMapper {

  /**
   * Transformar IvaDTO (snake_case de BD) a Iva (camelCase de dominio)
   */
  static toDomain(dto: IvaDTO): Iva {
    return {
      ivaId: dto.iva_id,
      descripcion: dto.descripcion,
      valor: dto.valor,
      activo: dto.activo
    };
  }

  /**
   * Transformar array de DTOs a array de modelos de dominio
   */
  static toDomainList(dtos: IvaDTO[]): Iva[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
