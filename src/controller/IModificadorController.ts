import { APIGatewayProxyResult } from 'aws-lambda';
import { ModificadorRequestDTO, UpdateModificadorRequestDTO } from '../repositories/dtos/ModificadorDTO';

export interface IModificadorController {
  createModificador(
    clienteId: number,
    data: ModificadorRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  getModificadorById(
    modificadorId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  listModificadoresByProducto(
    clienteId: number,
    productoId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  listModificadoresGlobales(
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  updateModificador(
    modificadorId: number,
    clienteId: number,
    data: UpdateModificadorRequestDTO,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;

  deleteModificador(
    modificadorId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;
}
