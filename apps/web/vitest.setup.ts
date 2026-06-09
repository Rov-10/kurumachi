import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.scrollTo since jsdom doesn't implement it
window.scrollTo = vi.fn();
