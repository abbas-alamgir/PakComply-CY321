import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisclaimerNotice } from '../DisclaimerNotice';

describe('DisclaimerNotice', () => {
  it('renders the mandatory legal disclaimer exactly as specified', () => {
    render(<DisclaimerNotice />);
    expect(
      screen.getByText('Assessed against the 2023 draft bill. Not legal advice or certification.')
    ).toBeInTheDocument();
  });
});
