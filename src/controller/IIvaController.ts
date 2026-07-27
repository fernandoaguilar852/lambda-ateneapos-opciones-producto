import { APIGatewayProxyResult } from 'aws-lambda';
import { IvaRequestDTO, PatchIvaRequestDTO } from '../repositories/dtos/IvaDTO';

export interface IIvaController {
  createIva(data: IvaRequestDTO, messageUuid: string, requestAppId: string): Promise<APIGatewayProxyResult>;
  getIvaById(ivaId: number, messageUuid: string, requestAppId: string): Promise<APIGatewayProxyResult>;
  listAllIvas(messageUuid: string, requestAppId: string, pageSize: number, pageNumber: number): Promise<APIGatewayProxyResult>;
  updateIva(ivaId: number, data: IvaRequestDTO, messageUuid: string, requestAppId: string): Promise<APIGatewayProxyResult>;
  patchIva(ivaId: number, data: PatchIvaRequestDTO, messageUuid: string, requestAppId: string): Promise<APIGatewayProxyResult>;
  deleteIva(ivaId: number, messageUuid: string, requestAppId: string): Promise<APIGatewayProxyResult>;
}
