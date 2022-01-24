#Ama-Romach server
___
> Server side to Ama-romach store.

## Technology 
* Node.js
* Typescript
* koa

## API 
* /products - GET - get all products from server.
* /products/:id - GET - get single product by id.
* /products/:id - DELETE - delete single product by id, and return it. id is string 
* /products/:id - UPDATE - update single product by id, and return it. gets Product in requestBody.
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

##How to start server
> run command : npm start