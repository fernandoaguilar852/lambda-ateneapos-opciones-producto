import { OpcionRecetaRequestDTO, UpdateOpcionRecetaRequestDTO } from '../repositories/dtos/OpcionRecetaDTO';
import { OpcionReceta, OpcionRecetaListData } from './models/OpcionRecetaDomain';

export interface IOpcionRecetaBL {
  createOpcionReceta(clienteId: number, data: OpcionRecetaRequestDTO): Promise<OpcionReceta>;
  getRecetaByOpcion(clienteId: number, opcionId: number): Promise<OpcionRecetaListData>;
  updateOpcionReceta(opcionId: number, insumoId: number, clienteId: number, data: UpdateOpcionRecetaRequestDTO): Promise<OpcionReceta>;
  deleteOpcionReceta(opcionId: number, insumoId: number, clienteId: number): Promise<OpcionReceta>;
}
