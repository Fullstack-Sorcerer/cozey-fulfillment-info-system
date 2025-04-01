import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PickingList } from "../pickingList";
import { fetchPickingList } from "@/lib/api";

jest.mock("@/lib/api", () => ({
  fetchPickingList: jest.fn(),
}));

describe("PickingList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with title and form", () => {
    render(<PickingList />);

    expect(screen.getByRole("heading", { level: 1, name: /Picking List/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Date:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("displays 'No items' message when no data is returned", async () => {
    (fetchPickingList as jest.Mock).mockResolvedValueOnce({});

    render(<PickingList />);
    
    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/No items to pick for the selected date/i)).toBeInTheDocument();
    });

    expect(fetchPickingList).toHaveBeenCalledTimes(1);
    expect(fetchPickingList).toHaveBeenCalledWith("2025-04-01");
  });

  test("displays fetched picking list correctly", async () => {
    const mockData = {
      "Widget A": 3,
      "Widget B": 5,
    };

    (fetchPickingList as jest.Mock).mockResolvedValueOnce(mockData);

    render(<PickingList />);

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Widget A")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 3")).toBeInTheDocument();
      expect(screen.getByText("Widget B")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 5")).toBeInTheDocument();
    });

    expect(fetchPickingList).toHaveBeenCalledTimes(1);
    expect(fetchPickingList).toHaveBeenCalledWith("2025-04-01");
  });

  test("handles multiple fetches correctly", async () => {
    const firstResponse = { "Item X": 2 };
    const secondResponse = { "Item Y": 4 };

    (fetchPickingList as jest.Mock)
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    render(<PickingList />);

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-01" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Item X")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Select Date:/i), { target: { value: "2025-04-02" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Item Y")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 4")).toBeInTheDocument();
    });

    expect(fetchPickingList).toHaveBeenCalledTimes(2);
    expect(fetchPickingList).toHaveBeenCalledWith("2025-04-01");
    expect(fetchPickingList).toHaveBeenCalledWith("2025-04-02");
  });
});
