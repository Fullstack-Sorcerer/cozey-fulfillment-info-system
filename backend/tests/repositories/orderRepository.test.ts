import { getOrdersByDate } from '../../src/repositories/orderRepository';
import { readJson } from '../../src/utils/fileUtils';
import mockOrders from '../mock/orders.json';

jest.mock('../../src/utils/fileUtils', () => ({
  readJson: jest.fn(),
}));

describe('getOrdersByDate', () => {
  beforeEach(() => {
    (readJson as jest.Mock).mockReset();
  });

  it('should return orders for a given date', async () => {
    const mockDate = '2024-03-30';
    (readJson as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getOrdersByDate(mockDate);

    const expectedResult = mockOrders.filter(order => order.orderDate === mockDate);

    expect(result).toEqual(expectedResult);
    expect(readJson).toHaveBeenCalledWith('orders');
  });

  it('should return an empty array when there are no orders on the given date', async () => {
    // Setup
    const mockDate = '2024-04-05';
    (readJson as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getOrdersByDate(mockDate);

    expect(result).toEqual([]);
    expect(readJson).toHaveBeenCalledWith('orders');
  });

  it('should handle invalid or malformed date inputs gracefully', async () => {
    const mockDate = 'invalid-date';
    (readJson as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getOrdersByDate(mockDate);

    expect(result).toEqual([]);
    expect(readJson).toHaveBeenCalledWith('orders');
  });

  it('should handle an empty orders list gracefully', async () => {
    const mockDate = '2024-03-30';
    (readJson as jest.Mock).mockResolvedValue([]);

    const result = await getOrdersByDate(mockDate);

    expect(result).toEqual([]);
    expect(readJson).toHaveBeenCalledWith('orders');
  });

  it('should return multiple orders when there are multiple orders on the same date', async () => {
    const mockDate = '2024-03-30';
    (readJson as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getOrdersByDate(mockDate);

    const expectedResult = mockOrders.filter(order => order.orderDate === mockDate);
    expect(result.length).toBeGreaterThan(1);
    expect(result).toEqual(expectedResult);
    expect(readJson).toHaveBeenCalledWith('orders');
  });

  it('should only return orders for the exact matching date', async () => {
    const mockDate = '2024-03-30';
    (readJson as jest.Mock).mockResolvedValue(mockOrders);

    const result = await getOrdersByDate(mockDate);

    const expectedResult = mockOrders.filter(order => order.orderDate === mockDate);
    expect(result).toEqual(expectedResult);

    result.forEach(order => {
      expect(order.orderDate).toBe(mockDate);
    });
  });
});
