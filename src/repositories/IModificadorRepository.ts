import { ModificadorDTO, ModificadorRequestDTO, UpdateModificadorRequestDTO } from './dtos/ModificadorDTO';

export interface IModificadorRepository {
  createModificador(clienteId: number, data: ModificadorRequestDTO): Promise<ModificadorDTO>;
  getModificadorById(modificadorId: number, clienteId: number): Promise<ModificadorDTO | null>;
  listModificadoresByProducto(clienteId: number, productoId: number): Promise<ModificadorDTO[]>;
  listModificadoresGlobales(clienteId: number): Promise<ModificadorDTO[]>;
  updateModificador(modificadorId: number, clienteId: number, data: UpdateModificadorRequestDTO): Promise<ModificadorDTO | null>;
  deleteModificador(modificadorId: number, clienteId: number): Promise<ModificadorDTO | null>;
}
