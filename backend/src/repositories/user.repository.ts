import { BaseRepository } from './base.repository.js';
import { IUser, IUserDocument } from '../interfaces/user.interface.js';
import { IUserRepository } from '../interfaces/repository.interface.js';
import { UserModel } from '../models/user.model.js';

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).select('+password').lean<IUser>().exec();
  }
}
