/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Box, Typography, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import BookCard from "@/components/books/BookCard";
import BookFilters from "@/components/books/BookFilters";
import BookForm from "@/components/books/BookForm";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { BooksGridSkeleton } from "@/components/ui/SkeletonLoader";
import { useBooks } from "@/hooks/useBooks";
import { useAppDispatch } from "@/store/hooks";
import { openAddBookModal } from "@/store/slices/uiSlice";
import { Book } from "@/types/book.types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function BooksPage() {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { data: books, isLoading } = useBooks(status ? { status } : undefined);

  const filtered = books?.filter((b) =>
    search
      ? b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const statusFromUrl = searchParams.get("status");
    if (statusFromUrl) {
      setStatus(statusFromUrl);
    }
  }, [searchParams]);

  return (
    <Box>
      <TopBar title="My Books" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.25 }}>
              📚 My Library
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {books?.length || 0} book{books?.length !== 1 ? "s" : ""} in your
              collection
            </Typography>
          </Box>
          <BookFilters
            status={status}
            onStatusChange={setStatus}
            search={search}
            onSearchChange={setSearch}
          />
        </Box>

        {isLoading ? (
          <BooksGridSkeleton />
        ) : !filtered?.length ? (
          <EmptyState
            icon={search || status ? "🔍" : "😢"}
            title={
              search || status
                ? "No books match your filters"
                : "Your library is empty"
            }
            description={
              search || status
                ? "Try a different search or filter"
                : "Start building your reading collection!"
            }
            actionLabel={!search && !status ? "Add your first book" : undefined}
            onAction={
              !search && !status
                ? () => dispatch(openAddBookModal())
                : undefined
            }
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: 3,
            }}
          >
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} onEdit={setEditingBook} />
            ))}
          </Box>
        )}

        <Tooltip title="Add new book" placement="left">
          <Fab
            color="primary"
            onClick={() => dispatch(openAddBookModal())}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
              "&:hover": { boxShadow: "0 12px 32px rgba(124,58,237,0.7)" },
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Modal
        open={!!editingBook}
        onClose={() => setEditingBook(null)}
        title="✏️ Edit Book"
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
