import axios from 'axios';
import type { Producto } from '../types/producto';

const BASE_URL = 'https://b67wpwmrik.execute-api.us-east-1.amazonaws.com';

export const obtenerProductos = async (): Promise<Producto[]> => {
  const response = await axios.get(`${BASE_URL}/dev/productos`);
  return response.data;
};