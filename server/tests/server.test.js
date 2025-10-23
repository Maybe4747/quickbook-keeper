const request = require('supertest');
const app = require('../server');

describe('Server Setup', () => {
  it('should respond to GET /api/transactions with 401 (unauthorized) when no token provided', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(401);
  });

  it('should respond to GET / with 404 since no root route is defined', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(404);
  });
});