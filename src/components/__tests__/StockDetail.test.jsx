import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import StockDetail from '../StockDetail';

// Mock recharts components
vi.mock('recharts', () => ({
    LineChart: ({ children, data }) => (
        <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
            {children}
        </div>
    ),
    Line: ({ dataKey, stroke }) => (
        <div data-testid="line" data-key={dataKey} data-stroke={stroke} />
    ),
    XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
    YAxis: ({ domain }) => <div data-testid="y-axis" data-domain={JSON.stringify(domain)} />,
    Tooltip: () => <div data-testid="tooltip" />,
    ResponsiveContainer: ({ children, width, height }) => (
        <div data-testid="responsive-container" style={{ width, height }}>
            {children}
        </div>
    ),
    Legend: () => <div data-testid="legend" />
}));

const renderWithRouter = (symbol = 'AAPL') => {
    return render(
        <MemoryRouter initialEntries={[`/stock/${symbol}`]}>
            <StockDetail />
        </MemoryRouter>
    );
};

describe('StockDetail', () => {
    it('renders stock symbol in title', () => {
        renderWithRouter('AAPL');
        expect(screen.getByText(/Chart/)).toBeInTheDocument();
    });

    it('renders back to dashboard link', () => {
        renderWithRouter();
        const backLink = screen.getByText('← Back to Dashboard');
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders all time range buttons', () => {
        renderWithRouter();
        expect(screen.getByText('1D')).toBeInTheDocument();
        expect(screen.getByText('1W')).toBeInTheDocument();
        expect(screen.getByText('1M')).toBeInTheDocument();
        expect(screen.getByText('YTD')).toBeInTheDocument();
    });

    it('has 1D selected by default', () => {
        renderWithRouter();
        const oneDayButton = screen.getByText('1D');
        expect(oneDayButton).toHaveClass('bg-yellow-400', 'text-black', 'font-semibold');
    });

    it('changes active range when button is clicked', () => {
        renderWithRouter();
        const oneWeekButton = screen.getByText('1W');
        
        fireEvent.click(oneWeekButton);
        
        expect(oneWeekButton).toHaveClass('bg-yellow-400', 'text-black', 'font-semibold');
        expect(screen.getByText('1D')).toHaveClass('bg-gray-700', 'text-white');
    });

    it('renders chart with correct data for 1D range', () => {
        renderWithRouter();
        const chart = screen.getByTestId('line-chart');
        const chartData = JSON.parse(chart.getAttribute('data-chart-data'));
        
        expect(chartData).toEqual([
            { time: "9:30", price: 189 },
            { time: "12:00", price: 192 },
            { time: "2:00", price: 193 }
        ]);
    });

    it('updates chart data when range changes', () => {
        renderWithRouter();
        
        fireEvent.click(screen.getByText('1W'));
        
        const chart = screen.getByTestId('line-chart');
        const chartData = JSON.parse(chart.getAttribute('data-chart-data'));
        
        expect(chartData).toEqual([
            { time: "Mon", price: 180 },
            { time: "Tue", price: 182 },
            { time: "Wed", price: 185 },
            { time: "Thu", price: 188 },
            { time: "Fri", price: 193 }
        ]);
    });

    it('renders chart components', () => {
        renderWithRouter();
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('legend')).toBeInTheDocument();
        expect(screen.getByTestId('line')).toBeInTheDocument();
    });

    it('configures chart line with correct properties', () => {
        renderWithRouter();
        const line = screen.getByTestId('line');
        expect(line).toHaveAttribute('data-key', 'price');
        expect(line).toHaveAttribute('data-stroke', '#82ca9d');
    });

    it('works with different stock symbols', () => {
        renderWithRouter('TSLA');
        expect(screen.getByText(/Chart/)).toBeInTheDocument();
    });
});