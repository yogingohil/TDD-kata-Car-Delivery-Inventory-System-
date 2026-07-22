export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
