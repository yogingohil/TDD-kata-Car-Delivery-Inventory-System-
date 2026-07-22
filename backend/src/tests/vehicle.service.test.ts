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
    mockVehicleRepository.create.mockImplementation(async (data) => ({
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
});
