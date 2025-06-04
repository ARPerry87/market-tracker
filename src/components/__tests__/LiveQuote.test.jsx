/// <reference types="vitest" />
import { vi, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LiveQuote from "../LiveQuote";

vi.mock("../../api/finnhub", () => ({
  fetchQuote: vi.fn(() =>
    Promise.resolve({
      c: 150.0,
      o: 148.0,
      h: 151.0,
      l: 147.5,
      pc: 149.0
    })
  )
}));

test("renders LiveQuote with mock data", async () => {
  render(
    <MemoryRouter>
      <LiveQuote symbol="AAPL" />
    </MemoryRouter>
  );

  expect(screen.getByText(/AAPL/i)).toBeInTheDocument();

  const currentPrice = await screen.findByText("$150.00");
  expect(currentPrice).toBeInTheDocument();
});
