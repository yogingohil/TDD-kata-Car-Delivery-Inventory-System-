import request from 'supertest';
import app from '../app.js';
import { HttpStatus } from '../constants/http-status.js';

describe('Health Check API', () => {
  it('GET /api/v1/health - should return status 200 OK and healthy message', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('service', 'Car Inventory System API');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('GET /api/v1/unknown-route - should return 404 Not Found error response', async () => {
    const response = await request(app).get('/api/v1/unknown-route');

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.message).toContain('Cannot find /api/v1/unknown-route');
  });
});
