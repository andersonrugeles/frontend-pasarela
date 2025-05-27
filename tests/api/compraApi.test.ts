import axios from 'axios';
import { compraProducto, actualizarCompra } from '../../src/api/compraApi';
import { BASE_URL } from '../../src/utils/contants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('compraApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('compraProducto', () => {
    it('debe hacer POST y devolver data', async () => {
      const compraMock = { productoId: '123', cantidad: 2, nombreCliente: 'Juan', telefono: '123', email: 'a@b.com', direccion: 'Calle 1', total: 100 };
      const respuestaMock = { id: 'compra123', status: 'ok' };

      mockedAxios.post.mockResolvedValueOnce({ data: respuestaMock });

      const resultado = await compraProducto(compraMock);

      expect(mockedAxios.post).toHaveBeenCalledWith(`${BASE_URL}/dev/compra`, compraMock);
      expect(resultado).toEqual(respuestaMock);
    });

    it('debe lanzar error si falla axios', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Error en red'));

      await expect(compraProducto({} as any)).rejects.toThrow('Error en red');
    });
  });

  describe('actualizarCompra', () => {
    it('debe hacer PATCH y devolver data', async () => {
      const estadoMock = { estado: 'EXITOSA', total: 100, nombreCliente:'prueba', cantidad:1, direccion:'prueba' };
      const idCompra = 'compra123';
      const respuestaMock = { id: idCompra, estado: 'EXITOSA' };

      mockedAxios.patch.mockResolvedValueOnce({ data: respuestaMock });

      const resultado = await actualizarCompra(estadoMock, idCompra);

      expect(mockedAxios.patch).toHaveBeenCalledWith(`${BASE_URL}/dev/compra/${idCompra}`, estadoMock);
      expect(resultado).toEqual(respuestaMock);
    });

    it('debe lanzar error si falla axios', async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error('Error en red'));

      await expect(actualizarCompra({} as any, 'id')).rejects.toThrow('Error en red');
    });
  });
});
