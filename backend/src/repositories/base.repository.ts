import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../interfaces/repository.interface.js';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(item: Partial<T>): Promise<T> {
    const created = await this.model.create(item);
    return created.toObject() as T;
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).lean<T>().exec();
  }

  public async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).lean<T[]>().exec();
  }

  public async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).lean<T>().exec();
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
