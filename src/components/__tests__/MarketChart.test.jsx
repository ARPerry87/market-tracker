import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MarketChart from '../MarketChart';
import * as finnhubApi from '../../api/finnhub';
import StockModal from '../StockModal';

// Mock the API module
vi.mock('../../api/finnhub');

// Mock the StockModal component
vi.mock('../StockModal', () => {
  const StockModalMock = vi.fn(({ open }) => open ? <div data-testid="stock-modal">Modal Open</div> : null);
  return { default: StockModalMock };
});

// Mock Recharts components
vi.mock('recharts', () => {
  const LineChart = vi.fn(({ children, onClick, data }) => (
    <div data-testid="line-chart" onClick={() => onClick && onClick({ activePayload: [{ payload: data[0] }] })}>
      {children}
    </div>
  ));
  return {
    LineChart,
    Line: vi.fn(() => <div data-testid="line" />),
    XAxis: vi.fn(() => <div data-testid="x-axis" />),
    YAxis: vi.fn(() => <div data-testid="y-axis" />),
    Tooltip: vi.fn(() => <div data-testid="tooltip" />),
    Legend: vi.fn(() => <div data-testid="legend" />),
    ResponsiveContainer: vi.fn(({ children }) => <div data-testid="responsive-container">{children}</div>)
  };
});

const mockCompanyProfile = {
  name: 'Apple Inc.',
  ticker: 'AAPL',
  exchange: 'NASDAQ',
  finnhubIndustry: 'Technology'
};

const mockQuote = {
  c: 190.5,
  pc: 189.3
};

describe('MarketChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    finnhubApi.fetchCompanyProfile.mockResolvedValue(mockCompanyProfile);
    finnhubApi.fetchQuote.mockResolvedValue(mockQuote);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders with default symbol AAPL', async () => {
    await act(async () => {
      render(<MarketChart />);
    });
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with custom symbol', async () => {
    const msftProfile = { ...mockCompanyProfile, name: 'Microsoft Corp.', ticker: 'MSFT' };
    finnhubApi.fetchCompanyProfile.mockResolvedValueOnce(msftProfile);
    await act(async () => {
      render(<MarketChart symbol="MSFT" />);
    });
    await waitFor(() => {
      expect(screen.getByText('Microsoft Corp. (MSFT)')).toBeInTheDocument();
    });
  });

  it('displays company information after loading', async () => {
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('Apple Inc. (AAPL)')).toBeInTheDocument();
    });
    expect(screen.getByText('NASDAQ - Technology')).toBeInTheDocument();
  });

  it('displays percentage change with correct color for positive change', async () => {
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      const percentElement = screen.getByText('+0.63%');
      expect(percentElement).toBeInTheDocument();
      expect(percentElement).toHaveClass('text-green-400');
    });
  });

  it('displays percentage change with correct color for negative change', async () => {
    const negativeQuote = { c: 185.0, pc: 189.3 };
    finnhubApi.fetchQuote.mockResolvedValue(negativeQuote);
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      const percentElement = screen.getByText('-2.27%');
      expect(percentElement).toBeInTheDocument();
      expect(percentElement).toHaveClass('text-red-400');
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    finnhubApi.fetchCompanyProfile.mockRejectedValue(new Error('API Error'));
    finnhubApi.fetchQuote.mockRejectedValue(new Error('API Error'));
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading company/quote:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('opens modal when chart is clicked', async () => {
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('Apple Inc. (AAPL)')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('line-chart'));
    expect(screen.getByTestId('stock-modal')).toBeInTheDocument();
  });

  it('handles chart click with no active payload', async () => {
    const { LineChart } = await vi.importMock('recharts');
    LineChart.mockImplementation(({ onClick }) => (
      <div data-testid="line-chart" onClick={() => onClick && onClick({})} />
    ));
    render(<MarketChart symbol="AAPL" />);
    fireEvent.click(screen.getByTestId('line-chart'));
    expect(screen.queryByTestId('stock-modal')).not.toBeInTheDocument();
  });

  it('calculates price change correctly for modal', async () => {
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('Apple Inc. (AAPL)')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('line-chart'));
    expect(StockModal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: true,
        info: expect.objectContaining({
          company: mockCompanyProfile,
          time: '9:30',
          price: 189.3,
          openPrice: 189.3,
          priceChange: 0,
          percentChange: '0.00'
        })
      }),
      undefined
    );
  });

  it('closes modal when onClose is called', async () => {
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('Apple Inc. (AAPL)')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('line-chart'));
    const onClose = StockModal.mock.calls.at(-1)[0].onClose;
    await act(async () => {
      onClose();
    });
    await waitFor(() => {
      expect(StockModal).toHaveBeenLastCalledWith(
        expect.objectContaining({ open: false }),
        undefined
      );
    });
  });
  it('renders without quote data', async () => {
    finnhubApi.fetchQuote.mockResolvedValue(null);
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });
  });

  it('renders without company data', async () => {
    finnhubApi.fetchCompanyProfile.mockResolvedValue(null);
    render(<MarketChart symbol="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });
  });
});
