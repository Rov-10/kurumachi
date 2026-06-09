import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo linking to homepage', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    render(<Navbar />);

    const logo = screen.getByText(/KURUMACHI/);
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders all navigation links', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    render(<Navbar />);

    const docsLink = screen.getByRole('link', { name: 'Docs' });
    const installerLink = screen.getByRole('link', { name: 'Installer' });
    const toolsLink = screen.getByRole('link', { name: 'Tools' });

    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute('href', '/docs');

    expect(installerLink).toBeInTheDocument();
    expect(installerLink).toHaveAttribute('href', '/installer');

    expect(toolsLink).toBeInTheDocument();
    expect(toolsLink).toHaveAttribute('href', '/tools');
  });

  it('highlights the active link based on pathname', () => {
    // When visiting /docs
    vi.mocked(usePathname).mockReturnValue('/docs');
    const { rerender } = render(<Navbar />);

    let docsLink = screen.getByRole('link', { name: 'Docs' });
    let toolsLink = screen.getByRole('link', { name: 'Tools' });

    expect(docsLink).toHaveClass('text-nothing-red');
    expect(toolsLink).not.toHaveClass('text-nothing-red');
    expect(toolsLink).toHaveClass('text-nothing-text/50');

    // When visiting /tools
    vi.mocked(usePathname).mockReturnValue('/tools');
    rerender(<Navbar />);

    docsLink = screen.getByRole('link', { name: 'Docs' });
    toolsLink = screen.getByRole('link', { name: 'Tools' });

    expect(toolsLink).toHaveClass('text-nothing-red');
    expect(docsLink).not.toHaveClass('text-nothing-red');
    expect(docsLink).toHaveClass('text-nothing-text/50');
  });

  it('renders Connect Device button pointing to installer page', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    render(<Navbar />);

    const connectButton = screen.getByRole('link', { name: 'Connect Device' });
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).toHaveAttribute('href', '/installer');
  });
});
