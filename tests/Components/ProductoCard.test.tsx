import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ProductoCard from '../../src/components/ProductoCard';
import { Producto } from '../../src/store/productoSlice';

describe('ProductoCard', () => {
  const productoMock: Producto = {
    id: '1',
    nombre: 'Producto Test',
    precio: 1000,
    stock: 5,
    cantidad: 0,
  };

  it('muestra el nombre y precio del producto', () => {
    render(<ProductoCard producto={productoMock} onModal={jest.fn()} />);
    expect(screen.getByText(/Producto Test/i)).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });


  it('actualiza cantidad cuando el valor es válido', () => {
    render(<ProductoCard producto={productoMock} onModal={jest.fn()} />);
    const inputCantidad = screen.getByLabelText(/Cantidad/i) as HTMLInputElement;
    fireEvent.change(inputCantidad, { target: { value: '3' } });
    expect(inputCantidad.value).toBe('3');
  });

  it('no actualiza cantidad si el valor es menor a 1', () => {
    render(<ProductoCard producto={productoMock} onModal={jest.fn()} />);
    const inputCantidad = screen.getByLabelText(/Cantidad/i) as HTMLInputElement;
    fireEvent.change(inputCantidad, { target: { value: '0' } });
    expect(inputCantidad.value).not.toBe('0');
  });

  it('no actualiza cantidad si el valor es mayor que el stock', () => {
    render(<ProductoCard producto={productoMock} onModal={jest.fn()} />);
    const inputCantidad = screen.getByLabelText(/Cantidad/i) as HTMLInputElement;
    fireEvent.change(inputCantidad, { target: { value: '10' } });
    expect(inputCantidad.value).not.toBe('10');
  });

  it('llama a onModal con el producto y cantidad correcta al hacer click', () => {
    const onModalMock = jest.fn();

    render(<ProductoCard producto={productoMock} onModal={onModalMock} />);
    const button = screen.getByRole('button', { name: /Comprar/i });
    fireEvent.click(button);

    expect(onModalMock).toHaveBeenCalledTimes(1);
    expect(onModalMock).toHaveBeenCalled();
  });

});
