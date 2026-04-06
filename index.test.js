// index.test.js — Automated tests for our API

const request = require('supertest');
const app = require('./index');

// Test 1: Home route
test('GET / returns a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from CI/CD Lab!');
});

// Test 2: Health check route
test('GET /health returns healthy status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
});

// Test 3: Add route
test('GET /add/3/4 returns 7', async () => {
    const response = await request(app).get('/add/3/4');
    expect(response.status).toBe(200);
    expect(response.body.result).toBe(99);;
});