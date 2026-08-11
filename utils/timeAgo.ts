/**
 * Format a date as relative time (e.g., "2h ago", "3d ago")
 */
export const getTimeAgo = (dateString: string): {
  type: 'justNow' | 'minutesAgo' | 'hoursAgo' | 'daysAgo' | 'weeksAgo' | 'monthsAgo' | 'yearsAgo';
  value?: number;
} => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return { type: 'justNow' };
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return { type: 'minutesAgo', value: diffInMinutes };
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return { type: 'hoursAgo', value: diffInHours };
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return { type: 'daysAgo', value: diffInDays };
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return { type: 'weeksAgo', value: diffInWeeks };
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return { type: 'monthsAgo', value: diffInMonths };
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return { type: 'yearsAgo', value: diffInYears };
};
