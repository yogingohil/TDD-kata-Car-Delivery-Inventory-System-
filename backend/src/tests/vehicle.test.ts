import request from 'supertest';
import app from '../app.js';
import { HttpStatus } from '../constants/http-status.js';
import { UserRole } from '../constants/roles.enum.js';
import { JwtUtil } from '../utils/jwt.util.js';
import { Types } from 'mongoose';

describe('Vehicle Management API Integration Suite', () => {
  let adminToken: string;
  let userToken: string;
  let createdVehicleId: string;

  beforeAll(() => {
    adminToken = JwtUtil.generateAccessToken(new Types.ObjectId().toString(), 'admin@example.com', UserRole.ADMIN);
    userToken = JwtUtil.generateAccessToken(new Types.ObjectId().toString(), 'user@example.com', UserRole.USER);
  });

  const getSampleVehicle = () => ({
    make: 'Porsche',
    model: '911 GT3',
    year: 2024,
    category: 'Sports',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'GT Silver',
    vin: `VIN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    mileage: 150,
    engineCapacity: '4.0L Flat-6',
    price: 220000,
    quantity: 5,
    description: 'Track-ready performance luxury sports car',
  });

  beforeEach(async () => {
    const payload = getSampleVehicle();
    const res = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    if (res.status === HttpStatus.CREATED) {
      createdVehicleId = res.body.data._id;
    }
  });

  describe('POST /api/v1/vehicles', () => {
    it('should allow Admin to create a vehicle successfully', async () => {
      const payload = getSampleVehicle();
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.vin).toBe(payload.vin);
      expect(response.body.data.status).toBe('AVAILABLE');
    });

    it('should deny non-admin users (403 Forbidden)', async () => {
      const response = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(getSampleVehicle());

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('should prevent duplicate VIN registration (409 Conflict)', async () => {
      const payload = getSampleVehicle();
      await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload);

      const duplicateResponse = await request(app)
        .post('/api/v1/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload);

      expect(duplicateResponse.status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('GET /api/v1/vehicles', () => {
    it('should return paginated list of vehicles with filters', async () => {
      const response = await request(app).get('/api/v1/vehicles?page=1&limit=10&make=Porsche');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveProperty('vehicles');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('page', 1);
    });
  });

  describe('POST /api/v1/vehicles/:id/restock', () => {
    it('should allow Admin to restock vehicle inventory', async () => {
      const restockRes = await request(app)
        .post(`/api/v1/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(restockRes.status).toBe(HttpStatus.OK);
      expect(restockRes.body.data.quantity).toBe(15);
    });
  });
});
