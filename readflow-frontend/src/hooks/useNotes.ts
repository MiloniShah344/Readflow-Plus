import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes.service';
import { CreateNoteInput, UpdateNoteInput } from '@/types/notes.types';
import toast from 'react-hot-toast';

export const NOTES_KEY = 'notes';

export function useNotes(bookId: string) {
  return useQuery({
    queryKey: [NOTES_KEY, bookId],
    queryFn: () => notesService.getByBook(bookId),
    enabled: !!bookId,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNoteInput) => notesService.create(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY, vars.bookId] });
      toast.success(vars.isHighlight ? '⭐ Highlight saved!' : '📝 Note saved!');
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to save note'),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput; bookId: string }) =>
      notesService.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY, vars.bookId] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to update note'),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; bookId: string }) => notesService.remove(id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY, vars.bookId] });
      toast.success('Note deleted');
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to delete note'),
  });
}