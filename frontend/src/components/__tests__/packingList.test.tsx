import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PackingList } from "../packingList";
import { fetchPackingList } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  fetchPackingList: jest.fn(),
}));

describe("PackingList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with title and form", () => {
    render(<PackingList />);

    expect(screen.getByRole("heading", { level: 1, name: /Packing List/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Date:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("displays 'No orders' message when no data is returned", async () => {
    (fetchPackingList as jest.Mock).mockResolvedValueOnce([]);

    render(<PackingList />);

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/No orders to pack for selected date/i)).toBeInTheDocument();
    });

    expect(fetchPackingList).toHaveBeenCalledTimes(1);
    expect(fetchPackingList).toHaveBeenCalledWith("2025-04-01");
  });

  test("displays fetched packing list correctly", async () => {
    const mockData = [
      {
        orderDate: "2025-04-01",
        lineItems: [
          { productName: "Widget A", quantity: 3, components: ["Screw", "Bolt"] },
          { productName: "Widget B", quantity: 5, components: ["Nut", "Washer"] },
        ],
        shipsTo: { customerName: "John Doe", shippingAddress: "123 Elm St" },
      },
    ];

    (fetchPackingList as jest.Mock).mockResolvedValueOnce(mockData);

    render(<PackingList />);

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Order #1")).toBeInTheDocument();
      expect(screen.getByText("Order Date: 2025-04-01")).toBeInTheDocument();
      expect(screen.getByText("Widget A (Quantity: 3)")).toBeInTheDocument();
      expect(screen.getByText("Widget B (Quantity: 5)")).toBeInTheDocument();
      expect(screen.getByText("Screw")).toBeInTheDocument();
      expect(screen.getByText("Bolt")).toBeInTheDocument();
      expect(screen.getByText("Nut")).toBeInTheDocument();
      expect(screen.getByText("Washer")).toBeInTheDocument();
      expect(screen.getByText("1. John Doe")).toBeInTheDocument();
      expect(screen.getByText("2. 123 Elm St")).toBeInTheDocument();
    });

    expect(fetchPackingList).toHaveBeenCalledTimes(1);
    expect(fetchPackingList).toHaveBeenCalledWith("2025-04-01");
  });

  test("handles multiple fetches correctly", async () => {
    const firstResponse = [
      {
        orderDate: "2025-04-01",
        lineItems: [{ productName: "Item X", quantity: 2, components: ["Part A"] }],
        shipsTo: { customerName: "Alice", shippingAddress: "456 Oak St" },
      },
    ];

    const secondResponse = [
      {
        orderDate: "2025-04-02",
        lineItems: [{ productName: "Item Y", quantity: 4, components: ["Part B"] }],
        shipsTo: { customerName: "Bob", shippingAddress: "789 Pine St" },
      },
    ];

    (fetchPackingList as jest.Mock)
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    render(<PackingList />);

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Item X (Quantity: 2)")).toBeInTheDocument();
      expect(screen.getByText("Part A")).toBeInTheDocument();
      expect(screen.getByText("1. Alice")).toBeInTheDocument();
      expect(screen.getByText("2. 456 Oak St")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-02" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Item Y (Quantity: 4)")).toBeInTheDocument();
      expect(screen.getByText("Part B")).toBeInTheDocument();
      expect(screen.getByText("1. Bob")).toBeInTheDocument();
      expect(screen.getByText("2. 789 Pine St")).toBeInTheDocument();
    });

    expect(fetchPackingList).toHaveBeenCalledTimes(2);
    expect(fetchPackingList).toHaveBeenCalledWith("2025-04-01");
    expect(fetchPackingList).toHaveBeenCalledWith("2025-04-02");
  });
});
