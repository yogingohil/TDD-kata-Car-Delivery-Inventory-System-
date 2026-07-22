import { Document, Types } from 'mongoose';
import { UserRole } from '../constants/roles.enum.js';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserDocument = IUser & Document;
