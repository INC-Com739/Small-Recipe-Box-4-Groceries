import { describe, it, expect } from "vitest";
import React from "react";

const App: React.FC = () => {
  return <h1>Recipe Book</h1>;
};
import { render, screen } from "@testing-library/react";
export default App;


// Tests
describe("Renders main page correctly", () => {
  it("Should render the page correctly", async () => {
    render(<App/>);
    const h1 = await screen.findByText("Recipe Book");
    expect(h1).toBeInTheDocument();
  });
});