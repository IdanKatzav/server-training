export interface CartUpdate {
    productName: string,
    amount: number,
    action: actionType
}

type actionType = 'RELEASE' | 'OCCUPY'