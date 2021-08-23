const dbHandler = require('../../dbHandler');
const ordersController = require('../../../controller/ordersController');
const testsUtil = require('../../testUtil'); 
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
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

//Tests
describe('/orders', () => {
    describe('post', () => {
        describe('orders are created when', () => {
            it('order is sent with all properties', async () => {
                let beverageId = await testsUtil.createBeverage();
                await testsUtil.setSettings(1000, ['Tea']);
                const res = mockResponse();
                let req = {
                    body: {
                        username : "John",
                        beverage: beverageId,
                        drinkSize: "Medium"
                    }
                }
                await ordersController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(201);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "New order created",
                        order: {
                            username : "John",
                            beverage: {
                                id: beverageId,
                                name: "Green Tea"
                            },
                            drinkSize: "Medium",
                            status: "In Progress"
                        }
                    });
            });
        });
        describe('Error thrown when', () => {
            it('invalid body' , async ()=>{
                let beverageId = await testsUtil.createBeverage();
                await testsUtil.setSettings(1000, ['Tea']);
                const res = mockResponse();
                let req = {
                    body: {
                        username : "John",
                        beverage: beverageId
                    }
                }
                await ordersController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(400);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "ValidationError: drinkSize: Order size is required"
                    });
            });
            it('invalid beverageId' , async ()=>{    
                const res = mockResponse();
                let req = {
                    body: {
                        username : "John",
                        beverage: "InvalidId",
                        drinkSize: "Medium"
                    }
                }
                await ordersController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(400);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "InvalidId is not a valid beverage ID"
                    });
            });
            it('beverage type is not allowed' , async ()=>{
                let beverageId = await testsUtil.createBeverage();
                await testsUtil.setSettings(1000, ['Coffee']);
                const res = mockResponse();
                let req = {
                    body: {
                        username : "John",
                        beverage: beverageId,
                        drinkSize: "Medium"       
                    }
                }
                await ordersController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(400);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "Error: Can only create orders for beverages of the following type: Coffee"
                    });
            });
            it('not enough water in the reservoir' , async ()=>{
                let beverageId = await testsUtil.createBeverage();
                await testsUtil.setSettings(100, ['Tea']);
                const res = mockResponse();
                let req = {
                    body: {
                        username : "John",
                        beverage: beverageId,
                        drinkSize: "Medium"       
                    }
                }
                await ordersController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(400);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "Error: Not enough water in the reservoir for your order"
                    });
            });
        })
    })
    describe('get', () => {
        it('Get a list of all existing orders', async () => {
            let beverageId = await testsUtil.createBeverage();
            await testsUtil.setSettings(1000, ['Tea']);
            // Create two orders             
            const resPost1 = mockResponse();
            const resPost2 = mockResponse();
            let reqPost1 = {
                body: {
                    username : "John",
                    beverage: beverageId,
                    drinkSize: "Medium",
                    status: "In Progress"
                }
            };
            let reqPost2 = {
                body: {
                    username : "John",
                    beverage: beverageId,
                    drinkSize: "Large",
                    status: "In Queue"
                }
            };
            await ordersController.post(reqPost1, resPost1);
            await ordersController.post(reqPost2, resPost2);
            expect(resPost1.status.mock.calls[0][0]).toEqual(201);
            expect(resPost2.status.mock.calls[0][0]).toEqual(201);
            //Get all orders
            const resGet = mockResponse();
            await ordersController.get(null, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(200);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    count: 2,
                    orders: [
                        {
                            username : "John",
                            beverage: beverageId,
                            drinkSize: "Medium",
                            status: "In Progress"
                        },
                        {
                            username : "John",
                            beverage: beverageId,
                            drinkSize: "Large",
                            status: "In Queue"
                        }
                    ]
                });
        });
        it('Get an empty list', async () => {
            const resGet = mockResponse();
            await ordersController.get(null, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(200);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    count: 0,
                    orders: [
                    ]
                });
        });
    });
});

