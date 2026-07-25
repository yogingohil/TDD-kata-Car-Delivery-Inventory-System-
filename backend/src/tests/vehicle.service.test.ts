import { VehicleService } from '../services/vehicle.service.js';
import { IVehicleRepository } from '../interfaces/repository.interface.js';
import { IVehicle, VehicleStatus } from '../interfaces/vehicle.interface.js';
import { AppError } from '../utils/app-error.js';
import { Types } from 'mongoose';

describe('VehicleService Unit Tests with Mocks', () => {
  let vehicleService: VehicleService;
  let mockVehicleRepository: jest.Mocked<IVehicleRepository>;

  beforeEach(() => {
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

    vehicleService = new VehicleService(mockVehicleRepository);
  });

  it('should throw AppError 409 when creating a vehicle with an existing VIN', async () => {
    mockVehicleRepository.findByVin.mockResolvedValue({
      _id: new Types.ObjectId(),
      make: 'Ferrari',
      vin: 'EXISTINGVIN123',
    } as IVehicle);

    await expect(
      vehicleService.createVehicle({
        make: 'Ferrari',
        vin: 'EXISTINGVIN123',
      }),
    ).rejects.toThrow(AppError);
  });

  it('should calculate LOW_STOCK status when quantity is between 1 and 3', async () => {
    mockVehicleRepository.findByVin.mockResolvedValue(null);
    mockVehicleRepository.create.mockImplementation(async (data: any) => ({
      _id: new Types.ObjectId(),
      ...data,
    } as IVehicle));

    const created = await vehicleService.createVehicle({
      make: 'BMW',
      model: 'M3',
      vin: 'UNIQUEVIN999',
      quantity: 2,
    });

    expect(created.status).toBe(VehicleStatus.LOW_STOCK);
  });

  it('should calculate OUT_OF_STOCK status when quantity is 0', async () => {
    mockVehicleRepository.findByVin.mockResolvedValue(null);
    mockVehicleRepository.create.mockImplementation(async (data: any) => ({
      _id: new Types.ObjectId(),
      ...data,
    } as IVehicle));

    const created = await vehicleService.createVehicle({
      make: 'Porsche',
      model: 'GT3 RS',
      vin: 'ZEROSTOCKVIN000',
      quantity: 0,
    });

    expect(created.status).toBe(VehicleStatus.OUT_OF_STOCK);
  });

  it('should give 10% discount when user purchases 3 or more vehicles', async () => {
    const discountedPrice = vehicleService.applyBulkDiscount(10000, 3);
    expect(discountedPrice).toBe(9000); // 10% discount applied
  });
  
  it('should give 15% discount for ADMIN for purchases luxury above $100k',()=>{
    const finalDiscount= vehicleService.vipDiscount(200000,'ADMIN');
    expect(finalDiscount).toBe(170000);
  })
    it('should calculate 10% discount for regualr customer for buying luxury car above $100k',()=>{
      const finalPrice = vehicleService.vipDiscount(200000,'USER')
      expect(finalPrice).toBe(180000);
    });
});
