import { gql} from "apollo-server";

export const typeDefs = gql`
    type Product  {
        name: String
        description:String
        price: Float
        image: String
        limit: Int
        amountInStock: AmountInStock
    }
    
    type AmountInStock {
        totalAmount: Int
        released: Int
    }
    
    type UpdateProductAmount {
        productName: String!
        newAmount: Int!
    }
    
    type Query {
        products:[Product]
        product(productName: String!): Product        
    }
    
    type Mutation {
        updateStock(products:[UpdateProductAmount]!): [Product]
        updateReleased(products:[UpdateProductAmount]!): [Product]
    }
    
    type Subscription {
        updateStock(products:[UpdateProductAmount]!): [UpdateProductAmount]
        updateReleased(products:[UpdateProductAmount]!): [UpdateProductAmount]
    }
    
`;