const dbHandler = require('../../dbHandler');
const ordersControllerUtil = require('../../../controller/ordersControllerUtil');
const testsUtil = require('../../testUtil');
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
describe('Order Controller utilities', () => {
    describe('checkReservoir', () => {
        it('return true if enough water is in the reservoir', async () => {
            await testsUtil.setSettings(1000, ['Tea']);
            expect(await ordersControllerUtil.checkReservoir('Medium')).toBeTruthy();
        });
        it('return false if not enough water is in the reservoir', async () => {
            await testsUtil.setSettings(100);
            expect(await ordersControllerUtil.checkReservoir('Medium')).toBeFalsy();
        });
    });
    describe('allowedBeverages', () => {
        it('returned the saved setting for allowedBeverages', async () => {
            await testsUtil.setSettings(1000, ['Tea', 'Coffee']);
            expect(await ordersControllerUtil.allowedBeverages()).toEqual(['Tea', 'Coffee'])
        });
    })
    describe('validateBeverage', () => {
        it('do nothing if no check fails', async () => {
            await testsUtil.setSettings(1000, ['Tea']);
            let order = {
                drinkSize : 'Medium'
            };
            let beverage = {
                type : 'Tea'
            }
            expect(await ordersControllerUtil.validateBeverage(order, beverage)).toBeUndefined();
        });
        it('throw error when the beverage type is not allowed', async () => {
            await testsUtil.setSettings(1000, ['Tea']);
            let order = {
                drinkSize : 'Medium'
            };
            let beverage = {
                type : 'Coffee'
            }
            await expect(ordersControllerUtil.validateBeverage(order, beverage))
            .rejects
            .toThrow('Can only create orders for beverages of the following type: Tea');
        });
        it('throw error when reservoir does not have enough water', async () => {
            await testsUtil.setSettings(100, ['Tea']);
            let order = {
                drinkSize : 'Medium'
            };
            let beverage = {
                type : 'Tea'
            }
            await expect(ordersControllerUtil.validateBeverage(order, beverage))
            .rejects
            .toThrow('Not enough water in the reservoir for your order');
        });
    });
    describe('anyInProgressOrders', ()=> {
        it('return true if there is an order in progress', async () => {
            await testsUtil.createOrderWithStatus('In Progress');
            expect(await ordersControllerUtil.anyInProgressOrders()).toBeTruthy();
        });
        it('return false if there is not an order in progress', async () => {
            await testsUtil.createOrderWithStatus('In Queue');
            expect(await ordersControllerUtil.anyInProgressOrders()).toBeFalsy();
        });
    })
});

