const dbHandler = require('../../dbHandler');
const beveragesController = require('../../../controller/beveragesController');
const testUtil = require('../../testUtil');
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
describe('Tests for beverages Controller', () => {
    describe('post', () => {
        describe('Beverages are created when', () => {
            it('first beverage with all settings', async () => {
                const res = mockResponse();
                let req = {
                    body: {
                       name: "Green Tea",
                       type: "Tea",
                       temperature: 80,
                        garnish: "Orange"
                    }
                }
                await beveragesController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(201);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "New beverage created",
                        beverage: {
                            name: "Green Tea",
                            type: "Tea",
                            temperature: 80,
                            garnish: "Orange"
                        }
                    });
            });
            it('second beverage without garnish', async () => {
                const res = mockResponse();
                let req = {
                    body: {
                       name: "Black Tea",
                       type: "Tea",
                       temperature: 95,
                    }
                }
                await beveragesController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(201);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "New beverage created",
                        beverage: {
                            name: "Black Tea",
                            type: "Tea",
                            temperature: 95,
                            garnish: ""
                        }
                    });
            });
            it('third beverage with coffee type', async () => {
                const res = mockResponse();
                let req = {
                    body: {
                       name: "Espresso",
                       type: "Coffee",
                       temperature: 85,
                    }
                }
                await beveragesController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(201);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "New beverage created",
                        beverage: {
                            name: "Espresso",
                            type: "Coffee",
                            temperature: 85,
                            garnish: ""
                        }
                    });
            });
        })
        describe('Error thrown when', () => {
            it('name already exists', async () => {
                const res1 = mockResponse();
                const res2 = mockResponse();
                let req = {
                    body: {
                       name: "Black Tea",
                       type: "Tea",
                       temperature: 95,
                    }
                }
                await beveragesController.post(req, res1);
                await beveragesController.post(req, res2);
                expect(res2.status.mock.calls[0][0]).toEqual(400);
                expect(res2.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "A beverage with the name Black Tea already exists."
                    });
            });
            it('invalid body', async () => {
                const res = mockResponse();
                let req = {
                    body: {
                       name: "Espresso",
                       type: "Coffee"
                    }
                }
                await beveragesController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(400);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "ValidationError: temperature: Beverage temperature is required"
                    });
            });
            it('invalid type in beverage property', async () => {
                const res = mockResponse();
                let req = {
                    body: {
                       name: "Black Tea",
                       type: "Tea",
                       temperature: "ninety",
                    }
                }
                await beveragesController.post(req, res);
                expect(res.status.mock.calls[0][0]).toEqual(400);
                expect(res.json.mock.calls[0][0]).toMatchObject(
                    {
                        "message": "ValidationError: temperature: \"ninety\" is not a valid number"
                    });
            });
        })
    })
    describe('get', () => {
        it('Get a list of all existing Beverages', async () => {
            // Create two beverages 
            const resPost1 = mockResponse();
            const resPost2 = mockResponse();
            let reqPost1 = {
                body: {
                   name: "Black Tea",
                   type: "Tea",
                   temperature: 95,
                }
            };
            let reqPost2 = {
                body: {
                   name: "Espresso",
                   type: "Coffee",
                   temperature: 85,
                }
            };
            await beveragesController.post(reqPost1, resPost1);
            await beveragesController.post(reqPost2, resPost2);

            //Get all beverages
            const resGet = mockResponse();
            await beveragesController.get(null, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(200);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    count: 2,
                    beverages: [
                        {
                            name: "Black Tea",
                            type: "Tea",
                            temperature: 95,
                            garnish: ""
                        },
                        {
                            name: "Espresso",
                            type: "Coffee",
                            temperature: 85,
                            garnish: ""
                        }
                    ]
                });
        });
        it('Get an empty list', async () => {
            const resGet = mockResponse();
            await beveragesController.get(null, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(200);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    count: 0,
                    beverages: [
                    ]
                });
        });
    });
});
describe('/beverages/:beverageId', () => {
    describe('get', () => {
        it('Gets a beverage when a valid id is sent ', async () => {
            //Create a beverage
            const id = await testUtil.createBeverage();
            //Get a beverage             
            const resGet = mockResponse();
            let reqGet = {
                params: {
                    beverageId: id
                }
            }
            await beveragesController.getById(reqGet, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(200);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    name: "Green Tea",
                    type: "Tea",
                    temperature: 80,
                    garnish: "Orange"
                });
        })
        it('Error thrown when an invalid id is sent', async () => {
            //Get a beverage             
            const resGet = mockResponse();
            let reqGet = {
                params: {
                    beverageId: 'InvalidId'
                }
            }
            await beveragesController.getById(reqGet, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(400);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    message: "No beverage found with that id"
                });
        })
    })
    describe('put', () => {
        describe('Beverages are updated when', () => {
            it('a single property is sent', async () => {
                const id = await testUtil.createBeverage();
                //Updated a beverage             
                const resPut = mockResponse();
                let reqPut = {
                    params: {
                        beverageId: id
                    },
                    body: {
                       temperature: 98
                    }
                }
                await beveragesController.putById(reqPut, resPut);
                expect(resPut.status.mock.calls[0][0]).toEqual(200);
                expect(resPut.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: `Beverage with id ${id} was updated`,
                        beverage: {
                           name: "Green Tea",
                           type: "Tea",
                           temperature: 98,
                            garnish: "Orange"
                        }
                    });
                //Check beverage was updated
                const resGet = mockResponse();
                let reqGet = {
                    params: {
                        beverageId: id
                    }
                }
                await beveragesController.getById(reqGet, resGet);
                expect(resGet.status.mock.calls[0][0]).toEqual(200);
                expect(resGet.json.mock.calls[0][0]).toMatchObject(
                    {
                        name: "Green Tea",
                        type: "Tea",
                        temperature: 98,
                        garnish: "Orange"
                    });
            })
            it('a multiple properties are sent', async () => {
                //Create a beverage
                const resPost = mockResponse();
                const id = await testUtil.createBeverage();
                //Update a beverage             
                const resPut = mockResponse();
                let reqPut = {
                    params: {
                        beverageId: id
                    },
                    body: {
                       temperature: 98,
                        garnish: "Lemon"
                    }
                }
                await beveragesController.putById(reqPut, resPut);
                expect(resPut.status.mock.calls[0][0]).toEqual(200);
                expect(resPut.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: `Beverage with id ${id} was updated`,
                        beverage: {
                           name: "Green Tea",
                           type: "Tea",
                           temperature: 98,
                            garnish: "Lemon"
                        }
                    });
                //Check beverage was updated
                const resGet = mockResponse();
                let reqGet = {
                    params: {
                        beverageId: id
                    }
                }
                await beveragesController.getById(reqGet, resGet);
                expect(resGet.status.mock.calls[0][0]).toEqual(200);
                expect(resGet.json.mock.calls[0][0]).toMatchObject(
                    {
                        name: "Green Tea",
                        type: "Tea",
                        temperature: 98,
                        garnish: "Lemon"
                    });
            })
        })
        describe('Error thrown when', () => {
            it('an invalid id is sent', async () => {
                //Get a beverage             
                const resGet = mockResponse();
                let reqGet = {
                    params: {
                        beverageId: 'InvalidId'
                    }
                }
                await beveragesController.putById(reqGet, resGet);
                expect(resGet.status.mock.calls[0][0]).toEqual(400);
                expect(resGet.json.mock.calls[0][0]).toMatchObject(
                    {
                        message: "No beverage found with that id"
                    });
            });
            it('an update to an already existing name is sent', async () => {
                // Create two beverages 
                const resPost1 = mockResponse();
                const resPost2 = mockResponse();
                let reqPost1 = {
                    body: {
                       name: "Black Tea",
                       type: "Tea",
                       temperature: 95,
                    }
                };
                let reqPost2 = {
                    body: {
                       name: "Espresso",
                       type: "Coffee",
                       temperature: 85,
                    }
                };
                await beveragesController.post(reqPost1, resPost1);
                await beveragesController.post(reqPost2, resPost2);
                let resPost1Id = resPost1.json.mock.calls[0][0].beverage.id.toString();
                //Update a beverage             
                const resPut = mockResponse();
                let reqPut = {
                    params: {
                        beverageId: resPost1Id
                    },
                    body: {
                        name: "Espresso"
                    }
                }
                await beveragesController.putById(reqPut, resPut);
                expect(resPut.status.mock.calls[0][0]).toEqual(400);
                expect(resPut.json.mock.calls[0][0]).toMatchObject(
                    {
                        message:  "A beverage with the name Espresso already exists."
                    });
            });
            it('an invalid property type is sent', async () => {
                //Create a beverage
                const resPost = mockResponse();
                let reqPost = {
                    body: {
                       name: "Green Tea",
                       type: "Tea",
                       temperature: 80,
                        garnish: "Orange"
                    }
                }
                await beveragesController.post(reqPost, resPost);
                let id = resPost.json.mock.calls[0][0].beverage.id.toString();
                //Updated a beverage             
                const resPut = mockResponse();
                let reqPut = {
                    params: {
                        beverageId: id
                    },
                    body: {
                        temperature: "HOT"
                    }
                }
                await beveragesController.putById(reqPut, resPut);
                expect(resPut.status.mock.calls[0][0]).toEqual(400);
                expect(resPut.json.mock.calls[0][0]).toMatchObject(
                    {
                        message : "\"HOT\" is not a valid number",
                    });
            });
        })
    })
    describe('delete', () => {
        it('Removes a beverage when a valid id is sent ', async () => {
            //Create a beverage
            const resPost = mockResponse();
            let reqPost = {
                body: {
                    name: "Green Tea",
                    type: "Tea",
                    temperature: 80,
                    garnish: "Orange"
                }
            }
            await beveragesController.post(reqPost, resPost);
            let id = resPost.json.mock.calls[0][0].beverage.id.toString();

            //Delete a beverage             
            const resDelete = mockResponse();
            let reqDelete = {
                params: {
                    beverageId: id
                }
            }
            await beveragesController.deleteById(reqDelete, resDelete);
            expect(resDelete.status.mock.calls[0][0]).toEqual(200);
            expect(resDelete.json.mock.calls[0][0]).toMatchObject(
                {
                    message: `Beverage with id ${id} was removed`
                });
            //Check beverage was deleted
            const resGet = mockResponse();
            let reqGet = {
                params: {
                    beverageId: id
                }
            }
            await beveragesController.getById(reqGet, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(400);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    message: "No beverage found with that id"
                });
        })
        it('Error thrown when an invalid id is sent', async () => {
            //Get a beverage             
            const resGet = mockResponse();
            let reqGet = {
                params: {
                    beverageId: 'InvalidId'
                }
            }
            await beveragesController.deleteById(reqGet, resGet);
            expect(resGet.status.mock.calls[0][0]).toEqual(400);
            expect(resGet.json.mock.calls[0][0]).toMatchObject(
                {
                    message: "No beverage found with that id"
                });
        })
    })
})


