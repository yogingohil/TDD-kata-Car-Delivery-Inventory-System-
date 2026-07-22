import { Document, Types } from 'mongoose';

export enum TestDriveStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TestDriveType {
  HOME_DELIVERY = 'HOME_DELIVERY',
  SHOWROOM_VISIT = 'SHOWROOM_VISIT',
}

export interface ITestDrive {
  _id?: string;
  userId: string | Types.ObjectId;
  vehicleId: string | Types.ObjectId;
  preferredDate: string;
  preferredTimeSlot: string;
  type: TestDriveType;
  locationAddress?: string;
  contactPhone: string;
  status: TestDriveStatus;
  notes?: string;
  createdAt?: string;
}

export interface ITestDriveDocument extends Omit<ITestDrive, '_id'>, Document {}
