import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimetableEntry, TimetableFilter, TimetableStats, TimeSlot } from '../models/timetable.model';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {
  // Base API placeholder for future Laravel API integration
  private readonly apiUrl = 'http://127.0.0.1:8000/api/faculty/timetables';

  // Standard ERP Time Slots
  public readonly timeSlots: TimeSlot[] = [
    { periodNumber: 1, startTime: '09:00 AM', endTime: '09:50 AM', label: '9.00 – 9.50' },
    { periodNumber: 2, startTime: '09:50 AM', endTime: '10:40 AM', label: '9.50 – 10.40' },
    { periodNumber: 0, startTime: '10:40 AM', endTime: '10:55 AM', label: '10.40 – 10.55', isBreak: true, breakType: 'BREAK' },
    { periodNumber: 3, startTime: '10:55 AM', endTime: '11:45 AM', label: '10.55 – 11.45' },
    { periodNumber: 4, startTime: '11:45 AM', endTime: '12:35 PM', label: '11.45 – 12.35' },
    { periodNumber: 0, startTime: '12:35 PM', endTime: '01:15 PM', label: '12.35 – 1.15', isBreak: true, breakType: 'LUNCH' },
    { periodNumber: 5, startTime: '01:15 PM', endTime: '01:55 PM', label: '1.15 – 1.55' },
    { periodNumber: 6, startTime: '01:55 PM', endTime: '02:35 PM', label: '1.55 – 2.35' },
    { periodNumber: 0, startTime: '02:35 PM', endTime: '02:50 PM', label: '2.35 – 2.50', isBreak: true, breakType: 'BREAK' },
    { periodNumber: 7, startTime: '02:50 PM', endTime: '03:30 PM', label: '2.50 – 3.30' },
    { periodNumber: 8, startTime: '03:30 PM', endTime: '04:10 PM', label: '3.30 – 4.10' }
  ];

  // Initial dummy timetable data for Faculty Timetable module
  private initialTimetables: TimetableEntry[] = [
    {
      id: 1,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Monday',
      startTime: '09:00 AM',
      endTime: '09:50 AM',
      subject: 'Data Structures & Algorithms',
      subjectCode: 'CS701',
      faculty: 'Dr. Ramesh Kumar',
      roomNumber: 'Room-301',
      periodNumber: 1,
      academicYear: '2026-2027',
      colorTag: 'blue',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01'
    },
    {
      id: 2,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Monday',
      startTime: '09:50 AM',
      endTime: '10:40 AM',
      subject: 'Cloud Computing & Microservices',
      subjectCode: 'CS702',
      faculty: 'Prof. Ananya Sharma',
      roomNumber: 'Room-402',
      periodNumber: 2,
      academicYear: '2026-2027',
      colorTag: 'cyan',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01'
    },
    {
      id: 3,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Tuesday',
      startTime: '10:55 AM',
      endTime: '11:45 AM',
      subject: 'Web Technologies & Frameworks',
      subjectCode: 'CS703',
      faculty: 'Dr. Vikramaditya',
      roomNumber: 'Room-104',
      periodNumber: 3,
      academicYear: '2026-2027',
      colorTag: 'amber',
      createdAt: '2026-08-02',
      updatedAt: '2026-08-02'
    },
    {
      id: 4,
      department: 'Information Technology',
      course: 'B.Tech IT',
      year: 'Year 3',
      semester: 'Semester 5',
      section: 'Section B',
      day: 'Wednesday',
      startTime: '01:15 PM',
      endTime: '01:55 PM',
      subject: 'Database Management Systems',
      subjectCode: 'IT501',
      faculty: 'Prof. Meera Nair',
      roomNumber: 'Room-205',
      periodNumber: 5,
      academicYear: '2026-2027',
      colorTag: 'purple',
      createdAt: '2026-08-03',
      updatedAt: '2026-08-03'
    },
    {
      id: 5,
      department: 'Electronics & Communication',
      course: 'B.Tech ECE',
      year: 'Year 2',
      semester: 'Semester 3',
      section: 'Section A',
      day: 'Thursday',
      startTime: '09:00 AM',
      endTime: '09:50 AM',
      subject: 'Digital Signal Processing',
      subjectCode: 'EC302',
      faculty: 'Dr. S. K. Gupta',
      roomNumber: 'Room-102',
      periodNumber: 1,
      academicYear: '2026-2027',
      colorTag: 'green',
      createdAt: '2026-08-04',
      updatedAt: '2026-08-04'
    },
    {
      id: 6,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Friday',
      startTime: '11:45 AM',
      endTime: '12:35 PM',
      subject: 'Artificial Intelligence & ML',
      subjectCode: 'CS704',
      faculty: 'Dr. Priya Sundaram',
      roomNumber: 'Room-201',
      periodNumber: 4,
      academicYear: '2026-2027',
      colorTag: 'pink',
      createdAt: '2026-08-05',
      updatedAt: '2026-08-05'
    },
    {
      id: 7,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Saturday',
      startTime: '09:50 AM',
      endTime: '10:40 AM',
      subject: 'Cyber Security & Forensics',
      subjectCode: 'CS705',
      faculty: 'Prof. Rajesh Khanna',
      roomNumber: 'Room-308',
      periodNumber: 2,
      academicYear: '2026-2027',
      colorTag: 'blue',
      createdAt: '2026-08-06',
      updatedAt: '2026-08-06'
    },
    {
      id: 8,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Tuesday',
      startTime: '02:50 PM',
      endTime: '03:30 PM',
      subject: 'Advanced Software Engineering',
      subjectCode: 'CS706',
      faculty: 'Dr. Ramesh Kumar',
      roomNumber: 'Room-202',
      periodNumber: 7,
      academicYear: '2026-2027',
      colorTag: 'purple',
      createdAt: '2026-08-07',
      updatedAt: '2026-08-07'
    },
    {
      id: 9,
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      day: 'Thursday',
      startTime: '03:30 PM',
      endTime: '04:10 PM',
      subject: 'Capstone Project & Seminar',
      subjectCode: 'CS707',
      faculty: 'Prof. Ananya Sharma',
      roomNumber: 'Auditorium A',
      periodNumber: 8,
      academicYear: '2026-2027',
      colorTag: 'amber',
      createdAt: '2026-08-08',
      updatedAt: '2026-08-08'
    }
  ];

  private timetablesSubject = new BehaviorSubject<TimetableEntry[]>(this.initialTimetables);
  public timetables$: Observable<TimetableEntry[]> = this.timetablesSubject.asObservable();

  constructor() { }

  /**
   * Get timetables as observable stream
   */
  getTimetables(): Observable<TimetableEntry[]> {
    return this.timetables$;
  }

  /**
   * Get single timetable entry by ID
   */
  getTimetableById(id: number): TimetableEntry | undefined {
    return this.timetablesSubject.value.find(t => t.id === id);
  }

  /**
   * Filter timetables by Department, Course, Year, Semester, Section, Academic Year, and Search Query
   */
  filterTimetables(filters: TimetableFilter): TimetableEntry[] {
    let list = [...this.timetablesSubject.value];

    if (filters.department && filters.department !== 'All') {
      list = list.filter(t => t.department.toLowerCase() === filters.department.toLowerCase());
    }

    if (filters.course && filters.course !== 'All') {
      list = list.filter(t => t.course.toLowerCase().includes(filters.course.toLowerCase()));
    }

    if (filters.year && filters.year !== 'All') {
      list = list.filter(t => t.year.toLowerCase() === filters.year.toLowerCase());
    }

    if (filters.semester && filters.semester !== 'All') {
      list = list.filter(t => t.semester.toLowerCase() === filters.semester.toLowerCase());
    }

    if (filters.section && filters.section !== 'All') {
      list = list.filter(t => t.section && t.section.toLowerCase() === filters.section.toLowerCase());
    }

    if (filters.academicYear && filters.academicYear !== 'All') {
      list = list.filter(t => t.academicYear === filters.academicYear);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        t.subjectCode.toLowerCase().includes(q) ||
        t.faculty.toLowerCase().includes(q) ||
        (t.roomNumber && t.roomNumber.toLowerCase().includes(q)) ||
        t.course.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Get real-time summary statistics
   */
  getStats(filteredList?: TimetableEntry[]): TimetableStats {
    const list = filteredList || this.timetablesSubject.value;
    const activeDaysSet = new Set(list.map(t => t.day));
    const uniqueSubjectsSet = new Set(list.map(t => t.subjectCode));
    const totalCoursesSet = new Set(list.map(t => t.course));

    return {
      totalClasses: list.length,
      activeDays: activeDaysSet.size,
      uniqueSubjects: uniqueSubjectsSet.size,
      totalCourses: totalCoursesSet.size
    };
  }

  /**
   * Create a new timetable entry
   */
  createTimetable(entry: Omit<TimetableEntry, 'id' | 'createdAt' | 'updatedAt'>): TimetableEntry {
    const list = this.timetablesSubject.value;
    const newId = list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    const colors = ['blue', 'pink', 'cyan', 'green', 'purple', 'amber'];
    const assignedColor = entry.colorTag || colors[newId % colors.length];

    const newEntry: TimetableEntry = {
      ...entry,
      id: newId,
      colorTag: assignedColor,
      createdAt: today,
      updatedAt: today
    };

    const updatedList = [newEntry, ...list];
    this.timetablesSubject.next(updatedList);
    return newEntry;
  }

  /**
   * Update existing timetable entry
   */
  updateTimetable(id: number, data: Partial<TimetableEntry>): TimetableEntry | null {
    const list = this.timetablesSubject.value;
    const index = list.findIndex(t => t.id === id);

    if (index === -1) return null;

    const today = new Date().toISOString().split('T')[0];
    const updatedEntry: TimetableEntry = {
      ...list[index],
      ...data,
      updatedAt: today
    };

    list[index] = updatedEntry;
    this.timetablesSubject.next([...list]);
    return updatedEntry;
  }

  /**
   * Delete timetable entry by ID
   */
  deleteTimetable(id: number): boolean {
    const list = this.timetablesSubject.value;
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length !== list.length) {
      this.timetablesSubject.next(filtered);
      return true;
    }
    return false;
  }
}
