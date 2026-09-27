import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Interfaz para el controlador de configuración completa de productos
 */
export interface IProductoConfiguracionController {
  /**
   * GET /v1/pos/productos/{productoId}/configuracion-completa
   * Obtener configuración completa de un producto
   */
  getConfiguracionCompleta(
    productoId: number,
    clienteId: number,
    messageUuid: string,
    requestAppId: string
  ): Promise<APIGatewayProxyResult>;
}
