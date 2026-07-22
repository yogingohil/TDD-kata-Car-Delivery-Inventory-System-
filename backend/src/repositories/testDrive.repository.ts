import { BaseRepository } from './base.repository.js';
import { ITestDrive, ITestDriveDocument } from '../interfaces/testDrive.interface.js';
import { TestDriveModel } from '../models/testDrive.model.js';

export class TestDriveRepository extends BaseRepository<ITestDriveDocument> {
  constructor() {
    super(TestDriveModel);
  }

  public async findByUserId(userId: string): Promise<ITestDrive[]> {
    return this.model
      .find({ userId })
      .populate('vehicleId')
      .sort({ createdAt: -1 })
      .lean<ITestDrive[]>()
      .exec();
  }

  public async findAllWithDetails(): Promise<ITestDrive[]> {
    return this.model
      .find()
      .populate('userId', 'name email')
      .populate('vehicleId')
      .sort({ createdAt: -1 })
      .lean<ITestDrive[]>()
      .exec();
  }
}
