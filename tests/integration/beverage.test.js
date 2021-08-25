const express = require('express');
const request = require('supertest');
const dbHandler = require('../dbHandler');
const beveragesRouter = require('../../routes/beverages');
const testUtil = require('../testUtil');


const app = express(); // instance of an express app
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/beverages', beveragesRouter);
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());


describe('Integration Tests for beverages router', () => {
    it('POST /beverages - success', async () => {
        const body = {
            name: "Green Tea",
            type: "Tea",
            temperature: 80,
            garnish: "Orange"
        };
        const res = await request(app).post('/beverages').send(body);
        console.log(JSON.stringify(res.body));
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(
            {
                message: "New beverage created",
                beverage: body
            });
    });
    it('POST /beverages - Error 400', async () => {
        const body = {};
        const res = await request(app).post('/beverages').send(body);
        console.log(JSON.stringify(res.body));
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject(
            {
                message: "ValidationError: name: Beverage name is required, type: Beverage type is required, temperature: Beverage temperature is required"
            });
    });

    it('GET /beverages - success', async () => {
        await testUtil.createBeverage();
        const res = await request(app).get('/beverages');
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(
            {
                count: 1,
                beverages: [
                    {
                        name: "Green Tea",
                        type: "Tea",
                        temperature: 80,
                        garnish: "Orange"
                    }
                ]
            });
    });

    it('GET /beverages/:beverageId - success', async () => {
        const id = await testUtil.createBeverage();
        const res = await request(app).get(`/beverages/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(
            {
                name: "Green Tea",
                type: "Tea",
                temperature: 80,
                garnish: "Orange"
            });
    });

    it('GET /beverages/:beverageId - Error 400', async () => {
        const id = 'InvalidId'
        const res = await request(app).get(`/beverages/${id}`);
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject(
            {
                message: "No beverage found with that id"
            });
    });

    it('PUT /beverages/:beverageId - success', async () => {
        const id = await testUtil.createBeverage();
        const body = {
            temperature: 98
        }
        const res = await request(app).put(`/beverages/${id}`).send(body);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            message: `Beverage with id ${id} was updated`,
            beverage: {
                name: "Green Tea",
                type: "Tea",
                temperature: 98,
                garnish: "Orange"
            }
        });
    });

    it('PUT /beverages/:beverageId - Error 400', async () => {
        const id = await testUtil.createBeverage();
        const body = {
            temperature: "HOT"
        }
        const res = await request(app).put(`/beverages/${id}`).send(body);
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
            message: "\"HOT\" is not a valid number",
        });
    });

    it('DELETE /beverages/:beverageId - success', async () => {
        const id = await testUtil.createBeverage();
        const res = await request(app).delete(`/beverages/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(
            {
                message: `Beverage with id ${id} was removed`
            });
    });

    it('DELETE /beverages/:beverageId - Error 400', async () => {
        const id = 'InvalidId'
        const res = await request(app).delete(`/beverages/${id}`);
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject(
            {
                message: "No beverage found with that id"
            });
    });
})