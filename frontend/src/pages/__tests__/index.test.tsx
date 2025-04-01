import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

describe('Home Page', () => {
  test('renders the title and subtitle', () => {
    render(<Home />);
    
    expect(screen.getByText(/Fulfillment Information Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select a tool/i)).toBeInTheDocument();
  });

  test('renders the navigation links', () => {
    render(<Home />);
    
    const pickingLink = screen.getByText(/Picking List/i);
    const packingLink = screen.getByText(/Packing Order Info/i);
    
    expect(pickingLink).toBeInTheDocument();
    expect(packingLink).toBeInTheDocument();
  });

  test('navigates to /pickingpage when Picking List is clicked', () => {
    render(<Home />);
    
    const pickingLink = screen.getByText(/Picking List/i);
    expect(pickingLink.closest('a')).toHaveAttribute('href', '/pickingpage');
  });

  test('navigates to /packingpage when Packing Order Info is clicked', () => {
    render(<Home />);
    
    const packingLink = screen.getByText(/Packing Order Info/i);
    expect(packingLink.closest('a')).toHaveAttribute('href', '/packingpage');
  });
});
