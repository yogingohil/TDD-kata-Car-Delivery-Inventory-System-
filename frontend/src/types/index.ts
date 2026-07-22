export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface IVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  color: string;
  vin: string;
  mileage: number;
  engineCapacity: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  status: VehicleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPurchase {
  _id: string;
  userId: IUser | string;
  vehicleId: IVehicle;
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
}

export interface PaginatedVehiclesResponse {
  vehicles: IVehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalyticsSummary {
  totalVehicles: number;
  availableVehicles: number;
  lowStockVehicles: number;
  outOfStockVehicles: number;
  totalInventoryValue: number;
  categoryDistribution: Record<string, number>;
  totalPurchasesCount: number;
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
