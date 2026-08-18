export type TimetableDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableEntry {
  id: number;
  department: string;
  course: string;
  year: string;
  semester: string;
  section?: string;
  day: TimetableDay;
  startTime: string; // e.g. '09:00 AM'
  endTime: string;   // e.g. '10:00 AM'
  subject: string;
  subjectCode: string;
  faculty: string;
  roomNumber?: string;
  periodNumber: number;
  academicYear: string;
  colorTag?: string; // e.g., 'blue', 'pink', 'cyan', 'green', 'purple', 'amber'
  createdAt?: string;
  updatedAt?: string;
}

export interface TimetableFilter {
  department: string;
  course: string;
  year: string;
  semester: string;
  section: string;
  academicYear: string;
  searchQuery: string;
}

export interface TimetableStats {
  totalClasses: number;
  activeDays: number;
  uniqueSubjects: number;
  totalCourses: number;
}

export interface TimeSlot {
  periodNumber: number;
  startTime: string;
  endTime: string;
  label: string;
  isBreak?: boolean;
  breakType?: 'BREAK' | 'LUNCH';
}
