import { IvaRequestDTO, PatchIvaRequestDTO } from '../repositories/dtos/IvaDTO';
import { Iva, IvaListData } from './models/IvaDomain';

export interface IIvaBL {
  createIva(data: IvaRequestDTO): Promise<Iva>;
  getIvaById(ivaId: number): Promise<Iva>;
  listAllIvas(pageSize?: number, pageNumber?: number): Promise<IvaListData>;
  updateIva(ivaId: number, data: IvaRequestDTO): Promise<Iva>;
  patchIva(ivaId: number, data: PatchIvaRequestDTO): Promise<Iva>;
  deleteIva(ivaId: number): Promise<Iva>;
}
