import { http, HttpResponse } from 'msw';
import {
  mockOrganization,
  mockFrameworks,
  mockRequirements,
  mockGaps,
  mockEvidence,
  mockProcessingActivities,
  mockReports,
  mockAssessment,
} from './data';
import { Requirement, Answer } from '../types';

let requirementsState: Requirement[] = [...mockRequirements];
let answersState: Record<string, Answer> = {
  'req-01': { requirementId: 'req-01', value: 'yes', note: 'Purpose registered in privacy notice.' },
  'req-02': { requirementId: 'req-02', value: 'yes', note: 'Notice displayed at checkout.' },
  'req-03': { requirementId: 'req-03', value: 'partial', note: 'Manual purge in place, automated job pending.' },
  'req-04': { requirementId: 'req-04', value: 'yes', note: 'Opt-in checkboxes with withdrawal portal.' },
  'req-05': { requirementId: 'req-05', value: 'no', note: 'Database currently unencrypted at storage layer.' },
  'req-06': { requirementId: 'req-06', value: 'partial', note: 'Internal SLA defined, PKCERT escalation SOP in draft.' },
  'req-07': { requirementId: 'req-07', value: 'yes', note: 'DPO appointed by Board Resolution.' },
  'req-08': { requirementId: 'req-08', value: 'no', note: 'Cloud provider region is overseas without SCCs.' },
  'req-09': { requirementId: 'req-09', value: 'partial', note: 'Incident response drill scheduled.' },
};

export const handlers = [
  // Organization
  http.get('/api/organizations/current', () => {
    return HttpResponse.json(mockOrganization);
  }),

  // Frameworks
  http.get('/api/frameworks', () => {
    return HttpResponse.json(mockFrameworks);
  }),

  // Requirements
  http.get('/api/requirements', ({ request }) => {
    const url = new URL(request.url);
    const area = url.searchParams.get('area');
    if (area && area !== 'all') {
      const filtered = requirementsState.filter((r) => r.area === area);
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(requirementsState);
  }),

  // Active Assessment
  http.get('/api/assessments/active', () => {
    const metCount = requirementsState.filter((r) => r.status === 'met').length;
    const partialCount = requirementsState.filter((r) => r.status === 'partial').length;
    const score = ((metCount * 1.0 + partialCount * 0.5) / requirementsState.length) * 100;

    return HttpResponse.json({
      ...mockAssessment,
      answersCount: Object.keys(answersState).length,
      totalRequirements: requirementsState.length,
      scorePercentage: Math.round(score * 10) / 10,
    });
  }),

  // Save/Update Answer
  http.post('/api/answers', async ({ request }) => {
    const body = (await request.json()) as Answer;
    answersState[body.requirementId] = body;

    // Update requirement status based on answer
    requirementsState = requirementsState.map((req) => {
      if (req.id === body.requirementId) {
        let newStatus: Requirement['status'] = 'not_assessed';
        if (body.value === 'yes') newStatus = 'met';
        else if (body.value === 'partial') newStatus = 'partial';
        else if (body.value === 'no') newStatus = 'gap';
        else if (body.value === 'na') newStatus = 'met';
        return { ...req, status: newStatus };
      }
      return req;
    });

    return HttpResponse.json({
      success: true,
      answer: body,
      updatedRequirement: requirementsState.find((r) => r.id === body.requirementId),
    });
  }),

  // Gaps
  http.get('/api/gaps', () => {
    return HttpResponse.json(mockGaps);
  }),

  // Evidence
  http.get('/api/evidence', () => {
    return HttpResponse.json(mockEvidence);
  }),

  // Processing Activities
  http.get('/api/processing-activities', () => {
    return HttpResponse.json(mockProcessingActivities);
  }),

  // Reports
  http.get('/api/reports', () => {
    return HttpResponse.json(mockReports);
  }),
];
