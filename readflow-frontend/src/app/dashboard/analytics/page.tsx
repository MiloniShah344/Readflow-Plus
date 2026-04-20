'use client';
import { Box, Typography, Skeleton } from '@mui/material';
import TopBar from '@/components/layout/TopBar';
import InsightCard from '@/components/analytics/InsightCard';
import ReadingHeatmap from '@/components/dashboard/ReadingHeatmap';
import MoodChart from '@/components/dashboard/MoodChart';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import { useAnalytics, useInsights } from '@/hooks/useAnalytics';

export default function AnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: insights, isLoading: insightsLoading } = useInsights();

  return (
    <Box>
      <TopBar title="Analytics" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1200 }}>

        {/* Insights */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>💡 Your Reading Insights</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: 14 }}>
            Personalized patterns discovered from your reading data
          </Typography>

          {insightsLoading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {[1,2,3].map((i) => <Skeleton key={i} variant="rectangular" height={90} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />)}
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {insights?.map((insight, i) => <InsightCard key={i} insight={insight} />)}
            </Box>
          )}
        </Box>

        {/* Heatmap */}
        <Box sx={{ mb: 3 }}>
          {analyticsLoading ? (
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
          ) : (
            <ReadingHeatmap data={analytics?.heatmapData ?? []} />
          )}
        </Box>

        {/* Charts */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {analyticsLoading ? (
            <>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
            </>
          ) : analytics ? (
            <>
              <WeeklyChart pagesByDayOfWeek={analytics.pagesByDayOfWeek} />
              <MoodChart moodDistribution={analytics.moodDistribution} />
            </>
          ) : null}
        </Box>

        {/* Summary stats */}
        {analytics && (
          <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 2 }}>
            {[
              { label: 'Total Pages', value: analytics.totalPages.toLocaleString(), icon: '📄' },
              { label: 'Total Sessions', value: analytics.totalSessions, icon: '📝' },
              { label: 'Avg Speed', value: analytics.avgSpeed ? `${analytics.avgSpeed} p/h` : '—', icon: '⚡' },
              { label: 'Avg Focus', value: analytics.avgFocus ? `${analytics.avgFocus}/5` : '—', icon: '🎯' },
              { label: 'Active Days', value: analytics.heatmapData.filter((d) => d.count > 0).length, icon: '📅' },
              { label: 'Books Done', value: analytics.completedBooks, icon: '✅' },
            ].map((s) => (
              <Box key={s.label} sx={{
                p: 2, borderRadius: 3,
                border: '1px solid rgba(124,58,237,0.15)',
                bgcolor: 'rgba(124,58,237,0.03)',
                '&:hover': { borderColor: 'rgba(124,58,237,0.3)' },
                transition: 'border-color 0.15s',
              }}>
                <Typography sx={{ fontSize: 22, mb: 0.5 }}>{s.icon}</Typography>
                <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.25 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}