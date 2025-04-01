import { productFrequencyInOrder, aggregateProductFrequenciesAcrossOrders, aggregateComponentFrequenciesAcrossProducts } from "../../src/utils/pickingUtils";
import mockOrders from "../mock/orders.json";
import mockOrderMultipleSameProduct from "../mock/orderWithMultipleSameProduct.json"
import { getComponentsOfProduct } from "../../src/repositories/productRepository";

jest.mock("../../src/repositories/productRepository", () => ({
  getComponentsOfProduct: jest.fn(),
}));

describe("Picking Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("productFrequencyInOrder", () => {
    it("should return correct product frequencies for a single order", () => {
      const order = mockOrders[0];

      const result = productFrequencyInOrder(order);

      expect(result).toEqual({
        "valentines-box": 1,
        "birthday-box": 1,
        "client-gift-box": 1
      });
    });

    it("should handle an order with multiple quantities of the same product", () => {
      const orderWithMultipleSameProduct = mockOrderMultipleSameProduct;

      const result = productFrequencyInOrder(orderWithMultipleSameProduct);

      expect(result).toEqual({
        "client-gift-box": 1,
        "valentines-box": 2,
        "birthday-box": 2,
      });
    });
  });

  describe("aggregateProductFrequenciesAcrossOrders", () => {
    it("should correctly aggregate product frequencies across multiple orders", () => {
      const orders = [mockOrders[0], mockOrders[1]];

      (getComponentsOfProduct as jest.Mock).mockResolvedValueOnce([
        "Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"
      ]);
      (getComponentsOfProduct as jest.Mock).mockResolvedValueOnce([
        "Birthday cupcake", "$100 Visa Gift Card", "Birthday card"
      ]);

      const result = aggregateProductFrequenciesAcrossOrders(orders);

      expect(result).toEqual({
        "valentines-box": 2,
        "birthday-box": 1,
        "client-gift-box": 1
      });
    });

    it("should handle an empty array of orders gracefully", () => {
      const result = aggregateProductFrequenciesAcrossOrders([]);
      expect(result).toEqual({});
    });
  });

  describe("aggregateComponentFrequenciesAcrossProducts", () => {
    it("should correctly aggregate component frequencies across products", async () => {
      const productFrequency = {
        "valentines-box": 2,
        "birthday-box": 1,
      };

      (getComponentsOfProduct as jest.Mock)
        .mockResolvedValueOnce(["Red Roses Bouquet", "Box of chocolates", "Love card", "Women's perfume"])
        .mockResolvedValueOnce(["Birthday cupcake", "$100 Visa Gift Card", "Birthday card"]);

      const result = await aggregateComponentFrequenciesAcrossProducts(productFrequency);
      console.log("ACFAP, ", result)


      expect(result).toEqual({
        "Red Roses Bouquet": 2,
        "Box of chocolates": 2,
        "Love card": 2,
        "Women's perfume": 2,
        "Birthday cupcake": 1,
        "$100 Visa Gift Card": 1,
        "Birthday card": 1,
      });
    });

    it("should handle empty productFrequency gracefully", async () => {
      const result = await aggregateComponentFrequenciesAcrossProducts({});
      expect(result).toEqual({});
    });
  });
});
