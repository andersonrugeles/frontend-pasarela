import axios from 'axios';
import { obtenerProductos } from '../../src/api/productoApi';
import { BASE_URL } from '../../src/utils/contants';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('obtenerProductos API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe hacer GET a /productos y devolver la lista', async () => {
    const productosMock = [
      { id: '1', nombre: 'Producto 1', precio: 1000, stock: 10 },
      { id: '2', nombre: 'Producto 2', precio: 2000, stock: 5 },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: productosMock });

    const resultado = await obtenerProductos();

    expect(mockedAxios.get).toHaveBeenCalledWith(`${BASE_URL}/dev/productos`);
    expect(resultado).toEqual(productosMock);
  });

  it('debe propagar errores', async () => {
    const error = new Error('Error en la solicitud');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(obtenerProductos()).rejects.toThrow('Error en la solicitud');
  });
});