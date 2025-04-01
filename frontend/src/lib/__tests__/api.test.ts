import { fetchPickingList, fetchPackingList } from "../api";

global.fetch = jest.fn();

describe("API functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetchPickingList calls correct endpoint and returns data", async () => {
    const mockResponse = { products: { "Widget A": 3, "Widget B": 5 } };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchPickingList("2025-04-01");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/picking-list?date=2025-04-01");
    expect(result).toEqual(mockResponse.products);
  });

  test("fetchPickingList throws an error on failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(fetchPickingList("2025-04-01")).rejects.toThrow(
      "Failed to fetch list of products to pick!"
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/picking-list?date=2025-04-01");
  });

  test("fetchPackingList calls correct endpoint and returns data", async () => {
    const mockResponse = { orders: [{ orderId: 1, orderDate: "2025-04-01" }] };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await fetchPackingList("2025-04-01");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/packing-list?date=2025-04-01");
    expect(result).toEqual(mockResponse.orders);
  });

  test("fetchPackingList throws an error on failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(fetchPackingList("2025-04-01")).rejects.toThrow(
      "Failed to fetch list of orders to pack!"
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:5000/packing-list?date=2025-04-01");
  });
});
