"use client";
import { Box, Typography, Skeleton } from "@mui/material";
import TopBar from "@/components/layout/TopBar";
import StatsCard from "@/components/dashboard/StatsCard";
import ReadingHeatmap from "@/components/dashboard/ReadingHeatmap";
import MoodChart from "@/components/dashboard/MoodChart";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import BookCard from "@/components/books/BookCard";
import EmptyState from "@/components/ui/EmptyState";
import { useBooks, useBookStats } from "@/hooks/useBooks";
import { useLogs } from "@/hooks/useLogs";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useStreak } from "@/hooks/useStreaks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openAddBookModal, openLogModal } from "@/store/slices/uiSlice";
import { formatDate, formatMinutes } from "@/utils/formatters";
import { MOODS } from "@/constants/moods";
import { useRouter } from "next/navigation";

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  const { data: stats, isLoading: statsLoading } = useBookStats();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: streak } = useStreak();
  const { data: inProgress, isLoading: booksLoading } = useBooks({
    status: "in_progress",
  });
  const { data: recentLogs, isLoading: logsLoading } = useLogs();
  const recent5 = recentLogs?.slice(0, 5);

  const STAT_CARDS = [
    {
      label: "Total Books",
      value: stats?.total ?? 0,
      icon: "📚",
      gradient:
        "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(124,58,237,0.06))",
      border: "rgba(124,58,237,0.3)",
      iconBg: "radial-gradient(circle, rgba(124,58,237,0.5), transparent)",
      valueColor: "#a78bfa",
      sublabel: `${stats?.completed ?? 0} completed`,
      loading: statsLoading,
    },
    {
      label: "Pages Read",
      value: (analytics?.totalPages ?? 0).toLocaleString(),
      icon: "📖",
      gradient:
        "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.04))",
      border: "rgba(16,185,129,0.25)",
      iconBg: "radial-gradient(circle, rgba(16,185,129,0.4), transparent)",
      valueColor: "#10b981",
      sublabel: `${analytics?.totalSessions ?? 0} sessions`,
      loading: analyticsLoading,
    },
    {
      label: "Current Streak",
      value: `${streak?.currentStreak ?? 0}🔥`,
      icon: "🔥",
      gradient:
        "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.06))",
      border: "rgba(239,68,68,0.25)",
      iconBg: "radial-gradient(circle, rgba(239,68,68,0.4), transparent)",
      valueColor: "#ef4444",
      sublabel: `Best: ${streak?.longestStreak ?? 0} days`,
      loading: false,
    },
    {
      label: "Avg Speed",
      value: analytics?.avgSpeed ? `${analytics.avgSpeed}` : "—",
      icon: "⚡",
      gradient:
        "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.04))",
      border: "rgba(245,158,11,0.25)",
      iconBg: "radial-gradient(circle, rgba(245,158,11,0.4), transparent)",
      valueColor: "#f59e0b",
      sublabel: "pages per hour",
      loading: analyticsLoading,
    },
  ];

  return (
    <Box>
      <TopBar title="Dashboard" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1400 }}>
        {/* Welcome */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}
          >
            Good {getGreeting()}, {user?.name || "reader"} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {streak?.currentStreak && streak.currentStreak > 1
              ? `🔥 You're on a ${streak.currentStreak}-day streak — keep it going!`
              : "Ready to turn some pages today?"}
          </Typography>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
            mb: 3,
          }}
        >
          {STAT_CARDS.map((card) => (
            <StatsCard key={card.label} {...card} />
          ))}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
            Library Breakdown
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {/* Completed */}
            <Box
              onClick={() => router.push("/dashboard/books?status=completed")}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontSize: 14 }}>✅</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {stats?.completed ?? 0} Completed
              </Typography>
            </Box>

            {/* In Progress */}
            <Box
            onClick={() => router.push("/dashboard/books?status=in_progress")}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontSize: 14 }}>📖</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {stats?.inProgress ?? 0} In Progress
              </Typography>
            </Box>

            {/* To Read */}
            <Box
              onClick={() => router.push("/dashboard/books?status=to_read")}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontSize: 14 }}>📌</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {stats?.toRead ?? 0} To Read
              </Typography>
            </Box>

            {/* Dropped */}
            <Box
              onClick={() => router.push("/dashboard/books?status=dropped")}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "rgba(107,114,128,0.12)",
                border: "1px solid rgba(107,114,128,0.25)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontSize: 14 }}>🚫</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {stats?.dropped ?? 0} Dropped
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Heatmap */}
        <Box sx={{ mb: 3 }}>
          {analyticsLoading ? (
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: 3, bgcolor: "rgba(124,58,237,0.08)" }}
            />
          ) : (
            <ReadingHeatmap data={analytics?.heatmapData ?? []} />
          )}
        </Box>

        {/* Bottom grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1fr 380px" },
            gap: 3,
          }}
        >
          {/* Left column */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Currently Reading */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📖 Currently Reading
                </Typography>
                <Box
                  onClick={() => dispatch(openAddBookModal())}
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                    "&:hover": { boxShadow: "0 6px 20px rgba(124,58,237,0.6)" },
                    transition: "all 0.15s",
                  }}
                >
                  + Add Book
                </Box>
              </Box>

              {booksLoading ? (
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ borderRadius: 3, bgcolor: "rgba(124,58,237,0.08)" }}
                />
              ) : !inProgress?.length ? (
                <Box
                  sx={{
                    borderRadius: 3,
                    border: "1px solid rgba(124,58,237,0.15)",
                    bgcolor: "rgba(124,58,237,0.03)",
                  }}
                >
                  <EmptyState
                    icon="📚"
                    title="Nothing in progress"
                    description="Add a book and start your reading journey!"
                    actionLabel="Add book"
                    onAction={() => dispatch(openAddBookModal())}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 2,
                  }}
                >
                  {inProgress.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </Box>
              )}
            </Box>

            {/* Weekly chart */}
            {!analyticsLoading && analytics && (
              <WeeklyChart pagesByDayOfWeek={analytics.pagesByDayOfWeek} />
            )}
          </Box>

          {/* Right column */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Mood chart */}
            {!analyticsLoading && analytics ? (
              <MoodChart moodDistribution={analytics.moodDistribution} />
            ) : (
              <Skeleton
                variant="rectangular"
                height={260}
                sx={{ borderRadius: 3, bgcolor: "rgba(124,58,237,0.08)" }}
              />
            )}

            {/* Recent Sessions */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📝 Recent Sessions
                </Typography>
                <Box
                  onClick={() => dispatch(openLogModal(null))}
                  sx={{
                    px: 2,
                    py: 0.75,
                    borderRadius: 2,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#a78bfa",
                    bgcolor: "rgba(124,58,237,0.1)",
                    border: "1px solid rgba(124,58,237,0.25)",
                    "&:hover": { bgcolor: "rgba(124,58,237,0.2)" },
                    transition: "all 0.15s",
                  }}
                >
                  + Log
                </Box>
              </Box>

              <Box
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(124,58,237,0.15)",
                  bgcolor: "rgba(124,58,237,0.02)",
                  overflow: "hidden",
                }}
              >
                {logsLoading ? (
                  [1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={60}
                      sx={{
                        m: 1,
                        borderRadius: 2,
                        bgcolor: "rgba(124,58,237,0.08)",
                      }}
                    />
                  ))
                ) : !recent5?.length ? (
                  <EmptyState
                    icon="📖"
                    title="No sessions yet"
                    description="Log your first reading session!"
                  />
                ) : (
                  recent5.map((log, i) => {
                    const mood = MOODS.find((m) => m.value === log.mood);
                    return (
                      <Box
                        key={log.id}
                        sx={{
                          px: 2.5,
                          py: 1.75,
                          borderBottom:
                            i < recent5.length - 1
                              ? "1px solid rgba(124,58,237,0.08)"
                              : "none",
                          "&:hover": { bgcolor: "rgba(124,58,237,0.04)" },
                          transition: "background 0.15s",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "text.primary",
                              }}
                              noWrap
                            >
                              {log.book?.title || "Unknown"}
                            </Typography>
                            <Typography
                              sx={{ fontSize: 11, color: "text.secondary" }}
                            >
                              {formatDate(log.date)} · {log.pagesRead} pages
                              {log.minutesSpent
                                ? ` · ${formatMinutes(log.minutesSpent)}`
                                : ""}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{ fontSize: 22, ml: 1, lineHeight: 1 }}
                          >
                            {mood?.emoji}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
