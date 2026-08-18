export type CircularStatus = 'Draft' | 'Published';
export type CircularPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type CircularAudience = 'All Students' | 'Specific Course' | 'Specific Department';

export interface CircularAttachment {
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'image' | 'other';
  url?: string;
}

export interface Circular {
  id: number;
  circularNumber?: string;
  title: string;
  description: string;
  department: string;
  course: string;
  semester: string;
  section?: string;
  audience: CircularAudience;
  priority: CircularPriority;
  publishDate: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  attachments: CircularAttachment[];
  status: CircularStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CircularFilter {
  department: string;
  course: string;
  semester: string;
  status: string;
  priority: string;
  searchQuery: string;
}

export interface CircularStats {
  totalCirculars: number;
  published: number;
  drafts: number;
  urgent: number;
}
