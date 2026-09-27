import { GrupoOpcionRequestDTO, UpdateGrupoOpcionRequestDTO } from '../repositories/dtos/GrupoOpcionDTO';
import { GrupoOpcion, GrupoOpcionListData } from './models/GrupoOpcionDomain';

export interface IGrupoOpcionBL {
  createGrupoOpcion(clienteId: number, data: GrupoOpcionRequestDTO): Promise<GrupoOpcion>;
  getGrupoOpcionById(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcion>;
  listGruposByProducto(clienteId: number, productoId: number): Promise<GrupoOpcionListData>;
  updateGrupoOpcion(grupoOpcionId: number, clienteId: number, data: UpdateGrupoOpcionRequestDTO): Promise<GrupoOpcion>;
  deleteGrupoOpcion(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcion>;
}
