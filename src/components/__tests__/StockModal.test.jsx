import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StockModal from '../StockModal';

describe('StockModal', () => {
    const mockInfo = {
        company: {
            name: 'Apple Inc.',
            ticker: 'AAPL',
            finnhubIndustry: 'Technology'
        },
        time: '2023-10-15 15:30:00',
        price: 150.25,
        openPrice: 148.50,
        priceChange: 1.75,
        percentChange: 1.18
    };

    it('renders nothing when open is false', () => {
        const { container } = render(
            <StockModal open={false} onClose={() => {}} info={mockInfo} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders nothing when info is null', () => {
        const { container } = render(
            <StockModal open={true} onClose={() => {}} info={null} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders modal with company name when open and info provided', () => {
        render(<StockModal open={true} onClose={() => {}} info={mockInfo} />);
        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    });

    it('renders company ticker when company name is not available', () => {
        const infoWithoutName = {
            ...mockInfo,
            company: { ticker: 'AAPL', finnhubIndustry: 'Technology' }
        };
        render(<StockModal open={true} onClose={() => {}} info={infoWithoutName} />);
        expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    it('displays price information correctly', () => {
        render(<StockModal open={true} onClose={() => {}} info={mockInfo} />);
        expect(screen.getByText('Price at 2023-10-15 15:30:00:', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('$150.25')).toBeInTheDocument();
        expect(screen.getByText('$148.5')).toBeInTheDocument();
    });

    it('displays positive change with green color and plus sign', () => {
        render(<StockModal open={true} onClose={() => {}} info={mockInfo} />);
        const changeElement = screen.getByText('+$1.75 (+1.18%)', { exact: false });
        expect(changeElement).toBeInTheDocument();
        expect(changeElement.closest('p')).toHaveClass('text-green-600');
    });

    it('displays negative change with red color and no plus sign', () => {
        const negativeInfo = {
            ...mockInfo,
            priceChange: -2.50,
            percentChange: -1.65
        };
        render(<StockModal open={true} onClose={() => {}} info={negativeInfo} />);
        const changeElement = screen.getByText((content, element) => {
            return element.textContent === 'Change: $-2.50 (-1.65%)';
        });
        expect(changeElement).toBeInTheDocument();
        expect(changeElement).toHaveClass('text-red-600');
    });
    it('displays industry information', () => {
        render(<StockModal open={true} onClose={() => {}} info={mockInfo} />);
        expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const mockOnClose = vi.fn();
        render(<StockModal open={true} onClose={mockOnClose} info={mockInfo} />);
        
        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles zero price change correctly', () => {
        const zeroChangeInfo = {
            ...mockInfo,
            priceChange: 0,
            percentChange: 0
        };
        render(<StockModal open={true} onClose={() => {}} info={zeroChangeInfo} />);
        const changeElement = screen.getByText('+$0.00 (+0%)', { exact: false });
        expect(changeElement).toBeInTheDocument();
        expect(changeElement.closest('p')).toHaveClass('text-green-600');
    });
});