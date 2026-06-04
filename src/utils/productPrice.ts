/** Giá khách hàng thực tế thanh toán */
export function getSellingPrice(originalPrice: number, discountedPrice?: number | null): number {
  if (
    discountedPrice != null &&
    discountedPrice > 0 &&
    discountedPrice < originalPrice
  ) {
    return discountedPrice;
  }
  return originalPrice;
}

export function hasProductDiscount(originalPrice: number, discountedPrice?: number | null): boolean {
  return (
    discountedPrice != null &&
    discountedPrice > 0 &&
    discountedPrice < originalPrice
  );
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

/** Tính % giảm từ giá gốc và giá khuyến mãi (dùng khi kích hoạt flash sale trên backend) */
export function calcDiscountPercent(originalPrice: number, promotionalPrice: number): number {
  if (originalPrice <= 0 || promotionalPrice <= 0 || promotionalPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - promotionalPrice) / originalPrice) * 10000) / 100;
}
