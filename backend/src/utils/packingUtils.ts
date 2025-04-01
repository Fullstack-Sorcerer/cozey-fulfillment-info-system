import { PackingLineItem, PackingOrder } from "../interfaces/packing";
import { lineItem, Order } from "../interfaces/warehouse";
import { getComponentsOfProduct } from "../repositories/productRepository"

export const transformOrdertoPackingFormat = async (order: Order) => {
    let packingFriendlyLineItems: PackingLineItem[] = []

    for (const item of order.lineItems) {
        const packingFriendlyLineItem: PackingLineItem = await lineItemWithComponents(item);
        packingFriendlyLineItems.push(packingFriendlyLineItem)
    }

    const aggregatedPackingFriendlyLineItems = aggregatePackingFriendlyLineItems(packingFriendlyLineItems);


    const packingFriendlyShipping = packingFriendlyShippingSignature(order);
    
    const packingFriendlyOrder: PackingOrder = {
        "orderDate": order.orderDate,
        "lineItems": aggregatedPackingFriendlyLineItems,
        "shipsTo": packingFriendlyShipping
    }

    return packingFriendlyOrder;

}

export const aggregatePackingFriendlyLineItems = (packingLines: PackingLineItem[]) => {
    const finalAggregatedLines = packingLines.reduce((aggregatedLines: Record<string, PackingLineItem>, currentLine: PackingLineItem) => {
        const { productName } = currentLine;

        if (aggregatedLines[productName]) {
            aggregatedLines[productName].quantity++;
        } else {
            aggregatedLines[productName] = {
                productName: productName,
                components: currentLine.components,
                quantity: 1
            }
        }
        return aggregatedLines;
    }, {} as Record<string, PackingLineItem>)

    return Object.values(finalAggregatedLines);
}

export const lineItemWithComponents = async (lineItem: lineItem) => {
    const components = await getComponentsOfProduct(lineItem.productId);

    const packingFriendlyLineItem: PackingLineItem = {
        "productName": lineItem.productName,
        "components": components,
        "quantity": 1
    }

    return packingFriendlyLineItem;
}

export const packingFriendlyShippingSignature = (order: Order) => {
    return {
        "customerName": order.customer.name,
        "shippingAddress": order.shippingAddress
    }
}