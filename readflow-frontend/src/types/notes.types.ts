export interface Note {
  id: string;
  content: string;
  isHighlight: boolean;
  bookId: string;
  userId: string;
  createdAt: string;
}

export interface CreateNoteInput {
  bookId: string;
  content: string;
  isHighlight?: boolean;
}

export interface UpdateNoteInput {
  content?: string;
  isHighlight?: boolean;
}