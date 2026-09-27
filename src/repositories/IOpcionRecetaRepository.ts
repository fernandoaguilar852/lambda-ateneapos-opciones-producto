import { OpcionRecetaRequestDTO, OpcionRecetaDTO, OpcionRecetaConInsumoDTO, UpdateOpcionRecetaRequestDTO } from './dtos/OpcionRecetaDTO';

export interface IOpcionRecetaRepository {
  createOpcionReceta(clienteId: number, data: OpcionRecetaRequestDTO): Promise<OpcionRecetaDTO>;
  getRecetaByOpcion(clienteId: number, opcionId: number): Promise<OpcionRecetaConInsumoDTO[]>;
  updateOpcionReceta(opcionId: number, insumoId: number, clienteId: number, data: UpdateOpcionRecetaRequestDTO): Promise<OpcionRecetaDTO | null>;
  deleteOpcionReceta(opcionId: number, insumoId: number, clienteId: number): Promise<OpcionRecetaDTO | null>;
}
