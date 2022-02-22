import { gql} from "apollo-server";

export const CartTypeDefs = gql`
  
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
        updateCart(cartUpdate: InputCartUpdate!)
    }
    
    type Subscription {
        updateCart: CartUpdate
    } 
`;