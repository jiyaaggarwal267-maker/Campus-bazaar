import { formatDistanceToNow, format } from 'date-fns';

export const timeAgo = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });
export const fullDate = (iso: string) => format(new Date(iso), 'MMM d, yyyy · h:mm a');
export const price = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');
