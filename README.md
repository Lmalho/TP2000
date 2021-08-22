# TP2000
Advice Front challenge to implement an API for the TP2000 tea brewer

 
- [API Planning](#api-planning)

# Description

Simple API to create beverages and orders

# API Planning 

 ## Beverage 

| Path                  | Methods          |
| --------------------- | ---------------- |
| beverage/             | GET, POST        |
| beverage/{beverageId} | GET, PUT, DELETE |

 ## Order 

| Path            | Methods   |
| --------------- | --------- |
| order/          | GET, POST |
| order/{orderId} | GET, PUT  |

    
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

The expected values for the order will be "In Queue" , "In progress", "Complete"

### Settings

This is the model of the basic setting of the brewer, it will hold the information of how much water is in the tank in mililiters and also the current volumes for the beverage sizes.

```
{
	"reservoir" : "1000",
	"drinkSize" : 
        [
			 { "size" : "Small" , "volume" : 100},
             { "size" : "Medium" , "volume" : 250},
             { "size" : "Large" , "volume" : 400}
		]
}
```
