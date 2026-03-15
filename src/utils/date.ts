export const getTodayKey = () => new Date().toISOString().split('T')[0];

export const getYesterdayKey = () => new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const sameCalendarDay = (left: string, right: string) => left.slice(0, 10) === right.slice(0, 10);
