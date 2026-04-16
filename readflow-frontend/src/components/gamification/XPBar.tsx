"use client";
import { Box, Typography, Tooltip } from "@mui/material";
import { useGamification } from "@/hooks/useGamification";

export default function XPBar({ open }: { open: boolean }) {
  const { data } = useGamification();

  if (!data) return null;

  const { xp, level, levelName, currentLevelMinXp, nextLevelXp } = data;
  const progress =
    nextLevelXp === xp
      ? 100
      : Math.round(
          ((xp - currentLevelMinXp) / (nextLevelXp - currentLevelMinXp)) * 100,
        );
  const xpIntoLevel = xp - currentLevelMinXp;
  const xpNeeded = nextLevelXp - currentLevelMinXp;

  if (!open) {
    return (
      <Tooltip
        title={`Level ${level} — ${xpIntoLevel}/${xpNeeded} XP`}
        placement="right"
      >
        <Box
          sx={{
            mx: "auto",
            my: 1,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
          }}
        >
          <Typography
            sx={{ fontSize: 13, fontWeight: 900, color: "#fff", lineHeight: 1 }}
          >
            {level}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        mx: 1.5,
        mb: 1,
        p: 2,
        borderRadius: 2.5,
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
        border: "1px solid rgba(124,58,237,0.2)",
      }}
    >
      {/* Level badge + name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {level}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                color: "#6b6486",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              Level {level}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "#a78bfa",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {levelName}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 11, color: "#9990b8", fontWeight: 500 }}>
          ⭐ {xp.toLocaleString()}
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ position: "relative", mb: 0.75 }}>
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(124,58,237,0.12)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${Math.min(progress, 100)}%`,
              borderRadius: 3,
              background: "linear-gradient(90deg, #7c3aed, #a78bfa, #f59e0b)",
              transition: "width 0.6s ease",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: "rgba(255,255,255,0.5)",
                borderRadius: "0 3px 3px 0",
              },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 10, color: "#6b6486" }}>
          {xpIntoLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </Typography>
        <Typography sx={{ fontSize: 10, color: "#a78bfa", fontWeight: 600 }}>
          {progress}%
        </Typography>
      </Box>
    </Box>
  );
}
