'use client';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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

export default function BookCard({ book, onEdit }: { book: Book; onEdit?: (b: Book) => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutate: deleteBook } = useDeleteBook();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const progress = getProgressPercent(book.currentPage, book.totalPages);
  const coverColor = book.coverColor || COVER_COLORS[book.title.charCodeAt(0) % COVER_COLORS.length];

  return (
    <Box
      onClick={() => router.push(`/books/${book.id}`)}
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(124,58,237,0.15)',
        bgcolor: 'rgba(124,58,237,0.03)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        display: 'flex', flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 48px rgba(124,58,237,0.2)',
          borderColor: 'rgba(124,58,237,0.4)',
        },
      }}
    >
      {/* Cover */}
      <Box sx={{
        height: 110,
        background: `linear-gradient(135deg, ${coverColor}99, ${coverColor}44)`,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Typography sx={{ fontSize: 48, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>📖</Typography>
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <BookStatusBadge status={book.status} />
        </Box>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
          sx={{ position: 'absolute', top: 4, right: 4, color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(0,0,0,0.3)' } }}
        >
          <MoreVertIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'text.primary', mb: 0.25, lineHeight: 1.3 }} noWrap>
          {book.title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1.5 }} noWrap>
          {book.author}
        </Typography>

        {book.genre && (
          <Box sx={{
            display: 'inline-block', px: 1, py: 0.25, mb: 1,
            borderRadius: 10, bgcolor: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
          }}>
            <Typography sx={{ fontSize: 10, color: '#a78bfa', fontWeight: 600 }}>{book.genre}</Typography>
          </Box>
        )}

        {book.status === 'in_progress' && book.totalPages && (
          <Box sx={{ mt: 'auto' }}>
            <ProgressBar value={progress} label={`${book.currentPage} / ${book.totalPages} pages`} height={5} showPercent />
          </Box>
        )}

        {book.status === 'completed' && (
          <Typography sx={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
            ✅ {book.totalPages ? `${book.totalPages} pages` : 'Completed'}
          </Typography>
        )}
      </Box>

      {/* Action */}
      {book.status === 'in_progress' && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Box
            onClick={(e) => { e.stopPropagation(); dispatch(openLogModal(book.id)); }}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5,
              py: 1, borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.15))',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#a78bfa', fontWeight: 600, fontSize: 13,
              transition: 'all 0.15s',
              '&:hover': { background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(124,58,237,0.25))' },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 16 }} /> Log Session
          </Box>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(book); setAnchorEl(null); }}>
          <EditIcon sx={{ fontSize: 16, mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${book.title}"?`)) deleteBook(book.id); setAnchorEl(null); }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ fontSize: 16, mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}