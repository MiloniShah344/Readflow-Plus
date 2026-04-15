'use client';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Rating,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { Book } from '@/types/book.types';
import BookStatusBadge from './BookStatusBadge';
import ProgressBar from '../ui/ProgressBar';
import { getProgressPercent } from '@/utils/formatters';
import { useAppDispatch } from '@/store/hooks';
import { openLogModal } from '@/store/slices/uiSlice';
import { useDeleteBook } from '@/hooks/useBooks';
import { useRouter } from 'next/navigation';
import { COVER_COLORS } from '@/constants/levels';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
}

export default function BookCard({ book, onEdit }: BookCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutate: deleteBook } = useDeleteBook();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const progress = getProgressPercent(book.currentPage, book.totalPages);
  const coverColor =
    book.coverColor ||
    COVER_COLORS[book.title.charCodeAt(0) % COVER_COLORS.length];

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = () => {
    if (window.confirm(`Delete "${book.title}"? This cannot be undone.`)) {
      deleteBook(book.id);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit?.(book);
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
      onClick={() => router.push(`/books/${book.id}`)}
      elevation={0}
    >
      {/* Cover */}
      <Box
        sx={{
          height: 120,
          background: `linear-gradient(135deg, ${coverColor}cc, ${coverColor}66)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MenuBookIcon sx={{ fontSize: 48, color: 'white', opacity: 0.6 }} />
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <BookStatusBadge status={book.status} />
        </Box>
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 4, right: 4, color: 'white' }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          noWrap
          title={book.title}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap mb={1}>
          {book.author}
        </Typography>

        {book.genre && (
          <Typography variant="caption" color="text.disabled" display="block" mb={1}>
            {book.genre}
          </Typography>
        )}

        {book.rating && (
          <Rating value={book.rating} readOnly size="small" sx={{ mb: 1 }} />
        )}

        {book.status === 'in_progress' && book.totalPages && (
          <Box sx={{ mt: 1 }}>
            <ProgressBar
              value={progress}
              label={`${book.currentPage} / ${book.totalPages} pages`}
              height={6}
            />
          </Box>
        )}

        {book.status === 'completed' && (
          <Typography variant="caption" color="success.main" fontWeight={600}>
            ✅ {book.totalPages ? `${book.totalPages} pages` : 'Completed'}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        {book.status === 'in_progress' && (
          <Button
            size="small"
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(openLogModal(book.id));
            }}
          >
            📖 Log Session
          </Button>
        )}
        {book.status === 'to_read' && (
          <Button
            size="small"
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 2, fontSize: '0.75rem' }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/books/${book.id}`);
            }}
          >
            View Details
          </Button>
        )}
      </CardActions>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}