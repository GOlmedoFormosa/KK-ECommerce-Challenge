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



# Run the project:

You should have Docker and Docker Compose installed. After running `docker-compose up` the project should be ready on `http://localhost:8080`.

## Documentation

The documentation for the services are available at the following URLs:
- User-Service:    [http://localhost:8080/api/auth/docs](http://localhost:8080/api/auth/docs)
- Product-Service: [http://localhost:8080/api/product/docs](http://localhost:8080/api/product/docs)
- Cart-Service:    [http://localhost:8080/api/cart/docs](http://localhost:8080/api/cart/docs)

