import { Component, Order } from "../interfaces/warehouse";
import { getComponentsOfProduct } from "../repositories/productRepository";

export const productFrequencyInOrder = (order: Order) => {
    const productFrequency: Record<string, number> = {};

    const orderLineItems = order.lineItems;

    return orderLineItems.reduce((pF: Record<string, number>, lineItem: any) => {
        const lineItemProductId: string = lineItem.productId;
        pF[lineItemProductId] = (pF[lineItemProductId] || 0) + 1;
        return pF;
    }, productFrequency)
}

export const aggregateProductFrequenciesAcrossOrders = (orders: Order[]) => {
    const aggregateProductFrequency: Record<string, number> = {};

    return orders.reduce((pF: Record<string, number>, order: any) => {
        const productsInOrder = productFrequencyInOrder(order);
        for (const productId in productsInOrder) {
            pF[productId] = (pF[productId] || 0) + productsInOrder[productId];
        }
        return pF;
    }, aggregateProductFrequency)
}

export const aggregateComponentFrequenciesAcrossProducts = async (productFrequency: Record<string, number>) => {
    const aggregateComponentFrequency: Record<string, number> = {};

    for (const productId in productFrequency) {
        const componentFrequency = productFrequency[productId];
        const productComponents: string[] = await getComponentsOfProduct(productId);
        const productComponentFrequency = productComponents.reduce((pcf, component) => {
            pcf[component] = componentFrequency
            return pcf;
        }, {} as Record<string, number>);

        console.log("productComponentFrequency :", productComponentFrequency);
        
        for (const component in productComponentFrequency) {
            aggregateComponentFrequency[component] = (aggregateComponentFrequency[component] || 0) + productComponentFrequency[component];
        }
    }

    return aggregateComponentFrequency;
}