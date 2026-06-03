import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Build uppercase initials from a full name.
 * "Humayra Nasrin" → "HN". Used by avatar fallbacks across the app.
 */
export function getInitials(name: string, max = 2) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, max)
}
