import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksService } from '@/services/books.service';
import { CreateBookInput, UpdateBookInput } from '@/types/book.types';
import toast from 'react-hot-toast';

export const BOOKS_KEY = 'books';

export function useBooks(params?: { status?: string; genre?: string }) {
  return useQuery({
    queryKey: [BOOKS_KEY, params],
    queryFn: () => booksService.getAll(params),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: [BOOKS_KEY, id],
    queryFn: () => booksService.getOne(id),
    enabled: !!id,
  });
}

export function useBookStats() {
  return useQuery({
    queryKey: [BOOKS_KEY, 'stats'],
    queryFn: () => booksService.getStats(),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookInput) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      toast.success('📚 Book added to your library!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add book');
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookInput }) =>
      booksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      toast.success('Book updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update book');
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => booksService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      toast.success('Book removed from library');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete book');
    },
  });
}