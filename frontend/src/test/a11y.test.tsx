import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { StatusBadge } from '../components/StatusBadge';
import { DisclaimerNotice } from '../components/DisclaimerNotice';
import { RequirementMap } from '../components/RequirementMap';
import { Requirement } from '../types';

const sampleRequirements: Requirement[] = [
  {
    id: 'req-1',
    frameworkId: 'pdpb-2023',
    clause: 'Cl. 5',
    title: 'Lawfulness of processing',
    text: 'Purpose limitation mandate',
    severity: 'high',
    area: 'processing',
    status: 'met',
  },
];

describe('WCAG 2.2 AA Accessibility (axe-core)', () => {
  it('StatusBadge has no serious or critical accessibility violations', async () => {
    const { container } = render(<StatusBadge status="met" />);
    const results = await axe.run(container);
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);
  });

  it('DisclaimerNotice has no accessibility violations', async () => {
    const { container } = render(<DisclaimerNotice />);
    const results = await axe.run(container);
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);
  });

  it('RequirementMap has no critical accessibility violations', async () => {
    const { container } = render(
      <RequirementMap requirements={sampleRequirements} onSelectRequirement={() => {}} />
    );
    const results = await axe.run(container);
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);
  });
});
