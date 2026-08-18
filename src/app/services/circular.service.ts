import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Circular, CircularFilter, CircularStats, CircularStatus } from '../models/circular.model';

@Injectable({
  providedIn: 'root'
})
export class CircularService {
  // Base API endpoint for future Laravel 12 API integration
  private readonly apiUrl = 'http://127.0.0.1:8000/api/circulars';

  // Realistic initial dummy circulars for Faculty Circular module
  private initialCirculars: Circular[] = [
    {
      id: 1,
      circularNumber: 'CIR-2026-CS-001',
      title: 'Mandatory Submission of Mid-Semester Project Progress Reports',
      description: 'All final year B.Tech Computer Science students are hereby notified to submit their Mid-Semester Project Progress Report to their respective mentors. Reports must adhere to the IEEE documentation guidelines.',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      semester: 'Semester 7',
      section: 'Section A & B',
      audience: 'Specific Course',
      priority: 'High',
      publishDate: '2026-08-01',
      expiryDate: '2026-08-15',
      attachments: [
        { name: 'Project_Report_Template_2026.pdf', size: '1.4 MB', type: 'pdf' },
        { name: 'Mentors_List_CS7.docx', size: '450 KB', type: 'docx' }
      ],
      status: 'Published',
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01'
    },
    {
      id: 2,
      circularNumber: 'CIR-2026-GEN-004',
      title: 'Schedule for Annual Campus Placement Drive & Resume Workshop',
      description: 'The Placement Cell in coordination with the CSE & IT departments is hosting a Placement Readiness Workshop followed by company drives. Attendance is mandatory for all 6th & 7th Semester students.',
      department: 'All Departments',
      course: 'All Courses',
      semester: 'All Semesters',
      section: 'All Sections',
      audience: 'All Students',
      priority: 'Urgent',
      publishDate: '2026-08-03',
      expiryDate: '2026-08-25',
      attachments: [
        { name: 'Placement_Drive_Schedule.pdf', size: '2.1 MB', type: 'pdf' },
        { name: 'Company_Eligibility_Criteria.png', size: '820 KB', type: 'image' }
      ],
      status: 'Published',
      createdAt: '2026-08-03',
      updatedAt: '2026-08-03'
    },
    {
      id: 3,
      circularNumber: 'CIR-2026-IT-008',
      title: 'Guest Lecture on Cloud Native Architecture & Microservices',
      description: 'Department of IT presents an expert talk by Senior Principal Engineers from AWS. The session will cover Docker, Kubernetes, and Serverless deployment patterns.',
      department: 'Information Technology',
      course: 'B.Tech Information Technology',
      semester: 'Semester 5',
      section: 'Section B',
      audience: 'Specific Department',
      priority: 'Medium',
      publishDate: '2026-08-10',
      expiryDate: '2026-08-20',
      attachments: [
        { name: 'Guest_Lecture_Poster.png', size: '1.8 MB', type: 'image' }
      ],
      status: 'Draft',
      createdAt: '2026-08-04',
      updatedAt: '2026-08-05'
    },
    {
      id: 4,
      circularNumber: 'CIR-2026-ECE-002',
      title: 'IoT & VLSI Hardware Lab Safety Instructions & Guidelines',
      description: 'Instructions regarding proper handling of oscilloscope, micro-controller boards, and circuit boards during hardware lab practical hours. Non-compliance will lead to lab restriction.',
      department: 'Electronics & Communication',
      course: 'B.Tech ECE',
      semester: 'Semester 4',
      section: 'Section C',
      audience: 'Specific Course',
      priority: 'Low',
      publishDate: '2026-08-02',
      expiryDate: '2026-12-31',
      attachments: [
        { name: 'Lab_Safety_Guidelines.pdf', size: '650 KB', type: 'pdf' }
      ],
      status: 'Published',
      createdAt: '2026-08-02',
      updatedAt: '2026-08-02'
    },
    {
      id: 5,
      circularNumber: 'CIR-2026-MECH-005',
      title: 'Draft: CAD/CAM Workshop & Industrial Site Visit Notice',
      description: 'Planned industrial exposure visit to Mahindra Manufacturing Plant for Mechanical Engineering 6th Semester students. Registration link and fee details will be updated.',
      department: 'Mechanical Engineering',
      course: 'B.Tech Mechanical',
      semester: 'Semester 6',
      section: 'Section A',
      audience: 'Specific Course',
      priority: 'Medium',
      publishDate: '2026-08-12',
      expiryDate: '2026-08-30',
      attachments: [],
      status: 'Draft',
      createdAt: '2026-08-05',
      updatedAt: '2026-08-05'
    }
  ];

  private circularsSubject = new BehaviorSubject<Circular[]>(this.initialCirculars);
  public circulars$: Observable<Circular[]> = this.circularsSubject.asObservable();

  constructor() {}

  /**
   * Get all circulars as observable
   */
  getCirculars(): Observable<Circular[]> {
    return this.circulars$;
  }

  /**
   * Get circular by ID
   */
  getCircularById(id: number): Circular | undefined {
    return this.circularsSubject.value.find(c => c.id === id);
  }

  /**
   * Filter circulars dynamically by Department, Course, Semester, Status, Priority, and Search
   */
  filterCirculars(filters: CircularFilter): Circular[] {
    let list = [...this.circularsSubject.value];

    if (filters.department && filters.department !== 'All') {
      list = list.filter(c => c.department.toLowerCase() === filters.department.toLowerCase() || c.department === 'All Departments');
    }

    if (filters.course && filters.course !== 'All') {
      list = list.filter(c => c.course.toLowerCase().includes(filters.course.toLowerCase()) || c.course === 'All Courses');
    }

    if (filters.semester && filters.semester !== 'All') {
      list = list.filter(c => c.semester.toLowerCase() === filters.semester.toLowerCase() || c.semester === 'All Semesters');
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(c => c.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'All') {
      list = list.filter(c => c.priority === filters.priority);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.circularNumber && c.circularNumber.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.course.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Calculate real-time summary statistics for circulars
   */
  getStats(): CircularStats {
    const list = this.circularsSubject.value;
    return {
      totalCirculars: list.length,
      published: list.filter(c => c.status === 'Published').length,
      drafts: list.filter(c => c.status === 'Draft').length,
      urgent: list.filter(c => c.priority === 'Urgent').length
    };
  }

  /**
   * Create a new circular
   */
  createCircular(data: Omit<Circular, 'id' | 'createdAt' | 'updatedAt'>): Circular {
    const list = this.circularsSubject.value;
    const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    const generatedNumber = data.circularNumber && data.circularNumber.trim() !== ''
      ? data.circularNumber
      : `CIR-${new Date().getFullYear()}-FAC-${String(newId).padStart(3, '0')}`;

    const newCircular: Circular = {
      ...data,
      id: newId,
      circularNumber: generatedNumber,
      createdAt: today,
      updatedAt: today
    };

    const updatedList = [newCircular, ...list];
    this.circularsSubject.next(updatedList);
    return newCircular;
  }

  /**
   * Update existing circular
   */
  updateCircular(id: number, data: Partial<Circular>): Circular | null {
    const list = this.circularsSubject.value;
    const index = list.findIndex(c => c.id === id);

    if (index === -1) return null;

    const today = new Date().toISOString().split('T')[0];
    const updatedCircular: Circular = {
      ...list[index],
      ...data,
      updatedAt: today
    };

    list[index] = updatedCircular;
    this.circularsSubject.next([...list]);
    return updatedCircular;
  }

  /**
   * Toggle published / unpublished (Draft) status of circular
   */
  togglePublishStatus(id: number): Circular | null {
    const list = this.circularsSubject.value;
    const circular = list.find(c => c.id === id);
    if (!circular) return null;

    const newStatus: CircularStatus = circular.status === 'Published' ? 'Draft' : 'Published';
    return this.updateCircular(id, { status: newStatus });
  }

  /**
   * Delete circular by ID
   */
  deleteCircular(id: number): boolean {
    const list = this.circularsSubject.value;
    const filtered = list.filter(c => c.id !== id);
    if (filtered.length !== list.length) {
      this.circularsSubject.next(filtered);
      return true;
    }
    return false;
  }
}
