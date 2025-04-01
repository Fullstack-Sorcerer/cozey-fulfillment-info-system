import { render, screen, fireEvent } from "@testing-library/react";
import { DateForm } from "../dateform";

describe("DateForm Component", () => {
  test("renders correctly with label, input, and button", () => {
    render(<DateForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/select date:/i)).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("updates input value when user types a date", () => {
    render(<DateForm onSubmit={jest.fn()} />);
    const input = screen.getByTestId("date-input");
    
    fireEvent.change(input, { target: { value: "2025-04-01" } });
    expect(input).toHaveValue("2025-04-01");
  });

  test("calls onSubmit with correct date when form is submitted", () => {
    const mockSubmit = jest.fn();
    render(<DateForm onSubmit={mockSubmit} />);
    const input = screen.getByTestId("date-input");
    const button = screen.getByRole("button", { name: /submit/i });
    
    fireEvent.change(input, { target: { value: "2025-04-01" } });
    fireEvent.click(button);
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith("2025-04-01");
  });

  test("does not call onSubmit if input is empty", () => {
    const mockSubmit = jest.fn();
    render(<DateForm onSubmit={mockSubmit} />);
    const button = screen.getByRole("button", { name: /submit/i });
    
    fireEvent.click(button);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
