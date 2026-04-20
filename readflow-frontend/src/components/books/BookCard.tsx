"use client";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useState } from "react";
import { Book, BookStatus } from "@/types/book.types";
import BookStatusBadge from "./BookStatusBadge";
import ProgressBar from "../ui/ProgressBar";
import { getProgressPercent } from "@/utils/formatters";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openLogModal } from "@/store/slices/uiSlice";
import { useDeleteBook, useUpdateBook } from "@/hooks/useBooks";
import { useRouter } from "next/navigation";
import { COVER_COLORS } from "@/constants/levels";

const STATUS_OPTIONS: {
  value: BookStatus;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}[] = [
  {
    value: "to_read",
    label: "To Read",
    emoji: "📌",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
  },
  {
    value: "in_progress",
    label: "In Progress",
    emoji: "📖",
    color: "#a78bfa",
    bg: "rgba(124,58,237,0.15)",
  },
  {
    value: "completed",
    label: "Completed",
    emoji: "✅",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
  {
    value: "dropped",
    label: "Dropped",
    emoji: "😅",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
];

export default function BookCard({
  book,
  onEdit,
}: {
  book: Book;
  onEdit?: (b: Book) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutate: deleteBook } = useDeleteBook();
  const { mutate: updateBook, isPending: isUpdating } = useUpdateBook();
  const themeMode = useAppSelector((s) => s.theme.mode);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);

  const progress = getProgressPercent(book.currentPage, book.totalPages);
  const coverColor =
    book.coverColor ||
    COVER_COLORS[book.title.charCodeAt(0) % COVER_COLORS.length];

  const handleStatusChange = (newStatus: BookStatus) => {
    if (newStatus === book.status) {
      setStatusAnchor(null);
      return;
    }
    updateBook({ id: book.id, data: { status: newStatus } });
    setStatusAnchor(null);
  };

  return (
    <>
      <Box
        onClick={() => router.push(`/dashboard/books/${book.id}`)}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(124,58,237,0.15)",
          bgcolor: "rgba(124,58,237,0.03)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.25s ease",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(124,58,237,0.2)",
            borderColor: "rgba(124,58,237,0.4)",
          },
        }}
      >
        {/* Cover */}
        <Box
          sx={{
            height: 110,
            background: `linear-gradient(135deg, ${coverColor}99, ${coverColor}44)`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 48,
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
            }}
          >
            📖
          </Typography>

          {/* Clickable status badge */}
          <Tooltip title="Click to change status" placement="top">
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setStatusAnchor(e.currentTarget);
              }}
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                cursor: "pointer",
                transition: "transform 0.15s",
                "&:hover": { transform: "scale(1.06)" },
              }}
            >
              {isUpdating ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.4,
                    borderRadius: 10,
                    bgcolor: "rgba(0,0,0,0.4)",
                  }}
                >
                  <CircularProgress size={10} sx={{ color: "#fff" }} />
                  <Typography
                    sx={{ fontSize: 10, color: "#fff", fontWeight: 600 }}
                  >
                    Updating…
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.4,
                    borderRadius: 10,
                    bgcolor: "rgba(0, 0, 0, 0.11)",
                    backdropFilter: "blur(4px)",
                    // border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <BookStatusBadge status={book.status} />
                  {/* <SwapHorizIcon
                    sx={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.7)",
                      ml: 0.25,
                    }}
                  /> */}
                </Box>
              )}
            </Box>
          </Tooltip>

          {/* More menu */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
            sx={{
              position: "absolute",
              top: 5,
              right: 4,
              color: "rgba(255,255,255,0.8)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.3)" },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, flex: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: 15, mb: 0.25, lineHeight: 1.3 }}
            noWrap
          >
            {book.title}
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}
            noWrap
          >
            {book.author}
          </Typography>

          {book.genre && (
            <Box
              sx={{
                display: "inline-block",
                px: 1,
                py: 0.25,
                mb: 1,
                borderRadius: 10,
                bgcolor: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <Typography
                sx={{ fontSize: 10, color: "#a78bfa", fontWeight: 600 }}
              >
                {book.genre}
              </Typography>
            </Box>
          )}

          {book.status === "in_progress" && book.totalPages && (
            <ProgressBar
              value={progress}
              label={`${book.currentPage} / ${book.totalPages} pages`}
              height={5}
              showPercent
            />
          )}

          {book.status === "completed" && (
            <Typography
              sx={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}
            >
              ✅ {book.totalPages ? `${book.totalPages} pages` : "Completed"}
            </Typography>
          )}

          {book.status === "to_read" && (
            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
              {book.totalPages ? `${book.totalPages} pages · ` : ""}
              {book.expectedCompletionDate
                ? `Target: ${new Date(book.expectedCompletionDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : "Not started yet"}
            </Typography>
          )}

          {book.status === "dropped" && (
            <Typography sx={{ fontSize: 11, color: "#ef4444" }}>
              Dropped at page {book.currentPage}
            </Typography>
          )}
        </Box>

        {/* Log session button */}
        {book.status === "in_progress" && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openLogModal(book.id));
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                py: 1,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.15))",
                border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.15s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(124,58,237,0.25))",
                },
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 16 }} /> Log Session
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Status Change Popover ─────────────────────────────────────────────── */}
      <Popover
        open={!!statusAnchor}
        anchorEl={statusAnchor}
        onClose={() => setStatusAnchor(null)}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              p: 1,
              borderRadius: 2.5,
              bgcolor: "background.paper",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124,58,237,0.2)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              minWidth: 190,
            },
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 800,
            color: "#6b6486",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            px: 1.5,
            py: 0.75,
          }}
        >
          Change Status
        </Typography>
        {STATUS_OPTIONS.map((opt) => {
          const isCurrent = book.status === opt.value;
          return (
            <Box
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                cursor: isCurrent ? "default" : "pointer",
                bgcolor: isCurrent ? opt.bg : "transparent",
                border: isCurrent
                  ? `1px solid ${opt.color}30`
                  : "1px solid transparent",
                transition: "all 0.15s",
                "&:hover": !isCurrent ? { bgcolor: opt.bg } : {},
              }}
            >
              <Typography sx={{ fontSize: 16, lineHeight: 1 }}>
                {opt.emoji}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent ? opt.color : "text.secondary",
                  flex: 1,
                }}
              >
                {opt.label}
              </Typography>
              {isCurrent && (
                <CheckIcon sx={{ fontSize: 14, color: opt.color }} />
              )}
            </Box>
          );
        })}
      </Popover>

      {/* ── Context Menu ─────────────────────────────────────────────────────── */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "rgba(12,11,22,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 2,
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(book);
            setMenuAnchor(null);
          }}
          sx={{
            fontSize: 13,
            gap: 1,
            color: "text.primary",
            borderRadius: 1.5,
            mx: 0.5,
          }}
        >
          <EditIcon sx={{ fontSize: 16, color: "#a78bfa" }} /> Edit details
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete "${book.title}"? This cannot be undone.`))
              deleteBook(book.id);
            setMenuAnchor(null);
          }}
          sx={{
            fontSize: 13,
            gap: 1,
            color: "#ef4444",
            borderRadius: 1.5,
            mx: 0.5,
          }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} /> Delete book
        </MenuItem>
      </Menu>
    </>
  );
}
