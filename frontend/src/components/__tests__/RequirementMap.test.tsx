import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RequirementMap } from '../RequirementMap';
import { Requirement } from '../../types';

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
  {
    id: 'req-2',
    frameworkId: 'pdpb-2023',
    clause: 'Cl. 15',
    title: 'Security safeguards',
    text: 'Encryption at rest',
    severity: 'high',
    area: 'security',
    status: 'gap',
  },
];

describe('RequirementMap', () => {
  it('renders one tile per requirement with clause number and status shape', () => {
    const onSelect = vi.fn();
    render(
      <RequirementMap
        requirements={sampleRequirements}
        onSelectRequirement={onSelect}
      />
    );

    expect(screen.getByText('Cl. 5')).toBeInTheDocument();
    expect(screen.getByText('Cl. 15')).toBeInTheDocument();
  });

  it('triggers onSelectRequirement when a tile is clicked', () => {
    const onSelect = vi.fn();
    render(
      <RequirementMap
        requirements={sampleRequirements}
        onSelectRequirement={onSelect}
      />
    );

    const tile = screen.getByText('Cl. 5').closest('button');
    expect(tile).toBeInTheDocument();
    fireEvent.click(tile!);
    expect(onSelect).toHaveBeenCalledWith(sampleRequirements[0]);
  });
});
