'use client';
import { Box, Skeleton } from '@mui/material';

export function BookCardSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.12)', bgcolor: 'rgba(124,58,237,0.03)' }}>
      <Skeleton variant="rectangular" height={120} sx={{ bgcolor: 'rgba(124,58,237,0.08)' }} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', bgcolor: 'rgba(124,58,237,0.08)' }} width="80%" />
        <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(124,58,237,0.06)' }} />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="rectangular" height={6} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
        </Box>
      </Box>
    </Box>
  );
}

export function BooksGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 3 }}>
      {Array.from({ length: count }).map((_, i) => <BookCardSkeleton key={i} />)}
    </Box>
  );
}