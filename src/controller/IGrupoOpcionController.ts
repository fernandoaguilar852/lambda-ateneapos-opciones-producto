import { APIGatewayProxyResult } from 'aws-lambda';
import { GrupoOpcionRequestDTO, UpdateGrupoOpcionRequestDTO } from '../repositories/dtos/GrupoOpcionDTO';

export interface IGrupoOpcionController {
  createGrupoOpcion(
    clienteId: number,
    data: GrupoOpcionRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  getGrupoOpcionById(
    grupoOpcionId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  listGruposByProducto(
    clienteId: number,
    productoId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  updateGrupoOpcion(
    grupoOpcionId: number,
    clienteId: number,
    data: UpdateGrupoOpcionRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  deleteGrupoOpcion(
    grupoOpcionId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;
}
