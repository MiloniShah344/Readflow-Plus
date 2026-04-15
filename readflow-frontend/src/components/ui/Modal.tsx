'use client';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export default function Modal({ open, onClose, title, children, maxWidth = 'sm' }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth
      slotProps={{ paper: {sx: { background: 'rgba(12,11,22,0.98)', backdropFilter: 'blur(20px)' }} }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 3, px: 3 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>{title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9990b8', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Box sx={{ pt: 1 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
}