/**
 * PakComply Core Data Models (TypeScript strict types)
 * Synchronized with openapi.yaml
 */

export type Role = 'admin' | 'reviewer' | 'viewer';

export type ComplianceArea = 'processing' | 'policy' | 'consent' | 'retention' | 'security';

export type Severity = 'high' | 'medium' | 'low';

export type RequirementStatus = 'met' | 'partial' | 'gap' | 'not_assessed';

export type AnswerValue = 'yes' | 'partial' | 'no' | 'na';

export interface Organization {
  id: string;
  name: string;
  sector: string;
  registrationNumber: string;
  dataProtectionOfficer?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Framework {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'advisory';
  updatedAt: string;
}

export interface Requirement {
  id: string;
  frameworkId: string;
  clause: string;
  title: string;
  text: string;
  severity: Severity;
  area: ComplianceArea;
  status: RequirementStatus;
  legalReference?: string;
}

export interface Answer {
  id?: string;
  assessmentId?: string;
  requirementId: string;
  value: AnswerValue;
  note?: string;
  updatedAt?: string;
}

export interface Assessment {
  id: string;
  organizationId: string;
  frameworkId: string;
  status: 'in_progress' | 'completed';
  updatedAt: string;
  disclaimer: string; // "Assessed against the 2023 draft bill. Not legal advice or certification."
  answersCount: number;
  totalRequirements: number;
  scorePercentage: number;
}

export interface Gap {
  id: string;
  requirementId: string;
  clause?: string;
  title?: string;
  severity: Severity;
  status: 'open' | 'in_progress' | 'resolved';
  recommendation: string;
  ownerId: string;
  ownerName?: string;
  dueDate: string;
}

export interface Task {
  id: string;
  gapId?: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: Severity;
  dueDate: string;
  assigneeName?: string;
}

export interface Evidence {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  linkedRequirementIds: string[];
  expiresAt?: string;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProcessingActivity {
  id: string;
  dataType: string;
  purpose: string;
  consentBasis: string;
  retentionPeriod: string;
  storageLocation: string;
  vendors: string[];
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  generatedBy: string;
  disclaimer: string;
  scorePercentage: number;
  metCount: number;
  partialCount: number;
  gapCount: number;
  notAssessedCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}

export const MANDATORY_LEGAL_DISCLAIMER =
  'Assessed against the 2023 draft bill. Not legal advice or certification.';
