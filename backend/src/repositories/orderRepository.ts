import { Order } from "../interfaces/warehouse";
import { readJson } from "../utils/fileUtils"

export const getOrdersByDate = async (date: string) => {
    const orders: Order[] = await readJson('orders');
    const ordersOnDate = orders.filter(order => order.orderDate === date);
    return ordersOnDate;
}