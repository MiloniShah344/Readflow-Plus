'use client';
import {
  Box,
  Grid,
  Typography,
  Fab,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
import BookForm from '@/components/books/BookForm';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { BooksGridSkeleton } from '@/components/ui/SkeletonLoader';
import { useBooks } from '@/hooks/useBooks';
import { useAppDispatch } from '@/store/hooks';
import { openAddBookModal } from '@/store/slices/uiSlice';
import { Book } from '@/types/book.types';

export default function BooksPage() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { data: books, isLoading } = useBooks(status ? { status } : undefined);

  const filtered = books?.filter((b) =>
    search
      ? b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  return (
    <Box>
      <TopBar title="My Books" />
      <Box sx={{ px: 4, py: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              📚 My Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {books?.length || 0} book{books?.length !== 1 ? 's' : ''} total
            </Typography>
          </Box>
          <BookFilters
            status={status}
            onStatusChange={setStatus}
            search={search}
            onSearchChange={setSearch}
          />
        </Box>

        {/* Books Grid */}
        {isLoading ? (
          <BooksGridSkeleton />
        ) : !filtered?.length ? (
          <EmptyState
            icon="😢"
            title={search || status ? 'No books found' : 'Your library is empty'}
            description={
              search || status
                ? 'Try adjusting your filters'
                : 'Start building your reading list!'
            }
            actionLabel={!search && !status ? 'Add your first book' : undefined}
            onAction={
              !search && !status ? () => dispatch(openAddBookModal()) : undefined
            }
          />
        ) : (
          <Grid container spacing={3}>
            {filtered.map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <BookCard book={book} onEdit={setEditingBook} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Add Button */}
        <Tooltip title="Add new book" placement="left">
          <Fab
            color="primary"
            onClick={() => dispatch(openAddBookModal())}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Edit Modal */}
      <Modal
        open={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="Edit Book ✏️"
        maxWidth="sm"
      >
        {editingBook && (
          <BookForm
            book={editingBook}
            onSuccess={() => setEditingBook(null)}
            onCancel={() => setEditingBook(null)}
          />
        )}
      </Modal>
    </Box>
  );
}