import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import App from "./App.jsx";

// Tests
describe("Renders main page correctly", () => {
  it("Should render the page correctly", async () => {
    render(<App/>);
    const h1 = await screen.findByText("Recipe Book");
    expect(h1).toBeInTheDocument();
  });
});