"use client";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { getLevelInfo } from "@/utils/formatters";

const NAV = [
  { label: "Dashboard", href: "/", icon: <DashboardIcon fontSize="small" /> },
  {
    label: "My Books",
    href: "/books",
    icon: <LibraryBooksIcon fontSize="small" />,
  },
  {
    label: "Reading Logs",
    href: "/logs",
    icon: <HistoryIcon fontSize="small" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const levelInfo = getLevelInfo(user?.xp || 0);

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(124,58,237,0.15)",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3 }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: 20,
            background:
              "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          📚 ReadFlow+
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#6b6486", mt: 0.25, display: "block" }}
        >
          Gamified reading tracker
        </Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ height: 1, bgcolor: "background.paper", mx: 2 }} />

      {/* Nav */}
      <Box
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Box
              key={item.href}
              onClick={() => router.push(item.href)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: active
                  ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.12))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(124,58,237,0.3)"
                  : "1px solid transparent",
                color: active ? "#a78bfa" : "#9990b8",
                "&:hover": {
                  background: active
                    ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.15))"
                    : "rgba(124,58,237,0.06)",
                  color: active ? "#a78bfa" : "#c4bfe0",
                },
              }}
            >
              <Box
                sx={{ color: "inherit", display: "flex", alignItems: "center" }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: "inherit",
                }}
              >
                {item.label}
              </Typography>
              {active && (
                <Box
                  sx={{
                    ml: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#7c3aed",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Divider */}
      <Box sx={{ height: 1, bgcolor: "background.paper", mx: 2 }} />

      {/* User */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.12)",
            mb: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 14,
              fontWeight: 700,
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            }}
          >
            {user?.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.25 }}
              noWrap
            >
              {user?.email}
            </Typography>
            <Chip
              label={`Lv.${user?.level} ${levelInfo.name}`}
              size="small"
              sx={{
                fontSize: "0.6rem",
                height: 18,
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(124,58,237,0.2))",
                color: "#a78bfa",
                border: "none",
              }}
            />
          </Box>
        </Box>

        <Box
          onClick={() => {
            dispatch(logout());
            router.push("/login");
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1,
            borderRadius: 2,
            cursor: "pointer",
            color: "#ef4444",
            "&:hover": { bgcolor: "rgba(239,68,68,0.08)" },
            transition: "all 0.15s",
          }}
        >
          <LogoutIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 14 }}>Logout</Typography>
        </Box>
      </Box>
    </Box>
  );
}
