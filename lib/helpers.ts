import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} mins ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  } else {
    return formatDate(date);
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() || '';
  const last = lastName?.charAt(0).toUpperCase() || '';
  return first + last || 'U';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Campaign status
    DRAFT: 'bg-gray-100 text-gray-700',
    OPEN: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
    // Application status
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    WITHDRAWN: 'bg-gray-100 text-gray-700',
    NEGOTIATING: 'bg-blue-100 text-blue-700',
    // Collaboration status
    ACTIVE: 'bg-blue-100 text-blue-700',
    SUBMITTED: 'bg-purple-100 text-purple-700',
    APPROVED: 'bg-green-100 text-green-700',
    DISPUTED: 'bg-red-100 text-red-700',
    // Payment status
    ESCROW: 'bg-yellow-100 text-yellow-700',
    RELEASED: 'bg-green-100 text-green-700',
    REFUNDED: 'bg-gray-100 text-gray-700',
    FAILED: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    WITHDRAWN: 'Withdrawn',
    NEGOTIATING: 'Negotiating',
    ACTIVE: 'Active',
    SUBMITTED: 'Submitted',
    APPROVED: 'Approved',
    DISPUTED: 'Disputed',
    ESCROW: 'In Escrow',
    RELEASED: 'Released',
    REFUNDED: 'Refunded',
    FAILED: 'Failed',
  };
  return labels[status] || status;
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: '📸',
    tiktok: '🎵',
    youtube: '📺',
    twitter: '🐦',
    pinterest: '📌',
    snapchat: '👻',
    twitch: '🎮',
  };
  return icons[platform.toLowerCase()] || '📱';
}
