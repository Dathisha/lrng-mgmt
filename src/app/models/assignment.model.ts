export type AssignmentStatus = 'Draft' | 'Published';

export type AssignmentType = 'Homework' | 'Quiz' | 'Project' | 'Lab Report' | 'Presentation' | 'Midterm Exam' | 'Final Exam';

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  course: string;
  semester: string;
  section?: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  maxMarks?: number;
  assignmentType?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  status: AssignmentStatus;
  submissionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFilter {
  department: string;
  course: string;
  semester: string;
  subject: string;
  searchQuery: string;
  status: string;
}

export interface AssignmentStats {
  totalAssignments: number;
  published: number;
  drafts: number;
  totalSubmissions: number;
}
