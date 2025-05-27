import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListaProductos from '../../src/components/ListaProductos';
import type { Producto } from '../../src/store/productoSlice';
import { actualizarCompra, compraProducto } from '../../src/api/compraApi';
import { consultarTransaccion, crearTransaccion, obtenerTokenPrefirmado, tokenizarTarjeta } from '../../src/api/integration';

const productosMock: Producto[] = [
  { id: 'p1', nombre: 'Producto 1', precio: 1500, stock: 3, cantidad: 0 },
  { id: 'p2', nombre: 'Producto 2', precio: 2500, stock: 5, cantidad: 0 }
];

jest.mock('../../src/api/integration', () => ({
  consultarTransaccion: jest.fn(),
  tokenizarTarjeta: jest.fn(),
  obtenerTokenPrefirmado: jest.fn(),
  crearTransaccion: jest.fn(),
}));

jest.mock('../../src/api/compraApi', () => ({
  compraProducto: jest.fn(),
  actualizarCompra: jest.fn(),
}));


describe('ListaProductos', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renderiza todos los productos', () => {
    render(<ListaProductos productos={productosMock} />);

    expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Producto 2/i)).toBeInTheDocument();
  });

  it('renderiza sin los productos', () => {
    render(<ListaProductos productos={[]} />);

    expect(screen.getByText(/no hay productos disponibles./i)).toBeInTheDocument();
  });
  it('muestra el modal de pago al hacer clic en "Comprar"', async () => {
    render(<ListaProductos productos={productosMock} />);
    const botonesComprar = screen.getAllByRole('button', { name: /comprar/i });

    const cantidadInputs = screen.getAllByLabelText('Cantidad');
    fireEvent.change(cantidadInputs[0], { target: { value: '2' } });

    fireEvent.click(botonesComprar[0]);

    await waitFor(() => {
      expect(screen.getByText(/datos de pago/i)).toBeInTheDocument();
    });
  });

  it('permite ingresar datos en el modal y habilita el botón "Siguiente"', async () => {
    render(<ListaProductos productos={productosMock} />);
    fireEvent.click(screen.getAllByRole('button', { name: /comprar/i })[0]);

    await waitFor(() => {
      expect(screen.getByLabelText(/nombre del titular/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { target: { value: '5407347968812090' } }); // Mastercard válida
    fireEvent.change(screen.getByLabelText(/expiración/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeEnabled();
    });
  });

  it('abre el modal de pago y completa el formulario', async () => {
    render(<ListaProductos productos={productosMock} />);

    fireEvent.click(screen.getAllByRole('button', { name: /comprar/i })[0]);

    const tituloModal = await screen.findByText(/datos de pago/i);
    expect(tituloModal).toBeInTheDocument();


    await waitFor(() => {
      expect(screen.getByLabelText(/nombre del titular/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), {
      target: { value: '5407347968812090' }
    });
    fireEvent.change(screen.getByLabelText(/expiración/i), {
      target: { value: '1225' }
    });
    fireEvent.change(screen.getByLabelText(/cvv/i), {
      target: { value: '123' }
    });
    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), {
      target: { value: 'Calle 123' }
    });

    fireEvent.change(screen.getByLabelText(/telefono/i), {
      target: { value: '234324324' }
    });

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'juan@example.com' }
    });



    await waitFor(() => {
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeEnabled();
    });
    await fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // 5. Esperar que se abra el resumen de pago
    const resumen = await screen.findByText(/resumen/i);
    expect(resumen).toBeInTheDocument();
  });


  it('realiza la compra y muestra el modal de transacción', async () => {
    (compraProducto as jest.Mock).mockResolvedValue({ id: 'compra123' });
    (tokenizarTarjeta as jest.Mock).mockResolvedValue('token123');
    (obtenerTokenPrefirmado as jest.Mock).mockResolvedValue('prefirmado123');
    (crearTransaccion as jest.Mock).mockResolvedValue({
      data: { id: 'trx123' }
    });

    render(<ListaProductos productos={productosMock} />);

    fireEvent.click(screen.getAllByRole('button', { name: /comprar/i })[0]);
    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { target: { value: '5407347968812090' } });
    fireEvent.change(screen.getByLabelText(/expiración/i), { target: { value: '1225' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), { target: { value: 'Calle 1' } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: '3110000000' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@ejemplo.com' } });

    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    const confirmar = await screen.findByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmar);

    await waitFor(() => {
      expect(compraProducto).toHaveBeenCalled();
      expect(tokenizarTarjeta).toHaveBeenCalled();
      expect(obtenerTokenPrefirmado).toHaveBeenCalled();
      expect(crearTransaccion).toHaveBeenCalled();
    });

    expect(await screen.findByText(/respuesta/i)).toBeInTheDocument();
  });


  it('muestra error si falla la compra', async () => {
    (compraProducto as jest.Mock).mockRejectedValueOnce(new Error('Compra fallida'));

    render(<ListaProductos productos={productosMock} />);

    fireEvent.click(screen.getAllByRole('button', { name: /comprar/i })[0]);

    const titulo = await screen.findByText(/datos de pago/i);
    expect(titulo).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { target: { value: '5407347968812090' } });
    fireEvent.change(screen.getByLabelText(/expiración/i), { target: { value: '1225' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: '3110000000' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    const resumen = await screen.findByText(/resumen/i);
    expect(resumen).toBeInTheDocument();

    const btnConfirmar = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(btnConfirmar);

    const error = await screen.findByText(/hubo un problema al procesar tu pago/i);
    expect(error).toBeInTheDocument();
  });

  it('consulta la transacción y actualiza el estado de la compra correctamente', async () => {
    (consultarTransaccion as jest.Mock).mockResolvedValueOnce({
      data: { status: 'APPROVED' },
    });

    (actualizarCompra as jest.Mock).mockResolvedValueOnce({});

    render(<ListaProductos productos={productosMock} />);

    fireEvent.click(screen.getAllByRole('button', { name: /comprar/i })[0]);
    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { target: { value: '5407347968812090' } });
    fireEvent.change(screen.getByLabelText(/expiración/i), { target: { value: '1225' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: '3110000000' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));


    const btnConfirmar = await screen.findByRole('button', { name: /confirmar/i });
    fireEvent.click(btnConfirmar);


    const btnVerEstado = await screen.findByRole('button', { name: /refrescar estado/i });
    fireEvent.click(btnVerEstado);


    const estado = await screen.findByText(/respuesta/i);
    expect(estado).toBeInTheDocument();

    expect(consultarTransaccion).toHaveBeenCalled();
    expect(actualizarCompra).toHaveBeenCalled();
  });

  it('muestra un error si falla la consulta de la transacción', async () => {
    (consultarTransaccion as jest.Mock).mockRejectedValueOnce(new Error('Falla consulta'));

    render(<ListaProductos productos={productosMock} />);

    fireEvent.click(screen.getAllByRole('button', { name: /comprar/i })[0]);
    fireEvent.change(screen.getByLabelText(/nombre del titular/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/número de tarjeta/i), { target: { value: '5407347968812090' } });
    fireEvent.change(screen.getByLabelText(/expiración/i), { target: { value: '1225' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), { target: { value: 'Calle 123' } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: '3110000000' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'juan@example.com' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /siguiente/i })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    const btnConfirmar = await screen.findByRole('button', { name: /confirmar/i });
    fireEvent.click(btnConfirmar);

    const btnVerEstado = await screen.findByRole('button', { name: /refrescar estado/i });
    fireEvent.click(btnVerEstado);

    const mensajeError = await screen.findByText(/no se pudo consultar el estado de la transacción/i);
    expect(mensajeError).toBeInTheDocument();
  });

});
