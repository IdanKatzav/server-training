#Ama-Romach server
___
> Server side to Ama-romach store.

## Technology 
* Node.js
* Typescript
* koa

## API 
* /products - GET - get all products from server.
* /products/:name - GET - get single product by id.
* /products/:name - DELETE - delete single product by id, and return it. id is string 
* /products/:name - UPDATE - update single product by id, and return it. gets Product in requestBody.
* /products - POST   - create single product, and return it. gets Product in requestBody.

### Product structure
```json
{
  "name": "product",
  "price": 30,
  "limit": 5,
  "description": "product description",
  "image": "/imagePath"
}
```
* `name` property is the unique id of the product

##How to start server
> run command : npm start