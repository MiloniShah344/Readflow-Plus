'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import Sidebar from '@/components/layout/Sidebar';
import Modal from '@/components/ui/Modal';
import BookForm from '@/components/books/BookForm';
import LogForm from '@/components/logs/LogForm';
import {
  closeAddBookModal,
  closeLogModal,
} from '@/store/slices/uiSlice';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);
  const { isAddBookModalOpen, isLogModalOpen, selectedBookId } =
    useAppSelector((s) => s.ui);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for auth hydration from localStorage
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '260px',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {/* Global Add Book Modal */}
      <Modal
        open={isAddBookModalOpen}
        onClose={() => dispatch(closeAddBookModal())}
        title="Add New Book 📚"
        maxWidth="sm"
      >
        <BookForm
          onSuccess={() => dispatch(closeAddBookModal())}
          onCancel={() => dispatch(closeAddBookModal())}
        />
      </Modal>

      {/* Global Log Session Modal */}
      <Modal
        open={isLogModalOpen}
        onClose={() => dispatch(closeLogModal())}
        title="Log Reading Session 📖"
        maxWidth="sm"
      >
        <LogForm
          defaultBookId={selectedBookId}
          onSuccess={() => dispatch(closeLogModal())}
          onCancel={() => dispatch(closeLogModal())}
        />
      </Modal>
    </Box>
  );
}