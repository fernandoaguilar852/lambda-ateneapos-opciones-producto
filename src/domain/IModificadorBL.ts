import { ModificadorRequestDTO, UpdateModificadorRequestDTO } from '../repositories/dtos/ModificadorDTO';
import { Modificador, ModificadorListData } from './models/ModificadorDomain';

export interface IModificadorBL {
  createModificador(clienteId: number, data: ModificadorRequestDTO): Promise<Modificador>;
  getModificadorById(modificadorId: number, clienteId: number): Promise<Modificador>;
  listModificadoresByProducto(clienteId: number, productoId: number): Promise<ModificadorListData>;
  listModificadoresGlobales(clienteId: number): Promise<ModificadorListData>;
  updateModificador(modificadorId: number, clienteId: number, data: UpdateModificadorRequestDTO): Promise<Modificador>;
  deleteModificador(modificadorId: number, clienteId: number): Promise<Modificador>;
}
