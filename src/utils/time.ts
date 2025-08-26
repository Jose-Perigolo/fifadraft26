/**
 * Formats seconds into a human-readable time string
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (e.g., "2h 30m 45s", "1d 5h 15m 30s")
 */
export const formatTimer = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

/**
 * Calculates the time difference in seconds between now and a given date
 * @param date - The date to calculate time difference from
 * @returns Number of seconds elapsed since the given date
 */
export const getTimeSince = (date: Date): number => {
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / 1000);
};
