import { render, screen } from "@testing-library/react";
import Navigation from "../nav"
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Navigation Component", () => {
  test("renders the navigation bar", () => {
    render(<Navigation />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("displays the correct title", () => {
    render(<Navigation />);
    expect(
      screen.getByText("Fulfillment Information Service")
    ).toBeInTheDocument();
  });

  test("renders all navigation links with correct href", () => {
    render(<Navigation />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.getByRole("link", { name: /packing order info/i })
    ).toHaveAttribute("href", "/packingpage");
    expect(screen.getByRole("link", { name: /picking list/i })).toHaveAttribute(
      "href",
      "/pickingpage"
    );
  });

  test("allows user to interact with links", async () => {
    render(<Navigation />);
    const user = userEvent.setup();

    const homeLink = screen.getByRole("link", { name: /home/i });
    await user.click(homeLink);

    expect(homeLink).toHaveAttribute("href", "/");
  });
});
