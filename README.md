# <<< Challenge Cart/Product >>>

# The Challenge:

The purpose of this test is to assess your abilities to create and structure applications, using [NodeJS](https://nodejs.org/en/) and [Typescript](https://www.typescriptlang.org/). Three applications should be developed, a Rest Api , a product microservice and a shopping cart micro-service, the communication between the applications can be done by Http.

## Requirements

* Endpoint that returns a list of products, these products must be obtained
from the Product microservice.
* Endpoint to add a product to the shopping cart, you must communicate shopping cart micro-service.
* Endpoint to remove a product from the shopping cart, you must communicate shopping cart micro-service.
* Endpoint to get the shopping cart, you must communicate micro-service of Shopping cart.

### Product Microservice:
* You must connect to a NoSql database (example: https://www.mongodb.com/) to obtain products, an ODM can be used (example: https://mongoosejs.com/).

### Cart Micro-Service:
* You should connect to an SQL database (example: https://www.postgresql.org/), for persistence of cart products, the ORM https://typeorm.io/#/.

## Extra:
* Using the NestJS framework (https://nestjs.com/).
* Applying unit tests.
* Develop authentication component.
* Documentation


# Run project:
Run the following command to clone the repository:
```
  git clone https://github.com/GOlmedoFormosa/KK-ECommerce-Challenge
```
Move to the generated directory with the following command
```
  cd KK-ECommerce-Challenge
```
Docker and Docker Compose are required to run the project. I ran out of time so I didn't get to install something like @nestjs/config to handle .env files, so you don't need to configure anything, you just need to run `docker-compose up`, and the projects should work in `http://localhost:8080/api/{products|auth|cart}`.
```
  docker-compose up
```
Please note that due to the number of images and dependency installations, it may take some time to install everything. However this will only happen when running the project for the first time, in the following occasions the project will run much faster.

# Run tests:
Unfortunately also due to lack of time I only got to create tests for the product service. To run them you have to move to the project folder (product-service) from the command console and run `yarn test`.

# Documentation
The documentation for the services are available at the following URLs:
- User-Service:    [http://localhost:8080/api/auth/docs](http://localhost:8080/api/auth/docs)
- Product-Service: [http://localhost:8080/api/product/docs](http://localhost:8080/api/product/docs)
- Cart-Service:    [http://localhost:8080/api/cart/docs](http://localhost:8080/api/cart/docs)

# Some comments

- When you start the project you run a seeder with products so you don't have to add them one by one, however there is the endpoint to add products (note that you need to be logged in to add products).
- Do not add any migration to add users, because when you enter the swagger doc, in the register and login part there are already default values so you can generate a user and test the app with a few clicks.
- The authentication is done with jwt and cookies, the cookies go with httpOnly for security.
- This assuming that there is always a user logged in was a problem for me, what I did was to leave the endpoint to get cart, and add and remove products without being authenticated, in the same way the endpoint to get cart requires a user id.
- I added an extra endpoint in the cart for checkout, this endpoint does require authentication.
