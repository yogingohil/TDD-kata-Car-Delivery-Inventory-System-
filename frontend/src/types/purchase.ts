export interface Purchase {
  id: string;
  vehicleId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
}
