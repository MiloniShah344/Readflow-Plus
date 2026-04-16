"use client";
import { Box, Typography, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { GamificationAchievement } from "@/types/gamification.types";

const CATEGORY_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  reading: {
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    text: "#60a5fa",
  },
  books: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    text: "#34d399",
  },
  pages: {
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.25)",
    text: "#a78bfa",
  },
  streak: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    text: "#f87171",
  },
  special: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    text: "#fbbf24",
  },
};

interface Props {
  achievement: GamificationAchievement;
}

export default function AchievementCard({ achievement }: Props) {
  const { unlocked, name, description, icon, xpReward, category, unlockedAt } =
    achievement;
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.special;

  const dateStr = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Tooltip
      title={unlocked ? `Unlocked: ${dateStr}` : "Keep reading to unlock this!"}
      placement="top"
    >
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1px solid ${unlocked ? colors.border : "rgba(124,58,237,0.08)"}`,
          bgcolor: unlocked ? colors.bg : "rgba(124,58,237,0.02)",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.25s ease",
          filter: unlocked ? "none" : "grayscale(0.7)",
          opacity: unlocked ? 1 : 0.6,
          cursor: "default",
          "&:hover": unlocked
            ? {
                transform: "translateY(-3px)",
                boxShadow: `0 8px 24px ${colors.border}`,
                opacity: 1,
              }
            : { opacity: 0.75 },
        }}
      >
        {/* Lock overlay */}
        {!unlocked && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockIcon sx={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
          </Box>
        )}

        {/* Decorative background circle */}
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: unlocked
              ? `radial-gradient(circle, ${colors.border}, transparent)`
              : "transparent",
            opacity: 0.3,
          }}
        />

        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            border: `1px solid ${unlocked ? colors.border : "rgba(124,58,237,0.12)"}`,
            bgcolor: unlocked ? `${colors.bg}` : "rgba(124,58,237,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.5,
            fontSize: 26,
          }}
        >
          {icon}
        </Box>

        {/* Name */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 14,
            color: unlocked ? "text.primary" : "text.secondary",
            mb: 0.5,
          }}
        >
          {name}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: 11,
            color: "text.secondary",
            mb: 1.5,
            lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 10,
              bgcolor: unlocked ? `${colors.bg}` : "rgba(124,58,237,0.06)",
              border: `1px solid ${unlocked ? colors.border : "rgba(124,58,237,0.1)"}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: unlocked ? colors.text : "#6b6486",
              }}
            >
              +{xpReward} XP
            </Typography>
          </Box>

          {unlocked && dateStr && (
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              ✅ {dateStr}
            </Typography>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
}
