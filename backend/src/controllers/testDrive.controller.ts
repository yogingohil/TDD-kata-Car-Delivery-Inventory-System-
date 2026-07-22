import { Request, Response } from 'express';
import { TestDriveService } from '../services/testDrive.service.js';
import { ApiResponse } from '../utils/response.util.js';
import { HttpStatus } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

export class TestDriveController {
  private testDriveService: TestDriveService;

  constructor(testDriveService = new TestDriveService()) {
    this.testDriveService = testDriveService;
  }

  public schedule = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.sub;
    if (!userId) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const testDrive = await this.testDriveService.scheduleTestDrive(userId, req.body);
    ApiResponse.success(res, HttpStatus.CREATED, 'Test drive appointment scheduled successfully', testDrive);
  };

  public getUserAppointments = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.sub;
    if (!userId) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const appointments = await this.testDriveService.getUserTestDrives(userId);
    ApiResponse.success(res, HttpStatus.OK, 'User test drive appointments retrieved', appointments);
  };

  public getAllAppointments = async (_req: Request, res: Response): Promise<void> => {
    const appointments = await this.testDriveService.getAllTestDrives();
    ApiResponse.success(res, HttpStatus.OK, 'All test drive appointments retrieved', appointments);
  };

  public updateStatus = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const { status } = req.body;
    const updated = await this.testDriveService.updateStatus(id, status);
    ApiResponse.success(res, HttpStatus.OK, 'Test drive status updated successfully', updated);
  };
}
