import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// To Test
import App from "./App";

// Tests
describe("Renders main page correctly", () => {
  it("Should render the page correctly", async () => {
    // Setup
    render(<App />);
    const h1 = await screen.findByText("Recipe Book");

    // Expectations
    expect(h1).toBeInTheDocument();
  });
});