import { getOrdersByDate } from "../repositories/orderRepository"
import { aggregateComponentFrequenciesAcrossProducts, aggregateProductFrequenciesAcrossOrders } from "../utils/pickingUtils";

export const getPickingListByDate = async (date: string) => {

    const orders = await getOrdersByDate(date);

    const productFrequenciesAcrossOrders = aggregateProductFrequenciesAcrossOrders(orders);
    
    const componentFrequenciesAcrossOrders = aggregateComponentFrequenciesAcrossProducts(productFrequenciesAcrossOrders);

    return componentFrequenciesAcrossOrders;
}