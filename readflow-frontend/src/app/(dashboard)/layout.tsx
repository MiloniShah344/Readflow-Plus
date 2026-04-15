'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import Sidebar from '@/components/layout/Sidebar';
import Modal from '@/components/ui/Modal';
import BookForm from '@/components/books/BookForm';
import LogForm from '@/components/logs/LogForm';
import { closeAddBookModal, closeLogModal } from '@/store/slices/uiSlice';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { isAddBookModalOpen, isLogModalOpen, selectedBookId } = useAppSelector((s) => s.ui);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { const t = setTimeout(() => setHydrated(true), 150); return () => clearTimeout(t); }, []);

  useEffect(() => { if (hydrated && !isAuthenticated) router.replace('/login'); }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#07070d' }}>
      <CircularProgress sx={{ color: '#7c3aed' }} />
    </Box>
  );

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: '240px', minHeight: '100vh', overflow: 'auto' }}>
        {children}
      </Box>

      <Modal open={isAddBookModalOpen} onClose={() => dispatch(closeAddBookModal())} title="📚 Add New Book" maxWidth="sm">
        <BookForm onSuccess={() => dispatch(closeAddBookModal())} onCancel={() => dispatch(closeAddBookModal())} />
      </Modal>

      <Modal open={isLogModalOpen} onClose={() => dispatch(closeLogModal())} title="📖 Log Reading Session" maxWidth="sm">
        <LogForm defaultBookId={selectedBookId} onSuccess={() => dispatch(closeLogModal())} onCancel={() => dispatch(closeLogModal())} />
      </Modal>
    </Box>
  );
}