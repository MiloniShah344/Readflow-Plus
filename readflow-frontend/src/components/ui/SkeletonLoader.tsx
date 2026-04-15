'use client';
import { Box, Skeleton, Grid } from '@mui/material';

export function BookCardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Skeleton variant="rectangular" height={120} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="rectangular" height={6} borderRadius={3} />
        </Box>
      </Box>
    </Box>
  );
}

export function BooksGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <BookCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}