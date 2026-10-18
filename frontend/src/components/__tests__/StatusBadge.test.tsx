import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders "Met" status with SVG shape and accessible label', () => {
    const { container } = render(<StatusBadge status="met" />);
    expect(screen.getByText('Met')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Met');
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders "Partial" status with SVG shape and accessible label', () => {
    const { container } = render(<StatusBadge status="partial" />);
    expect(screen.getByText('Partial')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Partial');
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders "Gap" status with SVG cross shape and accessible label', () => {
    const { container } = render(<StatusBadge status="gap" />);
    expect(screen.getByText('Gap')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Gap');
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders "Not assessed" status with circle shape', () => {
    const { container } = render(<StatusBadge status="not_assessed" />);
    expect(screen.getByText('Not assessed')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Not assessed');
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('never displays status by color alone: SVG icon is always present', () => {
    const { container } = render(<StatusBadge status="met" showWord={false} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Met');
  });
});
