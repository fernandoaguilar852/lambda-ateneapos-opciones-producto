import { GrupoOpcionRequestDTO, GrupoOpcionDTO, UpdateGrupoOpcionRequestDTO } from './dtos/GrupoOpcionDTO';

export interface IGrupoOpcionRepository {
  createGrupoOpcion(clienteId: number, data: GrupoOpcionRequestDTO): Promise<GrupoOpcionDTO>;
  getGrupoOpcionById(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcionDTO | null>;
  listGruposByProducto(clienteId: number, productoId: number): Promise<GrupoOpcionDTO[]>;
  updateGrupoOpcion(grupoOpcionId: number, clienteId: number, data: UpdateGrupoOpcionRequestDTO): Promise<GrupoOpcionDTO | null>;
  deleteGrupoOpcion(grupoOpcionId: number, clienteId: number): Promise<GrupoOpcionDTO | null>;
}
