'use client';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import Modal from '@/components/ui/Modal';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLogs } from '@/hooks/useLogs';
import { formatDate, formatMinutes } from '@/utils/formatters';
import { MOODS } from '@/constants/moods';

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

type CalendarValue = Date | [Date, Date] | null;

export default function CalendarPage() {
  const { data: analytics } = useAnalytics();
  const { data: allLogs } = useLogs();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Build activity map from heatmap data
  const activityMap = new Map<string, number>(
    (analytics?.heatmapData ?? []).map((d) => [d.date, d.count]),
  );

  // Logs for selected date
  const logsForDate = selectedDate
    ? (allLogs ?? []).filter((l) => l.date === selectedDate)
    : [];

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setModalOpen(true);
  };

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null;
    const dateStr = date.toISOString().split('T')[0];
    const count = activityMap.get(dateStr) ?? 0;
    if (!count) return null;

    const intensity = count >= 100 ? 4 : count >= 50 ? 3 : count >= 20 ? 2 : 1;
    const colors = ['', 'rgba(124,58,237,0.4)', 'rgba(124,58,237,0.6)', 'rgba(124,58,237,0.8)', '#7c3aed'];

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.25 }}>
        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: colors[intensity] }} />
      </Box>
    );
  }

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return '';
    const dateStr = date.toISOString().split('T')[0];
    return activityMap.has(dateStr) && activityMap.get(dateStr)! > 0 ? 'has-activity' : '';
  }

  const activeDays = analytics?.heatmapData.filter((d) => d.count > 0).length ?? 0;
  const totalPagesThisMonth = (analytics?.heatmapData ?? [])
    .filter((d) => d.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, d) => s + d.count, 0);

  return (
    <Box>
      <TopBar title="Calendar" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 900 }}>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>📅 Reading Calendar</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            Every dot is a day you showed up for your reading habit
          </Typography>
        </Box>

        {/* Stats strip */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
          {[
            { label: 'Total active days', value: activeDays, icon: '📅' },
            { label: 'Pages this month', value: totalPagesThisMonth.toLocaleString(), icon: '📖' },
            { label: 'Books in progress', value: allLogs ? new Set(allLogs.map((l) => l.bookId)).size : 0, icon: '📚' },
          ].map((s) => (
            <Box key={s.label} sx={{
              p: 2, borderRadius: 3,
              border: '1px solid rgba(124,58,237,0.15)',
              bgcolor: 'rgba(124,58,237,0.04)',
              textAlign: 'center',
            }}>
              <Typography sx={{ fontSize: 22, mb: 0.25 }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#a78bfa' }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Calendar */}
        <Box sx={{
          p: 3, borderRadius: 3,
          border: '1px solid rgba(124,58,237,0.15)',
          bgcolor: 'rgba(124,58,237,0.03)',
          '& .has-activity abbr': {
            background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.08))',
            borderRadius: '50%',
            padding: '4px 6px',
          },
        }}>
          <Calendar
            onClickDay={handleDayClick}
            tileContent={tileContent}
            tileClassName={tileClassName}
            maxDate={new Date()}
          />
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Reading activity:</Typography>
          {[
            { color: 'rgba(124,58,237,0.4)', label: '1–19' },
            { color: 'rgba(124,58,237,0.6)', label: '20–49' },
            { color: 'rgba(124,58,237,0.8)', label: '50–99' },
            { color: '#7c3aed', label: '100+' },
          ].map((l) => (
            <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: l.color }} />
              <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{l.label} pages</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Day detail modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDate ? `📅 ${formatDate(selectedDate)}` : ''}
        maxWidth="sm"
      >
        {logsForDate.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 40, mb: 1 }}>😴</Typography>
            <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Rest day</Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>No reading logged on this day</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 0.5 }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 0.5 }}>
              {logsForDate.length} session{logsForDate.length !== 1 ? 's' : ''} · {logsForDate.reduce((s, l) => s + l.pagesRead, 0)} pages total
            </Typography>
            {logsForDate.map((log) => {
              const mood = MOODS.find((m) => m.value === log.mood);
              return (
                <Box key={log.id} sx={{
                  p: 2.5, borderRadius: 2.5,
                  border: '1px solid rgba(124,58,237,0.15)',
                  bgcolor: 'rgba(124,58,237,0.04)',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.25 }}>
                        {log.book?.title || 'Unknown book'}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {log.pagesRead} pages
                        {log.minutesSpent ? ` · ${formatMinutes(log.minutesSpent)}` : ''}
                        {` · Focus ${log.focusLevel}/5`}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 26, lineHeight: 1 }}>{mood?.emoji}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Modal>
    </Box>
  );
}