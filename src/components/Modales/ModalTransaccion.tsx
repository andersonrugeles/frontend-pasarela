import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface ModalTransaccionProps {
  open: boolean;
  onClose: () => void;
  onRefrescar: () => void;
  status:string;
}

const ModalTransaccion: React.FC<ModalTransaccionProps> = ({
  open,
  onClose,
  onRefrescar,
  status
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <HourglassEmptyIcon color="warning" />
          Transacción {status}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Tu transacción se encuentra en estado <strong>{status}</strong>. Puedes esperar o refrescar el estado para obtener una respuesta actualizada.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="contained" color="primary" onClick={onRefrescar}>
          Refrescar estado
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalTransaccion;
