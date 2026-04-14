/**
 * Centralize all formatting logic to ensure consistency across the dashboard.
 */

export const formatBRL = (val) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(val || 0);
};

export const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(val || 0);
};

export const formatShortBRL = (val) => {
  if (val >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `R$ ${(val / 1_000).toFixed(0)}k`;
  return `R$ ${val}`;
};

export const parseMeta = (raw) => {
  const cleaned = String(raw).replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
};

export const formatMetaDisplay = (num) => {
  return new Intl.NumberFormat('pt-BR').format(num || 0);
};
