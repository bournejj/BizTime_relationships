process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
  const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('google', 'google', 'web search app') RETURNING  code, name, description`);
  testCompany = result.rows[0]
})

afterEach(async () => {
  await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
  await db.end()
})

describe("GET /companies", () => {
    test("Get a list with one company", async () => {
      const res = await request(app).get('/companies')
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ companies: [testCompany] })
    })
  })

  describe("GET /companies/:code", () => {
    test("Gets a single company", async () => {
      const res = await request(app).get(`/companies/${testCompany.code}`)
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ company: testCompany })
    })
    test("Responds with 404 for invalid id", async () => {
      const res = await request(app).get(`/companies/facebook`)
      expect(res.statusCode).toBe(404);
    })
  })

  describe("POST /companies", () => {
    test("Creates a single company", async () => {
      const res = await request(app).post('/companies').send({ code: 'microsoft', name: 'microsoft', description: "maker of windows" });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        company: {code: 'microsoft', name: 'microsoft', description: "maker of windows" }
      })
    })
  })

  describe("PATCH /companies/:code", () => {
    test("Updates a single company", async () => {
      const res = await request(app).put(`/companies/${testCompany.code}`).send({ name: 'facebook', description: 'maker of scocial media app' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        company: { code: testCompany.code, name: 'facebook', description: 'maker of scocial media app' }
      })
    })
    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).patch(`/companies/facebook`).send({ name: 'facebook', description: 'maker of scocial media app' });
        expect(res.statusCode).toBe(404);
    })
    })

    describe("DELETE /companies/:code", () => {
        test("Deletes a single company", async () => {
          const res = await request(app).delete(`/companies/${testCompany.code}`);
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual({ msg: 'DELETED!' })
        })
      })
      
  
  