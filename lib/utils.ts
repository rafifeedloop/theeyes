import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function getRiskColor(score: number): string {
  if (score < 0.3) return 'success'
  if (score < 0.6) return 'warning'
  return 'danger'
}

export function getRiskLabel(score: number): string {
  if (score < 0.3) return 'Low'
  if (score < 0.6) return 'Medium'
  return 'High'
}