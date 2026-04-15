"use client";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TopBar from "@/components/layout/TopBar";
import EmptyState from "@/components/ui/EmptyState";
import { useLogs } from "@/hooks/useLogs";
import { useAppDispatch } from "@/store/hooks";
import { openLogModal } from "@/store/slices/uiSlice";
import { formatDate, formatMinutes } from "@/utils/formatters";
import { MOODS } from "@/constants/moods";

export default function LogsPage() {
  const dispatch = useAppDispatch();
  const { data: logs, isLoading } = useLogs();

  return (
    <Box>
      <TopBar title="Reading Logs" />
      <Box sx={{ px: 4, py: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              📝 Reading Sessions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {logs?.length || 0} session{logs?.length !== 1 ? "s" : ""} logged
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(openLogModal(null))}
            sx={{ borderRadius: 2 }}
          >
            Log Session
          </Button>
        </Box>

        {isLoading ? (
          <Typography color="text.secondary">Loading sessions...</Typography>
        ) : !logs?.length ? (
          <EmptyState
            icon="📖"
            title="No sessions logged yet"
            description="Start tracking how much you read every day!"
            actionLabel="Log your first session"
            onAction={() => dispatch(openLogModal(null))}
          />
        ) : (
          <Grid container spacing={2}>
            {logs.map((log) => {
              const moodConfig = MOODS.find((m) => m.value === log.mood);
              return (
                <Grid item xs={12} sm={6} md={4} key={log.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      "&:hover": { borderColor: "primary.main" },
                      transition: "border-color 0.15s",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={1}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(log.date)}
                        </Typography>
                        <Typography fontSize={20}>
                          {moodConfig?.emoji}
                        </Typography>
                      </Box>

                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                        sx={{ mb = 0.5 }}
                      >
                        {log.book?.title || "Unknown book"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1.5}
                      >
                        by {log.book?.author}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={`📄 ${log.pagesRead} pages`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {log.minutesSpent && (
                          <Chip
                            label={`⏱️ ${formatMinutes(log.minutesSpent)}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          label={`🎯 Focus ${log.focusLevel}/5`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
