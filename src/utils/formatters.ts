import confetti from 'canvas-confetti';
import { Discipline, ProjectHealth, ProjectStage } from '../types';

export const formatCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN'): string => {
  const symbol = currency === 'NGN' ? '₦' : '$';
  if (amount >= 1_000_000_000) {
    return `${symbol}${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatExactCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN'): string => {
  const symbol = currency === 'NGN' ? '₦' : '$';
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const getHealthBadgeClass = (health: ProjectHealth): string => {
  switch (health) {
    case 'On Track':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'Attention Needed':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'Critical Delay':
      return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    case 'Completed':
      return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

export const getDisciplineBadgeClass = (discipline: Discipline): string => {
  switch (discipline) {
    case 'Landscape':
      return 'bg-arabella-50 text-arabella-800 border-arabella-300 dark:bg-arabella-950 dark:text-arabella-300 dark:border-arabella-700';
    case 'Architecture':
      return 'bg-bdw-100 text-bdw-700 border-bdw-300 dark:bg-bdw-950 dark:text-bdw-300 dark:border-bdw-700';
    case 'Integrated Design-Build':
      return 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

export const getStageProgressColor = (stage: ProjectStage): string => {
  switch (stage) {
    case 'Inception & Brief':
      return 'bg-stone-400';
    case 'Concept & 3D Visualisation':
      return 'bg-indigo-500';
    case 'Statutory Approvals (LASPPPA/FCDA)':
      return 'bg-amber-500';
    case 'Detailed Technical Drawings':
      return 'bg-bdw-600';
    case 'Earthworks & Civils':
      return 'bg-amber-700';
    case 'Hardscaping & Structures':
      return 'bg-stone-600';
    case 'Softscaping & Nursery Planting':
      return 'bg-arabella-600';
    case 'Snagging & Practical Completion':
      return 'bg-teal-600';
    case 'Handover & Post-Occupancy':
    case 'Maintenance Retainer':
      return 'bg-emerald-600';
    default:
      return 'bg-arabella-600';
  }
};

export const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00722C', '#C5A059', '#8F4894', '#002E11', '#FAF5FB'],
    });
  } catch (err) {
    console.log('Confetti trigger', err);
  }
};
