import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../../src/pages/Home';
import * as hooks from '../../src/hooks/hooks';
import { fetchProductos } from '../../src/store/productoSlice';


jest.mock('../../src/store/productoSlice', () => ({
  fetchProductos: jest.fn(),
}));

jest.mock('../../src/components/ListaProductos', () => jest.fn(() => <div>ListaProductos mock</div>));
jest.mock('../../src/components/Loader', () => jest.fn(() => <div>Loader mock</div>));

describe('Home component', () => {
  const useAppDispatchMock = jest.spyOn(hooks, 'useAppDispatch');
  const useAppSelectorMock = jest.spyOn(hooks, 'useAppSelector');

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAppDispatchMock.mockReturnValue(mockDispatch);
  });

  it('debería hacer dispatch de fetchProductos en mount', () => {
    useAppSelectorMock.mockReturnValue({
      items: [],
      loading: false,
      error: null,
    });

    render(<Home />);

    expect(mockDispatch).toHaveBeenCalledWith(fetchProductos());
  });

  it('muestra Loader cuando loading es true', () => {
    useAppSelectorMock.mockReturnValue({
      items: [],
      loading: true,
      error: null,
    });

    render(<Home />);

    expect(screen.getByText(/loader mock/i)).toBeInTheDocument();
  });

  it('muestra mensaje de error si hay error', () => {
    useAppSelectorMock.mockReturnValue({
      items: [],
      loading: false,
      error: 'Algo salió mal',
    });

    render(<Home />);

    expect(screen.getByText(/error: algo salió mal/i)).toBeInTheDocument();
  });

  it('muestra ListaProductos con productos cuando hay items', () => {
    useAppSelectorMock.mockReturnValue({
      items: [{ id: '1', nombre: 'Producto 1', precio: 100 }],
      loading: false,
      error: null,
    });

    render(<Home />);

    expect(screen.getByText(/listaproductos mock/i)).toBeInTheDocument();
  });
});
