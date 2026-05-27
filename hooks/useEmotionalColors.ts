/**
 * Emotional Color Intelligence
 * Shifts CSS custom properties based on time of day to create
 * a mood-aware color environment that feels alive.
 */

import { useEffect } from 'react';

interface TimeSlot {
  label: string;
  // accent gradient stops (indigo-like primary, purple-like secondary, pink tertiary)
  primary: string;
  secondary: string;
  tertiary: string;
  blob1: string;
  blob2: string;
  blob3: string;
}

const TIME_SLOTS: { startHour: number; slot: TimeSlot }[] = [
  {
    startHour: 6,
    slot: {
      label: 'morning',
      primary: '#f59e0b',   // amber
      secondary: '#ef4444', // red-orange
      tertiary: '#f97316',  // orange
      blob1: 'rgba(245,158,11,0.18)',
      blob2: 'rgba(239,68,68,0.12)',
      blob3: 'rgba(249,115,22,0.12)',
    },
  },
  {
    startHour: 10,
    slot: {
      label: 'day',
      primary: '#6366f1',   // indigo (default)
      secondary: '#a855f7', // purple
      tertiary: '#ec4899',  // pink
      blob1: 'rgba(99,102,241,0.18)',
      blob2: 'rgba(168,85,247,0.12)',
      blob3: 'rgba(6,182,212,0.12)',
    },
  },
  {
    startHour: 16,
    slot: {
      label: 'evening',
      primary: '#7c3aed',   // violet
      secondary: '#db2777', // pink-600
      tertiary: '#9333ea',  // purple
      blob1: 'rgba(124,58,237,0.20)',
      blob2: 'rgba(219,39,119,0.14)',
      blob3: 'rgba(147,51,234,0.12)',
    },
  },
  {
    startHour: 20,
    slot: {
      label: 'night',
      primary: '#06b6d4',   // cyan
      secondary: '#3b82f6', // blue
      tertiary: '#0ea5e9',  // sky
      blob1: 'rgba(6,182,212,0.15)',
      blob2: 'rgba(59,130,246,0.10)',
      blob3: 'rgba(14,165,233,0.10)',
    },
  },
];

function getTimeSlot(): TimeSlot {
  const hour = new Date().getHours();
  let active = TIME_SLOTS[TIME_SLOTS.length - 1].slot; // night is default for <6h
  for (const { startHour, slot } of TIME_SLOTS) {
    if (hour >= startHour) active = slot;
  }
  return active;
}

function applySlot(slot: TimeSlot) {
  const root = document.documentElement;
  root.style.setProperty('--color-accent-primary', slot.primary);
  root.style.setProperty('--color-accent-secondary', slot.secondary);
  root.style.setProperty('--color-accent-tertiary', slot.tertiary);
  root.style.setProperty('--blob-color-1', slot.blob1);
  root.style.setProperty('--blob-color-2', slot.blob2);
  root.style.setProperty('--blob-color-3', slot.blob3);
  root.setAttribute('data-time-mood', slot.label);
}

export function useEmotionalColors() {
  useEffect(() => {
    // Apply immediately
    applySlot(getTimeSlot());

    // Re-check every minute for time changes
    const interval = setInterval(() => {
      applySlot(getTimeSlot());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);
}

export default useEmotionalColors;
