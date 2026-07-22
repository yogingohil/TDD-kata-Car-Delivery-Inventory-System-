import request from 'supertest';
import app from '../app.js';
import { HttpStatus } from '../constants/http-status.js';

describe('Authentication Integration API (TDD Suite)', () => {
  const getValidUser = () => ({
    name: 'John Doe',
    email: `john_${Date.now()}_${Math.random().toString(36).substring(2, 7)}@example.com`,
    password: 'Password123!',
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully and return 201 Created with JWT token', async () => {
      const userPayload = getValidUser();
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userPayload);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('expiresIn');
      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: userPayload.name,
          email: userPayload.email.toLowerCase(),
          role: 'USER',
        }),
      );
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 409 Conflict when attempting to register with a duplicate email', async () => {
      const userPayload = getValidUser();

      // First registration
      await request(app).post('/api/v1/auth/register').send(userPayload);

      // Second registration attempt with same email
      const duplicateResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Jane Doe',
          email: userPayload.email.toUpperCase(),
          password: 'Password123!',
        });

      expect(duplicateResponse.status).toBe(HttpStatus.CONFLICT);
      expect(duplicateResponse.body).toHaveProperty('success', false);
      expect(duplicateResponse.body.message).toMatch(/already registered|already exists/i);
    });

    it('should return 400 Bad Request when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email-format',
          password: 'Password123!',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 Bad Request for weak passwords lacking uppercase, lowercase, number, or special char', async () => {
      const weakPasswords = [
        'short1!',          // Less than 8 chars
        'alllowercase1!',   // Missing uppercase
        'ALLUPPERCASE1!',   // Missing lowercase
        'NoNumbersHere!',   // Missing number
        'NoSpecialChar123', // Missing special character
      ];

      for (const pwd of weakPasswords) {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            name: 'John Doe',
            email: `test_${Math.random()}@example.com`,
            password: pwd,
          });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body).toHaveProperty('success', false);
      }
    });

    it('should return 400 Bad Request when missing name, email, or password', async () => {
      const missingName = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'Password123!' });
      expect(missingName.status).toBe(HttpStatus.BAD_REQUEST);

      const missingEmail = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'John', password: 'Password123!' });
      expect(missingEmail.status).toBe(HttpStatus.BAD_REQUEST);

      const missingPassword = await request(app)
        .post('/api/v1/auth/register')
        .send({ name: 'John', email: 'test@example.com' });
      expect(missingPassword.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    let testUser: { name: string; email: string; password: string };

    beforeEach(async () => {
      testUser = getValidUser();
      await request(app).post('/api/v1/auth/register').send(testUser);
    });

    it('should login successfully with valid credentials and return 200 OK with token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: testUser.name,
          email: testUser.email.toLowerCase(),
          role: 'USER',
        }),
      );
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 401 Unauthorized when password is wrong', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 401 Unauthorized when logging in with unknown email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'unknown_user_email@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 Bad Request when credentials are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('JWT Middleware & Protected Routes Authorization', () => {
    it('should deny access (401 Unauthorized) when authorization header is missing', async () => {
      const response = await request(app).get('/api/v1/health/protected-example');
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should deny access (401 Unauthorized) when token is invalid', async () => {
      const response = await request(app)
        .get('/api/v1/health/protected-example')
        .set('Authorization', 'Bearer invalid_jwt_token_string');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
