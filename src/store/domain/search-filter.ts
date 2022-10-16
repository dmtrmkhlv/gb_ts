export interface SearchFilter {
  city: string | number[];
  checkInDate: Date;
  checkOutDate: Date;
  priceLimit?: number;
}
