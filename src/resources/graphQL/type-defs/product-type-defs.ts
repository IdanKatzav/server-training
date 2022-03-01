import { gql} from "apollo-server";

export const productTypeDefs = gql`
    type Product  {
        name: String!
        description:String
        price: Float
        image: String
        limit: Int
    }
    
    input InputProduct  {
        name: String!
        description:String
        price: Float
        image: String
        limit: Int
    }
    
    type Query {
        products: [Product]
        product(name: String!): Product        
    }
    
    type Mutation {
        checkout: [Product]
        deleteProduct(name: String!): Product
        updateProduct(product: InputProduct!): Product
    }
`;