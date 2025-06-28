export function formatPrice(price: number, unit: 'juta' | 'miliar'): string {
  if (unit === 'miliar') {
    return `Rp ${price} Miliar`;
  } else {
    return `Rp ${price} Juta`;
  }
}