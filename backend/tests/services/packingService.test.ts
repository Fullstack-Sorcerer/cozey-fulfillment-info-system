import { getOrderListByDate } from "../../src/services/packingService";
import { getOrdersByDate } from "../../src/repositories/orderRepository";
import { transformOrdertoPackingFormat } from "../../src/utils/packingUtils";

import mockOrders from "../mock/orders.json";
import mockTransformedOrders from "../mock/ordersTransformed.json";
import { PackingOrder } from "../../src/interfaces/packing";

jest.mock("../../src/repositories/orderRepository");
jest.mock("../../src/utils/packingUtils");

describe("Packing Service - getOrderListByDate", () => {
    const mockDate = "2024-03-30";
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should return transformed orders with quantities for a given date", async () => {
      const mockOrdersByDate = mockOrders.filter(order => order.orderDate === mockDate);
      (getOrdersByDate as jest.Mock).mockResolvedValue(mockOrdersByDate);
      (transformOrdertoPackingFormat as jest.Mock).mockImplementation(order =>
        mockTransformedOrders.find(o => o.orderDate === order.orderDate && o.shipsTo.customerName === order.customer.name)
      );
  
      const result = await getOrderListByDate(mockDate);
  
      expect(getOrdersByDate).toHaveBeenCalledWith(mockDate);
      expect(transformOrdertoPackingFormat).toHaveBeenCalledTimes(mockOrdersByDate.length);
  
      const expectedOrders = mockTransformedOrders.filter(order => order.orderDate === mockDate);
      console.log("Expected Orders: ", expectedOrders);
      console.log("Result: ", result)
      expect(result).toEqual(expectedOrders);
  
      result.forEach(order => {
        order.lineItems.forEach(item => {
          expect(item).toHaveProperty("quantity");
          expect(typeof item.quantity).toBe("number");
        });
      });
    });
  
    it("should return an empty array when no orders exist for the given date", async () => {
      (getOrdersByDate as jest.Mock).mockResolvedValue([]);
      const result = await getOrderListByDate("2025-01-01");
  
      expect(getOrdersByDate).toHaveBeenCalledWith("2025-01-01");
      expect(transformOrdertoPackingFormat).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  
    it("should handle errors from getOrdersByDate", async () => {
      (getOrdersByDate as jest.Mock).mockRejectedValue(new Error("Database error"));
  
      await expect(getOrderListByDate(mockDate)).rejects.toThrow("Database error");
  
      expect(getOrdersByDate).toHaveBeenCalledWith(mockDate);
      expect(transformOrdertoPackingFormat).not.toHaveBeenCalled();
    });
  
    it("should handle errors from transformOrdertoPackingFormat", async () => {
      (getOrdersByDate as jest.Mock).mockResolvedValue(mockOrders);
      (transformOrdertoPackingFormat as jest.Mock).mockImplementation(() => {
        throw new Error("Transformation error");
      });
  
      await expect(getOrderListByDate(mockDate)).rejects.toThrow("Transformation error");
  
      expect(getOrdersByDate).toHaveBeenCalledWith(mockDate);
      expect(transformOrdertoPackingFormat).toHaveBeenCalled();
    });
  });
