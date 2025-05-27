import React, { useState } from 'react';
import type { Producto } from '../store/productoSlice';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    TextField,
    Stack,
    Chip,
} from '@mui/material';

interface ProductoCardProps {
    producto: Producto;
    onModal: (producto: Producto, cantidad: number) => void
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto, onModal }) => {
    const [cantidades, setCantidades] = useState<Record<string, number>>({});

    const handleCantidadChange = (id: string, value: number) => {
        if (value < 1) return;
        const stock = producto.stock ?? 0;
        if (value > stock) return;
        setCantidades(prev => ({ ...prev, [id]: value }));
    };

    return (


        <Card key={producto.id} sx={{ maxWidth: 300, mx: 'auto', display: 'flex', flexDirection: 'column' }}>
            {producto.imagen && (
                <CardMedia
                    component="img"
                    height="160"
                    image={producto.imagen}
                    alt={producto.nombre}
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                    {producto.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {producto.descripcion}
                </Typography>
                <Typography variant="subtitle1" color="primary" mt={1} fontWeight="bold">
                    ${producto.precio}
                </Typography>

                <Chip
                    label={producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                    color={producto.stock > 0 ? 'success' : 'error'}
                    sx={{ mt: 1 }}
                />

                <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                    <TextField
                        type="number"
                        label="Cantidad"
                        size="small"
                        inputProps={{ min: 1, max: producto.stock }}
                        value={cantidades[producto.id] ?? 1}
                        onChange={(e) => handleCantidadChange(producto.id, Number(e.target.value))}
                        sx={{ width: 80 }}
                        disabled={producto.stock === 0}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={producto.stock === 0}
                        sx={{ flexGrow: 1 }}
                        onClick={() => onModal({ ...producto }, cantidades[producto.id] ?? 1)}
                    >
                        Comprar
                    </Button>
                </Stack>
            </CardContent>
        </Card>


    );
};

export default ProductoCard;
