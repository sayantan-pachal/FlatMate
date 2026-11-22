export const toPaise = (amount) => Math.round(Number(amount || 0) * 100);

export const fromPaise = (paise) => Number((paise / 100).toFixed(2));

export const formatINR = (paise, { showDecimals = true } = {}) => {
  const value = (paise || 0) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(value);
};