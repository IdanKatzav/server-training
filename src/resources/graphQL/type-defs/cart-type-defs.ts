import { gql} from "apollo-server";

export const cartTypeDefs = gql`
    type CartUpdate {
        productName: String!
        action: CartAction!
        amount: Int!
    } 
    
    input InputCartUpdate {
        productName: String!
        action: CartAction!
        amount: Int!
    }
    
    enum CartAction {
        OCCUPY,
        RELEASE
    }
    
    type Mutation {
        updateCart(cartUpdate: InputCartUpdate!): CartUpdate
    }
    
    type Subscription {
        updateCart: CartUpdate
    } 
    
    type Query {
        dummy: String
    }
`;