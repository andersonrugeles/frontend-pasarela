import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface ModalErrorProps {
  open: boolean;
  onClose: () => void;
  mensaje: string;
}

const ModalError: React.FC<ModalErrorProps> = ({ open, onClose, mensaje }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color="error">Error</DialogTitle>
      <DialogContent>
        <Typography>{mensaje}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalError;
