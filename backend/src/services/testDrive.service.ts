import { TestDriveRepository } from '../repositories/testDrive.repository.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { ITestDrive, TestDriveStatus } from '../interfaces/testDrive.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';

export class TestDriveService {
  private testDriveRepository: TestDriveRepository;
  private vehicleRepository: VehicleRepository;

  constructor(
    testDriveRepository = new TestDriveRepository(),
    vehicleRepository = new VehicleRepository(),
  ) {
    this.testDriveRepository = testDriveRepository;
    this.vehicleRepository = vehicleRepository;
  }

  public async scheduleTestDrive(
    userId: string,
    payload: Partial<ITestDrive>,
  ): Promise<ITestDrive> {
    if (!payload.vehicleId || !payload.preferredDate || !payload.preferredTimeSlot || !payload.contactPhone) {
      throw new AppError('Vehicle ID, preferred date, time slot, and contact phone are required', HttpStatus.BAD_REQUEST);
    }

    const vehicle = await this.vehicleRepository.findById(payload.vehicleId as string);
    if (!vehicle) {
      throw new AppError('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const doc = await this.testDriveRepository.create({
      userId,
      vehicleId: payload.vehicleId,
      preferredDate: payload.preferredDate,
      preferredTimeSlot: payload.preferredTimeSlot,
      type: payload.type,
      locationAddress: payload.locationAddress,
      contactPhone: payload.contactPhone,
      status: TestDriveStatus.SCHEDULED,
      notes: payload.notes,
    });

    return doc as unknown as ITestDrive;
  }

  public async getUserTestDrives(userId: string): Promise<ITestDrive[]> {
    return this.testDriveRepository.findByUserId(userId);
  }

  public async getAllTestDrives(): Promise<ITestDrive[]> {
    return this.testDriveRepository.findAllWithDetails();
  }

  public async updateStatus(id: string, status: TestDriveStatus): Promise<ITestDrive> {
    const updated = await this.testDriveRepository.update(id, { status });
    if (!updated) {
      throw new AppError('Test drive booking not found', HttpStatus.NOT_FOUND);
    }
    return updated as unknown as ITestDrive;
  }
}
