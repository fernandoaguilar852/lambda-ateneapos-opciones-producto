import { OpcionRequestDTO, OpcionDTO, UpdateOpcionRequestDTO } from './dtos/OpcionDTO';

export interface IOpcionRepository {
  createOpcion(clienteId: number, data: OpcionRequestDTO): Promise<OpcionDTO>;
  getOpcionById(opcionId: number, clienteId: number): Promise<OpcionDTO | null>;
  listOpcionesByGrupo(clienteId: number, grupoOpcionId: number): Promise<OpcionDTO[]>;
  updateOpcion(opcionId: number, clienteId: number, data: UpdateOpcionRequestDTO): Promise<OpcionDTO | null>;
  deleteOpcion(opcionId: number, clienteId: number): Promise<OpcionDTO | null>;
}
