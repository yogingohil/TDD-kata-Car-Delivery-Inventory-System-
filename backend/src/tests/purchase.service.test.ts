import { PurchaseService } from '../services/purchase.service.js';
import { IPurchaseRepository, IVehicleRepository } from '../interfaces/repository.interface.js';
import { IVehicle } from '../interfaces/vehicle.interface.js';
import { AppError } from '../utils/app-error.js';
import { Types } from 'mongoose';

describe('PurchaseService Unit Tests with Mocks', () => {
  let purchaseService: PurchaseService;
  let mockPurchaseRepository: jest.Mocked<IPurchaseRepository>;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;

  beforeEach(() => {
    mockPurchaseRepository = {
      findByUserId: jest.fn(),
      findAllWithPopulate: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockVehicleRepository = {
      findByVin: jest.fn(),
      findWithFilters: jest.fn(),
      updateQuantity: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    purchaseService = new PurchaseService(mockPurchaseRepository, mockVehicleRepository);
  });

  it('should throw AppError 400 when vehicle is out of stock', async () => {
    const vehicleId = new Types.ObjectId().toString();
    mockVehicleRepository.findById.mockResolvedValue({
      _id: new Types.ObjectId(vehicleId),
      make: 'Tesla',
      quantity: 0,
    } as IVehicle);

    await expect(
      purchaseService.processPurchase(new Types.ObjectId().toString(), vehicleId, 1),
    ).rejects.toThrow(AppError);
  });

  it('should process valid purchase and calculate analytics summary correctly', async () => {
    mockVehicleRepository.findAll.mockResolvedValue([
      { make: 'BMW', category: 'Sedan', price: 50000, quantity: 5 } as IVehicle,
      { make: 'Audi', category: 'SUV', price: 70000, quantity: 2 } as IVehicle,
      { make: 'Porsche', category: 'Sports', price: 150000, quantity: 0 } as IVehicle,
    ]);
    mockPurchaseRepository.findAllWithPopulate.mockResolvedValue([
      { totalPrice: 100000 } as any,
    ]);

    const summary = await purchaseService.getAnalyticsSummary();

    expect(summary.totalVehicles).toBe(3);
    expect(summary.availableVehicles).toBe(1);
    expect(summary.lowStockVehicles).toBe(1);
    expect(summary.outOfStockVehicles).toBe(1);
    expect(summary.totalInventoryValue).toBe(390000);
    expect(summary.categoryDistribution).toEqual({
      Sedan: 5,
      SUV: 2,
      Sports: 0,
    });
  });
});
