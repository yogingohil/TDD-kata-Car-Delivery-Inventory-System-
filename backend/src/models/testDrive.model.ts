import { Schema, model } from 'mongoose';
import { ITestDriveDocument, TestDriveStatus, TestDriveType } from '../interfaces/testDrive.interface.js';

const testDriveSchema = new Schema<ITestDriveDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true,
    },
    preferredDate: {
      type: String,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TestDriveType),
      default: TestDriveType.SHOWROOM_VISIT,
    },
    locationAddress: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TestDriveStatus),
      default: TestDriveStatus.SCHEDULED,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const TestDriveModel = model<ITestDriveDocument>('TestDrive', testDriveSchema);
