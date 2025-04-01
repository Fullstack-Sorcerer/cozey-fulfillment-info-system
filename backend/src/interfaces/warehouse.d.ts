
export interface Order {
    orderId: string,
    orderTotal: number,
    orderDate: string,
    shippingAddress: string,
    customer: {
        name: string,
        email: string
    },
    lineItems: lineItem[]
}

export interface lineItem {
    lineItemId: string,
    productId: string,
    productName: string,
    price: number
}

export interface Product {
    productId: string,
    components: Component[]
}

export interface Component {
    componentId: string,
    componentName: string
}
