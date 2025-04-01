import { Component } from "./warehouse"

export interface PackingOrder {
    orderDate: string;
    lineItems: PackingLineItem[];
    shipsTo: ShippingSignature;
}

export interface PackingLineItem {
    productName: string,
    components: string[],
    quantity: number
}

export interface ShippingSignature {
    customerName: string;
    shippingAddress: string;
}