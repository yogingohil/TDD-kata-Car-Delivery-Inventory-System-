import request from 'supertest';
import app from '../app.js';
import { HttpStatus } from '../constants/http-status.js';
import { UserRole } from '../constants/roles.enum.js';
import { JwtUtil } from '../utils/jwt.util.js';
import { Types } from 'mongoose';

describe('Purchase & Inventory Flow Integration Suite', () => {
  let adminToken: string;
  let userToken: string;
  let vehicleId: string;

  beforeAll(() => {
    const adminId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();

    adminToken = JwtUtil.generateAccessToken(adminId, 'admin@example.com', UserRole.ADMIN);
    userToken = JwtUtil.generateAccessToken(userId, 'buyer@example.com', UserRole.USER);
  });

  beforeEach(async () => {
    // Create a fresh vehicle before each test
    const createRes = await request(app)
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Audi',
        model: 'RS6 Avant',
        year: 2024,
        category: 'Wagon',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        color: 'Nardo Grey',
        vin: `VINPURCHASE${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        mileage: 10,
        engineCapacity: '4.0L V8',
        price: 130000,
        quantity: 2,
      });

    vehicleId = createRes.body.data._id;
  });

  it('should allow user to purchase an available vehicle and reduce inventory stock', async () => {
    const purchaseRes = await request(app)
      .post(`/api/v1/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(purchaseRes.status).toBe(HttpStatus.CREATED);
    expect(purchaseRes.body.success).toBe(true);
    expect(purchaseRes.body.data).toHaveProperty('totalPrice', 130000);

    // Verify stock decreased to 1
    const vehicleRes = await request(app).get(`/api/v1/vehicles/${vehicleId}`);
    expect(vehicleRes.body.data.quantity).toBe(1);
    expect(vehicleRes.body.data.status).toBe('LOW_STOCK');
  });

  it('should prevent purchasing more items than available in stock', async () => {
    const purchaseRes = await request(app)
      .post(`/api/v1/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(purchaseRes.status).toBe(HttpStatus.BAD_REQUEST);
    expect(purchaseRes.body.message).toMatch(/Insufficient inventory/i);
  });
});
