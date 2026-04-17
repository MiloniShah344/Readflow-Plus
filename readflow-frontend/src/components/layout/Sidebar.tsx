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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
  {
    label: "Achievements",
    href: "/dashboard/achievements",
    icon: <EmojiEventsIcon fontSize="small" />,
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

  return (
    <Box
      sx={{
        width: open ? 240 : 72,
        transition: "width 0.25s ease",
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
        overflow: "hidden",
      }}
    >
      {/* Logo + Toggle */}
      <Box
        sx={{
          px: open ? 2 : 1.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          onClick={onToggle}
          // size="small"
          sx={{
            color: "#9990b8",
            "&:hover": { color: "text.secondary", bgcolor: "rgba(124,58,237,0.1)" },
            flexShrink: 0,
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        {open && (
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 17,
              background: "linear-gradient(135deg, #a78bfa, #7c3aed, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ReadFlow+
          </Typography>
        )}
      </Box>

      {/* Divider */}
      {/* <Box
        sx={{ height: 1, bgcolor: "background.primary", mx: open ? 2 : 1 }}
      /> */}

      {/* Nav items */}
      <Box
        sx={{
          flex: 1,
          px: 1,
        }}
      >
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          const navItem = (
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
                background: active
                  ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.08))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(124,58,237,0.25)"
                  : "1px solid transparent",
                color: active ? "#8369d3" : "#9990b8",
                transition: "all 0.15s",
                "&:hover": {
                  bgcolor: "rgba(124,58,237,0.08)",
                  color: active ? "#a78bfa" : "text.secondary",
                },
              }}
            >
              <Box
                sx={{
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>
              {open && (
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Typography>
              )}
              {open && active && (
                <Box
                  sx={{
                    ml: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#7c3aed",
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          );

          return !open ? (
            <Tooltip key={item.href} title={item.label} placement="right">
              <Box>{navItem}</Box>
            </Tooltip>
          ) : (
            navItem
          );
        })}
      </Box>

      {/* Divider */}
      <Box
        sx={{ height: 1, bgcolor: "background.primary", mx: open ? 2 : 1 }}
      />

      {/* Streak Counter */}
      {/* <Box sx={{ pt: 1.5 }}>
        <StreakCounter open={open} />
      </Box> */}

      {/* Divider */}
      <Box
        sx={{ height: 1, bgcolor: "background.primary", mx: open ? 2 : 1 }}
      />

      {/* User + Logout */}
      <Box sx={{ p: 1.5 }}>
        {/* Avatar row */}
        {!open ? (
          <Tooltip title={user?.email || ""} placement="right">
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 13,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                }}
              >
                {user?.email?.[0]?.toUpperCase()}
              </Avatar>
            </Box>
          </Tooltip>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.25,
              borderRadius: 2,
              bgcolor: "rgba(124,58,237,0.07)",
              border: "1px solid rgba(124,58,237,0.12)",
              mb: 1,
            }}
          >
            <Avatar
              sx={{
                width: 30,
                height: 30,
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              }}
            >
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}
                noWrap
              >
                {user?.email}
              </Typography>
              <Chip
                label={`Lv.${user?.level} ${levelInfo.name}`}
                size="small"
                sx={{
                  fontSize: "0.58rem",
                  height: 16,
                  mt: 0.25,
                  bgcolor: "rgba(124,58,237,0.25)",
                  color: "text.secondary",
                  border: "none",
                }}
              />
            </Box>
          </Box>
        )}

        {/* Logout */}
        {!open ? (
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
                color: "#ef4444",
                borderRadius: 2,
                "&:hover": { bgcolor: "rgba(239,68,68,0.08)" },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
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
              gap: 1.25,
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              cursor: "pointer",
              color: "#ef4444",
              "&:hover": { bgcolor: "rgba(239,68,68,0.08)" },
              transition: "all 0.15s",
            }}
          >
            <LogoutIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 13 }}>Logout</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
