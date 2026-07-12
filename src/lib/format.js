export function money(value) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function percent(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}
