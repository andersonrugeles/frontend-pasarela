import React, { memo, useCallback, useState } from 'react';
import type { Producto } from '../store/productoSlice';
import ProductoCard from './ProductoCard';
import ModalPago from './Modales/ModalPago';
import { Box } from '@mui/material';
import { actualizarCompra, compraProducto } from '../api/compraApi';
import { initialCliente, type Cliente } from '../types/cliente';
import { consultarTransaccion, crearTransaccion, obtenerTokenPrefirmado, tokenizarTarjeta } from '../api/integration';
import Loader from './Loader';
import ModalResumenPago from './Modales/ModalResumen';
import ModalError from './Modales/ModalError';
import ModalTransaccion from './Modales/ModalTransaccion';
import { initialProducto } from '../types/producto';
import { initialTransaccion, statusLabels, type Transaccion } from '../types/compra';

interface ListaProductosProps {
  productos: Producto[];
}

const ProductoCardMemo = memo(ProductoCard);

const ListaProductos: React.FC<ListaProductosProps> = ({ productos }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalResumen, setModalResumen] = useState(false);
  const [modalTrx, setModalTrx] = useState(false);
  const [statusTrx, setStatusTrx] = useState('PENDING');
  const [modalError, setModalError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transaccion, setTransaccion] = useState<Transaccion>(initialTransaccion);
  const [datosCliente, setDatosCliente] = useState<Cliente>(initialCliente);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto>(initialProducto);
  const [loading, setLoading] = useState(false);
  const handleModal = useCallback((producto: Producto, cantidad: number) => {
    abrirModal(producto, cantidad);
  }, []);

  const abrirModal = (producto: Producto, cantidad: number) => {
    setProductoSeleccionado({ ...producto, cantidad });
    setModalAbierto(true);
  };

  const mostrarModalResumen = (datosCliente: Cliente) => {
    setDatosCliente({ ...datosCliente })
    setModalResumen(true);
  };

  const refreshTrx = async () => {
    try {
      setLoading(true)
      const consultaTransaccion = await consultarTransaccion(transaccion?.id);

      await actualizarCompra({
        cantidad: productoSeleccionado.cantidad,
        direccion: datosCliente.direccion,
        estado: consultaTransaccion?.data?.status,
        nombreCliente: datosCliente.nombre,
        total: transaccion.total
      }, transaccion?.idCompra);


      setModalTrx(true);
      setStatusTrx(consultaTransaccion?.data?.status);
      setLoading(true);

    } catch (error) {
      setError('No se pudo consultar el estado de la transacción.');
      setModalError(true);
    } finally {
      setLoading(false);
    }
  };

  const confirmarCompra = async (total: number) => {
    try {
      setLoading(true)
      const respuestaCompra = await compraProducto({
        productoId: productoSeleccionado?.id,
        cantidad: productoSeleccionado?.cantidad,
        nombreCliente: datosCliente.nombre,
        telefono: datosCliente.telefono,
        email: datosCliente.email,
        direccion: datosCliente.direccion,
        total: productoSeleccionado?.precio
      });

      const [cardToken, prefirmado] = await Promise.all([
        tokenizarTarjeta({
          number: datosCliente.numero,
          cvc: datosCliente.cvv,
          exp_month: datosCliente.fecha?.split('/')[0],
          exp_year: datosCliente.fecha?.split('/')[1],
          card_holder: datosCliente.nombre,
        }),
        obtenerTokenPrefirmado()
      ]);

      const trx = await crearTransaccion({
        acceptance_token: prefirmado,
        customer_email: datosCliente.email,
        amount_in_cents: total,
        payment_method_id: cardToken,
        reference: respuestaCompra.id
      });


      setTransaccion({
        id: trx.data?.id,
        idCompra: respuestaCompra.id,
        total
      });
      setModalResumen(false);
      setModalTrx(true);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setModalError(true)
      setError('Hubo un problema al procesar tu pago. Intenta de nuevo.');
      console.log('Ha ocurrido un error', error)
    }
  };

  if (productos.length === 0) {
    return <p className="text-center mt-6 text-gray-500">No hay productos disponibles.</p>;
  }

  if (loading) return <Loader />;

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
        gap={3}
        p={2}
      >

        {productos.map((producto) => (
          <ProductoCardMemo key={producto.id} producto={producto} onModal={handleModal} />
        ))}
      </Box>
      <ModalPago
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={mostrarModalResumen}
      />
      <ModalResumenPago
        open={modalResumen}
        onClose={() => setModalResumen(false)}
        onConfirmarPago={confirmarCompra}
        producto={productoSeleccionado}
        cantidad={productoSeleccionado.cantidad ?? 0}
      />
      <ModalError
        open={modalError}
        onClose={() => setModalError(false)}
        mensaje={error || ''}
      />
      <ModalTransaccion
        open={modalTrx}
        onClose={() => setModalTrx(false)}
        onRefrescar={refreshTrx}
        status={statusLabels[statusTrx]}
      />
    </>
  );
};

export default ListaProductos;
