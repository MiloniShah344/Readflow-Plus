"use client";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Skeleton,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AddIcon from "@mui/icons-material/Add";
import TopBar from "@/components/layout/TopBar";
import { useBooks, useBookStats } from "@/hooks/useBooks";
import { useLogs } from "@/hooks/useLogs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openAddBookModal, openLogModal } from "@/store/slices/uiSlice";
import BookCard from "@/components/books/BookCard";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, formatMinutes } from "@/utils/formatters";
import { MOODS } from "@/constants/moods";

function StatCard({
  label,
  value,
  icon,
  color = "primary.main",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: `${color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data: stats, isLoading: statsLoading } = useBookStats();
  const { data: inProgressBooks, isLoading: booksLoading } = useBooks({
    status: "in_progress",
  });
  const { data: recentLogs, isLoading: logsLoading } = useLogs();

  const recentLogsSlice = recentLogs?.slice(0, 5);

  return (
    <Box>
      <TopBar title="Dashboard" />
      <Box sx={{ px: 4, py: 3 }}>
        {/* Welcome */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Good {getGreeting()}, {user?.email?.split("@")[0]}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ready to read something great today?
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2.5} mb={4}>
          {statsLoading
            ? [1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Skeleton
                    variant="rectangular"
                    height={100}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))
            : [
                {
                  label: "Total Books",
                  value: stats?.total || 0,
                  icon: <MenuBookIcon fontSize="small" />,
                  color: "#6366f1",
                },
                {
                  label: "Completed",
                  value: stats?.completed || 0,
                  icon: <CheckCircleIcon fontSize="small" />,
                  color: "#22c55e",
                },
                {
                  label: "In Progress",
                  value: stats?.inProgress || 0,
                  icon: <AutoStoriesIcon fontSize="small" />,
                  color: "#f59e0b",
                },
                {
                  label: "To Read",
                  value: stats?.toRead || 0,
                  icon: <MenuBookIcon fontSize="small" />,
                  color: "#ec4899",
                },
              ].map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <StatCard {...stat} />
                </Grid>
              ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Currently Reading */}
          <Grid item xs={12} md={7}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600}>
                📖 Currently Reading
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => dispatch(openAddBookModal())}
                sx={{ borderRadius: 2 }}
              >
                Add Book
              </Button>
            </Box>

            {booksLoading ? (
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 3 }}
              />
            ) : !inProgressBooks?.length ? (
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                }}
              >
                <EmptyState
                  icon="📚"
                  title="Nothing in progress"
                  description="Add a book and start reading!"
                  actionLabel="Add your first book"
                  onAction={() => dispatch(openAddBookModal())}
                />
              </Card>
            ) : (
              <Grid container spacing={2}>
                {inProgressBooks.map((book) => (
                  <Grid item xs={12} sm={6} key={book.id}>
                    <BookCard book={book} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Recent Logs */}
          <Grid item xs={12} md={5}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6" fontWeight={600}>
                📝 Recent Sessions
              </Typography>
              <Button
                size="small"
                onClick={() => dispatch(openLogModal(null))}
                sx={{ borderRadius: 2 }}
              >
                + Log
              </Button>
            </Box>

            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              {logsLoading ? (
                <Box sx={{ p: 2 }}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={56}
                      sx={{ mb: 1, borderRadius: 2 }}
                    />
                  ))}
                </Box>
              ) : !recentLogsSlice?.length ? (
                <EmptyState
                  icon="📖"
                  title="No sessions yet"
                  description="Log your first reading session!"
                />
              ) : (
                <Box>
                  {recentLogsSlice.map((log, i) => {
                    const moodConfig = MOODS.find((m) => m.value === log.mood);
                    return (
                      <Box
                        key={log.id}
                        px={2}
                        py={1.5}
                        sx={{
                          borderBottom:
                            i < recentLogsSlice.length - 1
                              ? "1px solid"
                              : "none",
                          borderColor: "divider",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              noWrap
                              maxWidth={180}
                            >
                              {log.book?.title || "Unknown book"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(log.date)} · {log.pagesRead} pages
                              {log.minutesSpent
                                ? ` · ${formatMinutes(log.minutesSpent)}`
                                : ""}
                            </Typography>
                          </Box>
                          <Typography fontSize={20} title={moodConfig?.label}>
                            {moodConfig?.emoji}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
