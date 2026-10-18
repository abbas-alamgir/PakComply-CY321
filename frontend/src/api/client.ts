import axios from 'axios';
import {
  Organization,
  Framework,
  Requirement,
  Assessment,
  Answer,
  Gap,
  Evidence,
  ProcessingActivity,
  Report,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  getOrganization: async (): Promise<Organization> => {
    const res = await api.get<Organization>('/organizations/current');
    return res.data;
  },

  getFrameworks: async (): Promise<Framework[]> => {
    const res = await api.get<Framework[]>('/frameworks');
    return res.data;
  },

  getRequirements: async (area?: string): Promise<Requirement[]> => {
    const params = area && area !== 'all' ? { area } : {};
    const res = await api.get<Requirement[]>('/requirements', { params });
    return res.data;
  },

  getActiveAssessment: async (): Promise<Assessment> => {
    const res = await api.get<Assessment>('/assessments/active');
    return res.data;
  },

  saveAnswer: async (answer: Answer): Promise<{ success: boolean; answer: Answer; updatedRequirement: Requirement }> => {
    const res = await api.post('/answers', answer);
    return res.data;
  },

  getGaps: async (): Promise<Gap[]> => {
    const res = await api.get<Gap[]>('/gaps');
    return res.data;
  },

  getEvidence: async (): Promise<Evidence[]> => {
    const res = await api.get<Evidence[]>('/evidence');
    return res.data;
  },

  getProcessingActivities: async (): Promise<ProcessingActivity[]> => {
    const res = await api.get<ProcessingActivity[]>('/processing-activities');
    return res.data;
  },

  getReports: async (): Promise<Report[]> => {
    const res = await api.get<Report[]>('/reports');
    return res.data;
  },
};
