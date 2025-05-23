import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchProductos } from '../store/productoSlice';
import ListaProductos from '../components/ListaProductos';
import Loader from '../components/Loader';

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector(state => state.productos);

    useEffect(() => {
        dispatch(fetchProductos());
    }, [dispatch]);

    if (loading) return <Loader/>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Tienda Tecnológica Online
                    </h1>
                    <p className="mt-2 text-lg text-gray-500">
                        Explora y adquiere los mejores productos tecnológicos 🔌
                    </p>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 py-10">
                <ListaProductos productos={items} />
            </section>
        </main>
    )
}

export default Home;
