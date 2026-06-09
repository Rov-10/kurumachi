import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BomTab from './BomTab';

describe('BomTab', () => {
  it('renders the Bill of Materials heading', () => {
    render(<BomTab />);
    const heading = screen.getByRole('heading', { name: 'Bill of Materials' });
    expect(heading).toBeInTheDocument();
  });

  it('renders table columns correctly', () => {
    render(<BomTab />);
    expect(screen.getByText('Component Name')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Technical Description')).toBeInTheDocument();
  });

  it('renders core components in the table list', () => {
    render(<BomTab />);

    // Check presence of key parts in BOM
    expect(screen.getByText('ESP32-C3 Super Mini')).toBeInTheDocument();
    expect(screen.getByText('OLED Display SH1106 1.3″')).toBeInTheDocument();
    expect(screen.getByText('IMU Sensor BMI160')).toBeInTheDocument();
    expect(screen.getByText('TP4057 Charge Module')).toBeInTheDocument();

    // Check quantities
    const quantities = screen.getAllByText('1 pcs');
    expect(quantities.length).toBeGreaterThanOrEqual(10);
  });
});
