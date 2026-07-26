import path from 'path';
import dotenv from 'dotenv';

// Resolve .env whether running from project root or backend folder
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { VehicleModel } from '../models/vehicle.model.js';
import { UserModel } from '../models/user.model.js';
import { VehicleStatus } from '../interfaces/vehicle.interface.js';
import { UserRole } from '../constants/roles.enum.js';
import { PasswordUtil } from './password.util.js';
import { env } from '../config/env.config.js';
import { logger } from './logger.js';

export const sampleVehicles = [
  {
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Sports',
    fuelType: 'Gasoline',
    transmission: 'PDK Automatic',
    color: 'GT Silver Metallic',
    vin: 'WP0ZZZ99ZLS290001',
    mileage: 150,
    engineCapacity: '4.0L Naturally Aspirated Flat-6',
    price: 241300,
    quantity: 5,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    description: 'Track-focused aerodynamic masterpiece with 518 HP, DRS rear wing, and lightweight carbon fiber components.',
    status: VehicleStatus.AVAILABLE,
  },
  {
    make: 'BMW',
    model: 'M3 Competition xDrive',
    year: 2024,
    category: 'Sedan',
    fuelType: 'Gasoline',
    transmission: '8-Speed M Steptronic',
    color: 'Isle of Man Green',
    vin: 'WBS33AY010FK12345',
    mileage: 500,
    engineCapacity: '3.0L BMW M TwinPower Turbo Inline-6',
    price: 84300,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    description: '503 HP high-performance luxury sedan equipped with Intelligent M xDrive AWD system.',
    status: VehicleStatus.LOW_STOCK,
  },
  {
    make: 'Audi',
    model: 'RS6 Avant GT',
    year: 2025,
    category: 'Wagon',
    fuelType: 'Gasoline',
    transmission: '8-Speed Tiptronic Automatic',
    color: 'Arkona White',
    vin: 'WAUZZZ4K9LN987654',
    mileage: 50,
    engineCapacity: '4.0L Twin-Turbo V8 MHEV',
    price: 159000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    description: 'Exclusive limited edition super wagon packing 621 HP and carbon fiber bonnet/fenders.',
    status: VehicleStatus.LOW_STOCK,
  },
  {
    make: 'Mercedes-AMG',
    model: 'GT 63 S E Performance',
    year: 2024,
    category: 'Sports',
    fuelType: 'Hybrid',
    transmission: 'AMG SPEEDSHIFT MCT 9G',
    color: 'Obsidian Black Metallic',
    vin: 'W1K1923771A001122',
    mileage: 120,
    engineCapacity: '4.0L V8 Biturbo + Electric Motor',
    price: 194900,
    quantity: 4,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    description: 'Formula 1 inspired hybrid producing 831 HP and an astonishing 1,033 lb-ft of torque.',
    status: VehicleStatus.AVAILABLE,
  },
  {
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric',
    fuelType: 'Electric',
    transmission: 'Single Speed Direct Drive',
    color: 'Solid Black',
    vin: '5YJSA1E28MF334455',
    mileage: 800,
    engineCapacity: 'Tri-Motor All-Wheel Drive',
    price: 89990,
    quantity: 6,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    description: '1,020 HP tri-motor electric powertrain accelerating 0-60 mph in 1.99 seconds.',
    status: VehicleStatus.AVAILABLE,
  },
  {
    make: 'Ferrari',
    model: 'F8 Tributo',
    year: 2023,
    category: 'Sports',
    fuelType: 'Gasoline',
    transmission: '7-Speed Dual-Clutch',
    color: 'Rosso Corsa',
    vin: 'ZFF83CBP000246810',
    mileage: 1200,
    engineCapacity: '3.9L Twin-Turbo V8',
    price: 280000,
    quantity: 0,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    description: 'Tribute to the most powerful V8 in Ferrari history with breathtaking Italian aerodynamics.',
    status: VehicleStatus.OUT_OF_STOCK,
  },
];

export async function autoSeedIfEmpty(): Promise<void> {
  try {
    const vehicleCount = await VehicleModel.countDocuments();
    if (vehicleCount === 0) {
      logger.info('📦 Vehicle collection empty. Auto-seeding initial luxury fleet into MongoDB...');
      for (const vehicleData of sampleVehicles) {
        await VehicleModel.updateOne(
          { vin: vehicleData.vin },
          { $set: vehicleData },
          { upsert: true },
        );
      }
    }

    const customerPassword = await PasswordUtil.hashPassword('Password123!');
    await UserModel.updateOne(
      { email: 'yogin@example.com' },
      {
        $set: {
          name: 'Yogin Gohil',
          email: 'yogin@example.com',
          password: customerPassword,
          role: UserRole.USER,
        },
      },
      { upsert: true },
    );

    const adminPassword = await PasswordUtil.hashPassword('AdminPassword123!');
    await UserModel.updateOne(
      { email: 'admin@example.com' },
      {
        $set: {
          name: 'Apex Admin',
          email: 'admin@example.com',
          password: adminPassword,
          role: UserRole.ADMIN,
        },
      },
      { upsert: true },
    );

    logger.info('✅ Database auto-seed check complete.');
  } catch (error) {
    logger.error('Failed to auto-seed database:', { error });
  }
}

async function runStandaloneSeed() {
  try {
    const mongoUri = env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Connecting to MongoDB Atlas at:', mongoUri.split('@')[1] || mongoUri);
    await mongoose.connect(mongoUri, { dbName: 'car_inventory_db' });
    console.log('Connected DB:', mongoose.connection.name);

    await autoSeedIfEmpty();

    const count = await VehicleModel.countDocuments();
    console.log(`Successfully seeded ${count} vehicles and user accounts into MongoDB Atlas database [car_inventory_db]!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Only execute standalone if invoked directly via CLI
if (process.argv[1] && process.argv[1].includes('seed')) {
  runStandaloneSeed();
}
