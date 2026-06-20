export const formatWatermark = (num: number): string => {
  if (num >= 1000) {
    return Math.floor(num / 1000) + 'K';
  }
  return num.toString();
};

export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
