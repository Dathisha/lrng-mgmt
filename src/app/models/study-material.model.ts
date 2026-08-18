export type MaterialType =
  | 'Notes'
  | 'PDF'
  | 'PPT'
  | 'Document'
  | 'Video'
  | 'Link'
  | 'Reference Material'
  | 'Lab Material'
  | 'Other';

export type MaterialStatus = 'Published' | 'Draft';

export interface StudyMaterial {
  id: number;
  title: string;
  description: string;
  department: string;
  course: string;
  year: string;
  semester: string;
  section?: string;
  subject: string;
  subjectCode: string;
  materialType: MaterialType;
  topic: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string; // e.g. 'pdf', 'docx', 'pptx', 'zip', 'png'
  externalLink?: string;
  academicYear: string;
  publishDate: string; // YYYY-MM-DD
  uploadedBy: string;
  status: MaterialStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StudyMaterialFilter {
  department: string;
  course: string;
  semester: string;
  subject: string;
  materialType: string;
  status: string;
  searchQuery: string;
}

export interface StudyMaterialStats {
  totalMaterials: number;
  published: number;
  drafts: number;
  pdfCount: number;
  videoLinkCount: number;
}
