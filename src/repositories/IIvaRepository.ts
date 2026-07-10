import { IvaRequestDTO, IvaDTO, PatchIvaRequestDTO } from './dtos/IvaDTO';

export interface IIvaRepository {
  createIva(data: IvaRequestDTO): Promise<IvaDTO>;
  getIvaById(ivaId: number): Promise<IvaDTO | null>;
  listAllIvas(): Promise<IvaDTO[]>;
  countAllIvas(): Promise<number>;
  listIvasPaginated(pageSize: number, offset: number): Promise<IvaDTO[]>;
  updateIva(ivaId: number, data: IvaRequestDTO): Promise<IvaDTO | null>;
  patchIva(ivaId: number, data: PatchIvaRequestDTO): Promise<IvaDTO | null>;
  deleteIva(ivaId: number): Promise<IvaDTO | null>;
  checkIvaExistsByDescripcion(descripcion: string, excludeId?: number): Promise<boolean>;
}
