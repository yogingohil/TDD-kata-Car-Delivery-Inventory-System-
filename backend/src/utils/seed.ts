import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { VehicleModel } from '../models/vehicle.model.js';
import { VehicleStatus } from '../interfaces/vehicle.interface.js';

dotenv.config();

const sampleVehicles = [
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
    vin: 'WBS33AY080FP90002',
    mileage: 450,
    engineCapacity: '3.0L BMW M TwinPower Turbo Inline-6',
    price: 85300,
    quantity: 3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    description: 'High-performance sedan delivering 503 HP with intelligent all-wheel drive and iconic M styling.',
    status: VehicleStatus.LOW_STOCK,
  },
  {
    make: 'Audi',
    model: 'RS 6 Avant Performance',
    year: 2024,
    category: 'Wagon',
    fuelType: 'Gasoline',
    transmission: '8-Speed Tiptronic',
    color: 'Nardo Grey',
    vin: 'WAUZZZF28N1090003',
    mileage: 320,
    engineCapacity: '4.0L Twin-Turbo V8 Mild Hybrid',
    price: 126800,
    quantity: 4,
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    description: 'The ultimate super wagon combining 621 HP, legendary Quattro all-wheel drive, and practical luxury.',
    status: VehicleStatus.AVAILABLE,
  },
  {
    make: 'Mercedes-Benz',
    model: 'AMG GT 63 S E Performance',
    year: 2024,
    category: 'Sports',
    fuelType: 'Hybrid',
    transmission: 'AMG SPEEDSHIFT MCT 9G',
    color: 'Obsidian Black Metallic',
    vin: 'W1K2906791F090004',
    mileage: 95,
    engineCapacity: '4.0L V8 Biturbo + Electric Motor (831 HP)',
    price: 194900,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    description: 'Formula 1 hybrid technology in a 4-door coupe delivering electrifying acceleration and supreme luxury.',
    status: VehicleStatus.LOW_STOCK,
  },
  {
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric',
    fuelType: 'Electric',
    transmission: 'Single-Speed Fixed Gear',
    color: 'Ultra Red',
    vin: '5YJSA1E63PF090005',
    mileage: 50,
    engineCapacity: 'Tri-Motor All-Wheel Drive (1,020 HP)',
    price: 89990,
    quantity: 6,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    description: 'Hypercar acceleration (0-60 mph in 1.99s) with 359 miles range, yoke steering, and gaming rig onboard.',
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
    vin: 'ZFF83CEX000290006',
    mileage: 800,
    engineCapacity: '3.9L Twin-Turbo V8 (710 HP)',
    price: 280000,
    quantity: 0,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    description: 'Tribute to the most powerful V8 in Ferrari history with breathtaking Italian aerodynamics.',
    status: VehicleStatus.OUT_OF_STOCK,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);

    console.log('Seeding initial vehicle inventory...');
    for (const vehicleData of sampleVehicles) {
      await VehicleModel.updateOne(
        { vin: vehicleData.vin },
        { $set: vehicleData },
        { upsert: true },
      );
    }

    console.log('Successfully seeded sample vehicles into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
