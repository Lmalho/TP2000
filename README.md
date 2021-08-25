# TP2000
Advice Front challenge to implement an API for the TP2000 tea brewer

 
- [API Planning](#api-planning)
- [Dependencies](#dependencies)
- [Try It](#try-it)
- [Tests](#tests)

# Description

A NodeJS API using express and mongoose to connect to a MongoDB database.



# API Planning 

 ## Beverage 

 Beverage should have a name, a type, a brewing temperature and an optional garnish.

Expectations: 

	- Add a beverage
	- Get a list of all beverages
	- Get the characteristics of a single beverage
	- Update the characteristics of a beverage
	- Remove a beverage

Planned Routes

| Path                  | Methods          |
| --------------------- | ---------------- |
| beverage/             | GET, POST        |
| beverage/:beverageId | GET, PUT, DELETE |

POST beverage/ 

	Scenarios
		- Create a beverage with all the characteristics
		- Create a beverage without the optional characteristic (garnish)
		- Allow beverages of different types to be created

GET beverage

	Scenarios
		- Get a list of all existing beverages

GET beverage/:beverageId

	Scenarios
		- Get single beverage 

PUT beverage/:beverageId

	Scenarios
		- Update a single characteristic
		- Update multiple characteristics

DELETE beverage/:beverageId

	Scenarios
		- Delete a beverage

 ## Order 

Orders are placed by users (identified by a simple username) who specify a beverage (from
the list of existing beverages) and the size of the drink they want (small, medium, or large);
Should refuse to brew anything other than tea;
Shouldn't allow the creation of new orders if there isn't enough water in the teapot.

Expectations: 

	- Create an order
	- Get a list of all orders
	- Get the characteristics of a single order
	- Complete an order


| Path                     | Methods   |
| ------------------------ | --------- |
| order/                   | GET, POST |
| order/{orderId}          | GET       |
| order/{orderId}/complete | PUT       |

POST order/

	Scenarios
		- Create an order with a username, an existing beverage of the teapot and a size
		- If at the time of creation another order is in progress, it will go to a queue
		- Will only create if it is an order for an existing beverage 
		- Will only create if the beverage is of type 'Tea'
		- Will only create it there's enough water in the teapot

GET order/

	Scenarios
		- Get a list of all orders
GET order/{orderId}

	Scenarios
		- Get single order
  
PUT order/{orderId}/complete

	Scenarios
		- Set an order as Complete
		- Can only Complete orders that are in progress

    
## Models 

### Beverage 

The basic settings expected for the beverage are as follow:

```
{	
	"name": "Black Tea",
	"type": "Tea"
	"temperature": "100",
	"garnish": "lemon"	
}
```

### Order 

The basic settings expected for the order are the user who created the order, what beverage was ordered and its size. 
It will also hold the current status of the order. 

```
{
	"username" : "John"
	"beverage" : {beverageId},
	"size" : "Small",	
	"status" : "In Queue"	
}
```

The expected values for the order will be "In Queue" , "In progress", "Completed"

### Settings

This is the model of the basic setting of the brewer, it will hold the information of how much water is in the tank in mililiters, current volumes for the beverage sizes and what beverages are alowed to be brewed

```
{
	"reservoir" : "1000",
	"drinkSize" : 
        [
			 { "size" : "Small" , "volume" : 100},
             { "size" : "Medium" , "volume" : 250},
             { "size" : "Large" , "volume" : 400}
		],
	allowedBeverages : ["Tea"]
}
```

# Dependencies

The Api requires a MongoDB to be used, it's where the data for teapot is stored. The MongoDB connection string must be stored as an environment setting.

	Example of .env configuration
		mongoDB=mongodb://localhost:27017/tp2000?readPreference=primary&ssl=false

# Try it

## 1 - Set up a nodemon.js file with

```
{
	 "env" : {
        "port" : 3000,
        "mongoDB" : "{mongodbConnectionString}",
        "morganLogLevel" : "dev"
    }
}
```
## 2 - Install Depedencies

	npm install

## 3 - Run

	npm start

# Tests

To run the test suites 

## 1 - Make sure the following dev dependencies are installed

	"jest": "^27.0.6",
    "mongodb-memory-server": "^7.3.6",
	"supertest": "^6.1.6"

## 2 - Run

	npm test

