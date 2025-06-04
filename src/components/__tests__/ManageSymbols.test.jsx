import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ManageSymbols from '../ManageSymbols';

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ManageSymbols', () => {
    const mockSetSymbols = vi.fn();
    const defaultProps = {
        symbols: ['AAPL', 'GOOGL'],
        setSymbols: mockSetSymbols
    };

    beforeEach(() => {
        mockSetSymbols.mockClear();
    });

    it('renders the component with title and back link', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        expect(screen.getByText('Manage Ticker Symbols')).toBeInTheDocument();
        expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
    });

    it('displays existing symbols', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        expect(screen.getByText('AAPL')).toBeInTheDocument();
        expect(screen.getByText('GOOGL')).toBeInTheDocument();
    });

    it('adds a new symbol when form is submitted', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Enter symbol (e.g., NFLX)');
        const addButton = screen.getByText('Add');
        
        fireEvent.change(input, { target: { value: 'NFLX' } });
        fireEvent.click(addButton);
        
        expect(mockSetSymbols).toHaveBeenCalledWith(['AAPL', 'GOOGL', 'NFLX']);
    });

    it('converts input to uppercase when adding symbol', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Enter symbol (e.g., NFLX)');
        const addButton = screen.getByText('Add');
        
        fireEvent.change(input, { target: { value: 'nflx' } });
        fireEvent.click(addButton);
        
        expect(mockSetSymbols).toHaveBeenCalledWith(['AAPL', 'GOOGL', 'NFLX']);
    });

    it('trims whitespace from input', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Enter symbol (e.g., NFLX)');
        const addButton = screen.getByText('Add');
        
        fireEvent.change(input, { target: { value: '  NFLX  ' } });
        fireEvent.click(addButton);
        
        expect(mockSetSymbols).toHaveBeenCalledWith(['AAPL', 'GOOGL', 'NFLX']);
    });

    it('does not add duplicate symbols', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Enter symbol (e.g., NFLX)');
        const addButton = screen.getByText('Add');
        
        fireEvent.change(input, { target: { value: 'AAPL' } });
        fireEvent.click(addButton);
        
        expect(mockSetSymbols).not.toHaveBeenCalled();
    });

    it('does not add empty symbols', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const addButton = screen.getByText('Add');
        
        fireEvent.click(addButton);
        
        expect(mockSetSymbols).not.toHaveBeenCalled();
    });

    it('clears input after adding symbol', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Enter symbol (e.g., NFLX)');
        const addButton = screen.getByText('Add');
        
        fireEvent.change(input, { target: { value: 'NFLX' } });
        fireEvent.click(addButton);
        
        expect(input.value).toBe('');
    });

    it('removes symbol when remove button is clicked', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]);
        
        expect(mockSetSymbols).toHaveBeenCalledWith(['GOOGL']);
    });

    it('handles form submission via Enter key', () => {
        renderWithRouter(<ManageSymbols {...defaultProps} />);
        
        const input = screen.getByPlaceholderText('Enter symbol (e.g., NFLX)');
        
        fireEvent.change(input, { target: { value: 'NFLX' } });
        fireEvent.submit(input.closest('form'));
        
        expect(mockSetSymbols).toHaveBeenCalledWith(['AAPL', 'GOOGL', 'NFLX']);
    });
});