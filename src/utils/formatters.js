export const formatINR = (value, options = {}) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: options.compact ? 1 : 0,
    notation: options.compact ? 'compact' : 'standard',
  }).format(Number.isFinite(value) ? value : 0);

export const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

export const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
