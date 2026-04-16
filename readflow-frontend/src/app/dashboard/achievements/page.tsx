"use client";
import { Box, Typography, Skeleton } from "@mui/material";
import TopBar from "@/components/layout/TopBar";
import AchievementCard from "@/components/gamification/AchievementCard";
import { useGamification } from "@/hooks/useGamification";

const CATEGORIES = [
  { key: "reading", label: "📖 Reading", desc: "Log sessions consistently" },
  { key: "books", label: "📚 Books", desc: "Complete your reading list" },
  { key: "pages", label: "📄 Pages", desc: "Read more pages overall" },
  { key: "streak", label: "🔥 Streaks", desc: "Build daily habits" },
  { key: "special", label: "⭐ Special", desc: "Reach exceptional milestones" },
];

export default function AchievementsPage() {
  const { data, isLoading } = useGamification();

  const unlockedCount =
    data?.achievements.filter((a) => a.unlocked).length ?? 0;
  const totalCount = data?.achievements.length ?? 0;

  return (
    <Box>
      <TopBar title="Achievements" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1200 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            🏆 Achievements
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 15 }}>
            {isLoading ? "..." : `${unlockedCount} of ${totalCount} unlocked`}
          </Typography>

          {!isLoading && data && (
            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              {/* Overall progress bar */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 280,
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid rgba(124,58,237,0.2)",
                  bgcolor: "rgba(124,58,237,0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Overall Progress
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}
                  >
                    {Math.round((unlockedCount / totalCount) * 100)}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(124,58,237,0.1)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${(unlockedCount / totalCount) * 100}%`,
                      borderRadius: 4,
                      background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                      transition: "width 0.8s ease",
                    }}
                  />
                </Box>
                <Typography
                  sx={{ fontSize: 11, color: "text.secondary", mt: 0.75 }}
                >
                  {totalCount - unlockedCount} achievements left to unlock
                </Typography>
              </Box>

              {/* Level + XP summary */}
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  borderRadius: 3,
                  border: "1px solid rgba(245,158,11,0.2)",
                  bgcolor: "rgba(245,158,11,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 20, fontWeight: 900, color: "#fff" }}
                  >
                    {data.level}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      fontWeight: 600,
                    }}
                  >
                    Current Level
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 16, color: "#a78bfa" }}
                  >
                    {data.levelName}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#f59e0b" }}>
                    ⭐ {data.xp.toLocaleString()} XP total
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Achievement groups by category */}
        {isLoading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                sx={{ borderRadius: 3, bgcolor: "rgba(124,58,237,0.08)" }}
              />
            ))}
          </Box>
        ) : (
          CATEGORIES.map((cat) => {
            const catAchievements =
              data?.achievements.filter((a) => a.category === cat.key) ?? [];
            if (!catAchievements.length) return null;
            const catUnlocked = catAchievements.filter(
              (a) => a.unlocked,
            ).length;

            return (
              <Box key={cat.key} sx={{ mb: 5 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {cat.label}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.25,
                      borderRadius: 10,
                      bgcolor: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.2)",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}
                    >
                      {catUnlocked}/{catAchievements.length}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {cat.desc}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 2,
                  }}
                >
                  {catAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.key}
                      achievement={achievement}
                    />
                  ))}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
