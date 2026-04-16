"use client";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { getLevelInfo } from "@/utils/formatters";

const NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    label: "My Books",
    href: "/dashboard/books",
    icon: <LibraryBooksIcon fontSize="small" />,
  },
  {
    label: "Reading Logs",
    href: "/dashboard/logs",
    icon: <HistoryIcon fontSize="small" />,
  },
];

export default function Sidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const levelInfo = getLevelInfo(user?.xp || 0);
  const showTooltip = !open;

  return (
    <Box
      sx={{
        width: open ? 240 : 72,
        transition: "all 0.3s ease",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: "1px solid rgba(124,58,237,0.15)",
        zIndex: 100,
      }}
    >
      {/* Top */}
      <Box sx={{ px: 2, py: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={onToggle}>
          <MenuIcon />
        </IconButton>

        {open && (
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 18,
              background: "linear-gradient(135deg, #a78bfa, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ReadFlow+
          </Typography>
        )}
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, px: 1 }}>
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          const content = (
            <Box
              key={item.href}
              onClick={() => router.push(item.href)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: open ? 1.5 : 0,
                justifyContent: open ? "flex-start" : "center",
                px: open ? 2 : 0,
                py: 1.2,
                borderRadius: 2,
                cursor: "pointer",
                background: active ? "rgba(124,58,237,0.15)" : "transparent",
                color: active ? "primary.main" : "text.secondary",
                "&:hover": { bgcolor: "rgba(124,58,237,0.08)" },
              }}
            >
              {item.icon}
              {open && (
                <Typography sx={{ fontSize: 14 }}>{item.label}</Typography>
              )}
            </Box>
          );

          return showTooltip ? (
            <Tooltip key={item.href} title={item.label} placement="right">
              {content}
            </Tooltip>
          ) : (
            content
          );
        })}
      </Box>

      {/* User */}
      <Box sx={{ p: 1 }}>
        {/* Avatar */}
        {showTooltip ? (
          <Tooltip title={user?.email || ""} placement="right">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 1,
              }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.email?.[0]?.toUpperCase()}
              </Avatar>
            </Box>
          </Tooltip>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 12 }}>{user?.email}</Typography>
              <Chip
                label={`Lv.${user?.level} ${levelInfo.name}`}
                size="small"
              />
            </Box>
          </Box>
        )}

        {/* Logout */}
        {showTooltip ? (
          <Tooltip title="Logout" placement="right">
            <Box
              onClick={() => {
                dispatch(logout());
                router.push("/login");
              }}
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 1,
                cursor: "pointer",
                color: "error.main",
              }}
            >
              <LogoutIcon fontSize="small" />
            </Box>
          </Tooltip>
        ) : (
          <Box
            onClick={() => {
              dispatch(logout());
              router.push("/login");
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              cursor: "pointer",
              color: "error.main",
            }}
          >
            <LogoutIcon fontSize="small" />
            <Typography>Logout</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
