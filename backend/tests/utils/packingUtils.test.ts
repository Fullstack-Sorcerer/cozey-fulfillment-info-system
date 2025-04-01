import { transformOrdertoPackingFormat, aggregatePackingFriendlyLineItems, lineItemWithComponents, packingFriendlyShippingSignature } from "../../src/utils/packingUtils";
import mockOrders from "../mock/orders.json";
import mockTransformedOrders from "../mock/ordersTransformed.json";
import { getComponentsOfProduct } from "../../src/repositories/productRepository";

jest.mock("../../src/repositories/productRepository");

describe("Packing Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("transformOrdertoPackingFormat", () => {
    it("should correctly transform an order to the packing format", async () => {
      const order = mockOrders[0];

      (getComponentsOfProduct as jest.Mock).mockResolvedValueOnce([
        "Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"
      ]);
      (getComponentsOfProduct as jest.Mock).mockResolvedValueOnce([
        "Birthday cupcake", "$100 Visa Gift Card", "Birthday card"
      ]);
      (getComponentsOfProduct as jest.Mock).mockResolvedValueOnce([
        "Bottle of wine", "Fruit basket", "Pen"
      ]);

      const result = await transformOrdertoPackingFormat(order);

      expect(result).toEqual(mockTransformedOrders[0]);
    });

    it("should handle empty order", async () => {
      const order = {
        orderId: "empty",
        orderTotal: 0,
        orderDate: "2024-01-01",
        shippingAddress: "No Address",
        customer: {
          name: "No Customer",
          email: "no.customer@example.com",
        },
        lineItems: [],
      };

      const result = await transformOrdertoPackingFormat(order);

      expect(result).toEqual({
        orderDate: "2024-01-01",
        lineItems: [],
        shipsTo: {
          customerName: "No Customer",
          shippingAddress: "No Address",
        },
      });
    });
  });

  describe("aggregatePackingFriendlyLineItems", () => {
    it("should aggregate line items correctly", () => {
      const packingLineItems = [
        { productName: "Valentines Box", components: ["Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"], quantity: 1 },
        { productName: "Birthday Box", components: ["Birthday cupcake"], quantity: 1 },
        { productName: "Valentines Box", components: ["Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"], quantity: 1 },
      ];

      const result = aggregatePackingFriendlyLineItems(packingLineItems);
      console.log("APFLI, :", result);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        productName: "Valentines Box",
        components: ["Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"],
        quantity: 2,
      });
      expect(result[1]).toEqual({
        productName: "Birthday Box",
        components: ["Birthday cupcake"],
        quantity: 1,
      });
    });
  });

  describe("lineItemWithComponents", () => {
    it("should correctly map line items with components", async () => {
      const lineItem = { lineItemId: "101", productId: "valentines-box", productName: "Valentines Box", price: 40, quantity: 1 };

      (getComponentsOfProduct as jest.Mock).mockResolvedValueOnce([
        "Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"
      ]);

      const result = await lineItemWithComponents(lineItem);

      expect(result).toEqual({
        productName: "Valentines Box",
        components: ["Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"],
        quantity: 1,
      });
    });
  });

  describe("packingFriendlyShippingSignature", () => {
    it("should return the correct shipping signature", () => {
      const order = mockOrders[0];
      const result = packingFriendlyShippingSignature(order);

      expect(result).toEqual({
        customerName: order.customer.name,
        shippingAddress: order.shippingAddress,
      });
    });
  });
});
