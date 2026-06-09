import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScrollButton from './ScrollButton';

describe('ScrollButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  it('does not render the button initially', () => {
    render(<ScrollButton />);
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders the button when window scroll is greater than 400', () => {
    render(<ScrollButton />);

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 450,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('scrolls window to top when clicked', () => {
    render(<ScrollButton />);

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 450,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
