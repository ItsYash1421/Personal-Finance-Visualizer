import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy');
};

export const formatMonth = (date: string | Date): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM yyyy');
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getLastSixMonths = (): string[] => {
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 5);
  
  return eachMonthOfInterval({
    start: sixMonthsAgo,
    end: today
  }).map(date => format(date, 'yyyy-MM'));
};

export const getMonthYear = (dateString: string): string => {
  return format(parseISO(dateString), 'yyyy-MM');
};