import { PackingOrder } from "../interfaces/packing";
import { getOrdersByDate } from "../repositories/orderRepository"
import { transformOrdertoPackingFormat } from "../utils/packingUtils";

export const getOrderListByDate = async (date: string) => {
    
    const orders = await getOrdersByDate(date);
    
    const packingFriendlyOrders: PackingOrder[] = []


    for (const order of orders) {
        const packingFriendlyOrder: PackingOrder = await transformOrdertoPackingFormat(order);
        packingFriendlyOrders.push(packingFriendlyOrder);
    }

    return packingFriendlyOrders;
}