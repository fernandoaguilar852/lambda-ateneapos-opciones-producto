import { OpcionRequestDTO, UpdateOpcionRequestDTO } from '../repositories/dtos/OpcionDTO';
import { Opcion, OpcionListData } from './models/OpcionDomain';

export interface IOpcionBL {
  createOpcion(clienteId: number, data: OpcionRequestDTO): Promise<Opcion>;
  getOpcionById(opcionId: number, clienteId: number): Promise<Opcion>;
  listOpcionesByGrupo(clienteId: number, grupoOpcionId: number): Promise<OpcionListData>;
  updateOpcion(opcionId: number, clienteId: number, data: UpdateOpcionRequestDTO): Promise<Opcion>;
  deleteOpcion(opcionId: number, clienteId: number): Promise<Opcion>;
}
