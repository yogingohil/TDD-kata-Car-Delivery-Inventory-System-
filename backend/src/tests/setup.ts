import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { env } from '../config/env.config.js';

dotenv.config({ path: '.env' });

jest.setTimeout(30000); // 30 seconds for remote MongoDB Atlas operations

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGODB_URI);
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
