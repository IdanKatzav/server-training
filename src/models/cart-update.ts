export interface CartUpdate {
    name: string,
    amount: number,
    action: actionType
}

type actionType = 'RELEASED' | 'OCCUPIED'