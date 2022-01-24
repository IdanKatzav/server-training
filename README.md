#Ama-Romach server
___
> Server side to Ama-romach store.

## Technology 
* Node.js
* Typescript
* koa

## API 
* /products - GET - get all products from server.
* /product/:id - GET - get single product by id.
* /product/:id - DELETE - delete single product by id, and return it. id is string 
* /product/:id - UPDATE - update single product by id, and return it. gets Product in requestBody.
* /product - POST   - create single product, and return it. gets Product in requestBody.

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

##How to start server
> run command : npm start