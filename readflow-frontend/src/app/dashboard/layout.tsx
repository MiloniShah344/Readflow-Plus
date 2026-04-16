"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Sidebar from "@/components/layout/Sidebar";
import Modal from "@/components/ui/Modal";
import BookForm from "@/components/books/BookForm";
import LogForm from "@/components/logs/LogForm";
import { closeAddBookModal, closeLogModal } from "@/store/slices/uiSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { isAddBookModalOpen, isLogModalOpen, selectedBookId } = useAppSelector(
    (s) => s.ui,
  );
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace("/login");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated)
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#07070d",
        }}
      >
        <CircularProgress sx={{ color: "#7c3aed" }} />
      </Box>
    );

  if (!isAuthenticated) return null;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? "240px" : "72px",
          transition: "all 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {/* Top bar
        <Box sx={{ p: 2 }}>
          <IconButton onClick={() => setSidebarOpen((prev) => !prev)}>
            <MenuIcon />
          </IconButton>
        </Box> */}

        {children}
      </Box>

      {/* Modals */}
      <Modal
        open={isAddBookModalOpen}
        onClose={() => dispatch(closeAddBookModal())}
        title="📚 Add New Book"
        maxWidth="sm"
      >
        <BookForm
          onSuccess={() => dispatch(closeAddBookModal())}
          onCancel={() => dispatch(closeAddBookModal())}
        />
      </Modal>

      <Modal
        open={isLogModalOpen}
        onClose={() => dispatch(closeLogModal())}
        title="📖 Log Reading Session"
        maxWidth="sm"
      >
        <LogForm
          defaultBookId={selectedBookId}
          onSuccess={() => dispatch(closeLogModal())}
          onCancel={() => dispatch(closeLogModal())}
        />
      </Modal>
    </Box>
  );
}
