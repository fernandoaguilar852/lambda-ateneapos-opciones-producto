import { APIGatewayProxyResult } from 'aws-lambda';
import { OpcionRequestDTO, UpdateOpcionRequestDTO } from '../repositories/dtos/OpcionDTO';

export interface IOpcionController {
  createOpcion(
    clienteId: number,
    data: OpcionRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  getOpcionById(
    opcionId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  listOpcionesByGrupo(
    clienteId: number,
    grupoOpcionId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  updateOpcion(
    opcionId: number,
    clienteId: number,
    data: UpdateOpcionRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  deleteOpcion(
    opcionId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;
}
