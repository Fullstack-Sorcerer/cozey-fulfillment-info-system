import { getPickingListByDate } from "../../src/services/pickingService";
import { getOrdersByDate } from "../../src/repositories/orderRepository";
import { aggregateProductFrequenciesAcrossOrders, aggregateComponentFrequenciesAcrossProducts } from "../../src/utils/pickingUtils";
import mockOrders from "../mock/orders.json";
import mockProductFrequencies from "../mock/productFrequenciesAcrossOrders.json";
import mockComponentFrequencies from "../mock/componentFrequenciesAcrossOrders.json";

jest.mock("../../src/repositories/orderRepository");
jest.mock("../../src/utils/pickingUtils");

describe("getPickingListByDate", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return aggregated component frequencies for a valid date", async () => {
        (getOrdersByDate as jest.Mock).mockResolvedValue(mockOrders);
        (aggregateProductFrequenciesAcrossOrders as jest.Mock).mockReturnValue(mockProductFrequencies);
        (aggregateComponentFrequenciesAcrossProducts as jest.Mock).mockReturnValue(mockComponentFrequencies);

        const result = await getPickingListByDate("2024-03-30");

        expect(getOrdersByDate).toHaveBeenCalledWith("2024-03-30");
        expect(aggregateProductFrequenciesAcrossOrders).toHaveBeenCalledWith(mockOrders);
        expect(aggregateComponentFrequenciesAcrossProducts).toHaveBeenCalledWith(mockProductFrequencies);
        expect(result).toEqual(mockComponentFrequencies);
    });

    it("should return an empty object when no orders are found", async () => {
        (getOrdersByDate as jest.Mock).mockResolvedValue([]);
        (aggregateProductFrequenciesAcrossOrders as jest.Mock).mockReturnValue({});
        (aggregateComponentFrequenciesAcrossProducts as jest.Mock).mockReturnValue({});

        const result = await getPickingListByDate("2024-03-30");

        expect(getOrdersByDate).toHaveBeenCalledWith("2024-03-30");
        expect(result).toEqual({});
    });

    it("should handle errors thrown by getOrdersByDate", async () => {
        (getOrdersByDate as jest.Mock).mockRejectedValue(new Error("Database error"));

        await expect(getPickingListByDate("2024-03-30")).rejects.toThrow("Database error");
        expect(getOrdersByDate).toHaveBeenCalledWith("2024-03-30");
    });

    it("should handle errors thrown by aggregateProductFrequenciesAcrossOrders", async () => {
        (getOrdersByDate as jest.Mock).mockResolvedValue([{ orderId: "1", lineItems: [] }]);
        (aggregateProductFrequenciesAcrossOrders as jest.Mock).mockImplementation(() => {
            throw new Error("Aggregation error");
        });

        await expect(getPickingListByDate("2024-03-30")).rejects.toThrow("Aggregation error");
    });

    it("should handle errors thrown by aggregateComponentFrequenciesAcrossProducts", async () => {
        (getOrdersByDate as jest.Mock).mockResolvedValue([{ orderId: "1", lineItems: [] }]);
        (aggregateProductFrequenciesAcrossOrders as jest.Mock).mockReturnValue({ p1: 2 });
        (aggregateComponentFrequenciesAcrossProducts as jest.Mock).mockImplementation(() => {
            throw new Error("Component aggregation error");
        });

        await expect(getPickingListByDate("2024-03-30")).rejects.toThrow("Component aggregation error");
    });
});
