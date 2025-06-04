import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LiveQuotes from '../LiveQuotes';

// Mock the LiveQuote component
vi.mock('../LiveQuote', () => ({
    default: ({ symbol }) => <div data-testid={`live-quote-${symbol}`}>{symbol}</div>
}));

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('LiveQuotes', () => {
    it('renders without crashing', () => {
        renderWithRouter(<LiveQuotes />);
    });

    it('renders all expected stock symbols', () => {
        renderWithRouter(<LiveQuotes />);
        
        expect(screen.getByTestId('live-quote-AAPL')).toBeInTheDocument();
        expect(screen.getByTestId('live-quote-TSLA')).toBeInTheDocument();
        expect(screen.getByTestId('live-quote-GOOGL')).toBeInTheDocument();
        expect(screen.getByTestId('live-quote-MSFT')).toBeInTheDocument();
    });

    it('renders correct number of LiveQuote components', () => {
        renderWithRouter(<LiveQuotes />);
        
        const liveQuotes = screen.getAllByTestId(/live-quote-/);
        expect(liveQuotes).toHaveLength(4);
    });

    it('applies correct CSS classes for responsive grid layout', () => {
        const { container } = renderWithRouter(<LiveQuotes />);
        
        const gridContainer = container.firstChild;
        expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4');
    });

    it('passes correct symbol prop to each LiveQuote component', () => {
        renderWithRouter(<LiveQuotes />);
        
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('TSLA')).toBeInTheDocument();
        expect(screen.getByText('GOOGL')).toBeInTheDocument();
        expect(screen.getByText('MSFT')).toBeInTheDocument();
    });
});