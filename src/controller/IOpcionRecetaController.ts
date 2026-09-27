import { APIGatewayProxyResult } from 'aws-lambda';
import { OpcionRecetaRequestDTO, UpdateOpcionRecetaRequestDTO } from '../repositories/dtos/OpcionRecetaDTO';

export interface IOpcionRecetaController {
  createOpcionReceta(
    clienteId: number,
    data: OpcionRecetaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  getRecetaByOpcion(
    clienteId: number,
    opcionId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  updateOpcionReceta(
    opcionId: number,
    insumoId: number,
    clienteId: number,
    data: UpdateOpcionRecetaRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  deleteOpcionReceta(
    opcionId: number,
    insumoId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;
}
