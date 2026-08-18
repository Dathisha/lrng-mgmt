import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Assignment, AssignmentFilter, AssignmentStats } from '../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  // Base API URL placeholder for future Laravel API integration
  private readonly apiUrl = 'http://127.0.0.1:8000/api/assignments';

  // Dummy Initial Data matching LMS College System structure
  private initialAssignments: Assignment[] = [
    {
      id: 1,
      title: 'Data Structures Algorithm Analysis & Big-O Problem Set',
      subject: 'Data Structures & Algorithms',
      course: 'B.Tech Computer Science',
      semester: 'Semester 3',
      section: 'Section A',
      description: 'Solve the algorithm complexity analysis problems listed in Section 4 of the textbook. Provide mathematical proofs for time and space complexity.',
      dueDate: '2026-08-15',
      dueTime: '23:59',
      maxMarks: 100,
      assignmentType: 'Homework',
      fileName: 'DSA_Problem_Set_1.pdf',
      fileUrl: '#',
      fileSize: '1.2 MB',
      status: 'Published',
      submissionsCount: 42,
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01'
    },
    {
      id: 2,
      title: 'Database Management Systems ER Diagram & Normalization Case Study',
      subject: 'Database Management Systems',
      course: 'B.Tech Information Technology',
      semester: 'Semester 4',
      section: 'Section B',
      description: 'Design a normalized 3NF relational database schema for an E-commerce platform. Submit ER diagrams created using draw.io or MySQL Workbench.',
      dueDate: '2026-08-20',
      dueTime: '17:00',
      maxMarks: 50,
      assignmentType: 'Project',
      fileName: 'DBMS_Case_Study_Specification.docx',
      fileUrl: '#',
      fileSize: '850 KB',
      status: 'Published',
      submissionsCount: 38,
      createdAt: '2026-08-03',
      updatedAt: '2026-08-03'
    },
    {
      id: 3,
      title: 'Web Technologies REST API & Angular Component Architecture Lab',
      subject: 'Web Development',
      course: 'B.Tech Computer Science',
      semester: 'Semester 5',
      section: 'Section A',
      description: 'Build a CRUD web application using Angular frontend and RESTful backend. Ensure Bootstrap responsiveness and proper error handling.',
      dueDate: '2026-08-25',
      dueTime: '23:59',
      maxMarks: 75,
      assignmentType: 'Lab Report',
      fileName: 'Lab_Assignment_3_Guide.pdf',
      fileUrl: '#',
      fileSize: '2.4 MB',
      status: 'Draft',
      submissionsCount: 0,
      createdAt: '2026-08-05',
      updatedAt: '2026-08-05'
    },
    {
      id: 4,
      title: 'Operating Systems Process Scheduling & Memory Allocation Quiz',
      subject: 'Operating Systems',
      course: 'B.Tech Computer Science',
      semester: 'Semester 4',
      section: 'Section C',
      description: 'Quiz covering CPU scheduling algorithms (Round Robin, FCFS, SJF) and paging/segmentation memory allocation policies.',
      dueDate: '2026-08-18',
      dueTime: '14:30',
      maxMarks: 30,
      assignmentType: 'Quiz',
      fileName: 'OS_Quiz_Review.pdf',
      fileUrl: '#',
      fileSize: '620 KB',
      status: 'Published',
      submissionsCount: 65,
      createdAt: '2026-08-04',
      updatedAt: '2026-08-04'
    }
  ];

  private assignmentsSubject = new BehaviorSubject<Assignment[]>(this.initialAssignments);
  public assignments$: Observable<Assignment[]> = this.assignmentsSubject.asObservable();

  constructor() {}

  /**
   * Get all assignments as an observable
   */
  getAssignments(): Observable<Assignment[]> {
    return this.assignments$;
  }

  /**
   * Get assignment by ID
   */
  getAssignmentById(id: number): Assignment | undefined {
    return this.assignmentsSubject.value.find(a => a.id === id);
  }

  /**
   * Filter assignments dynamically
   */
  filterAssignments(filters: AssignmentFilter): Assignment[] {
    let current = this.assignmentsSubject.value;

    if (filters.department && filters.department !== 'All Departments') {
      // General filter logic
    }

    if (filters.course && filters.course !== 'All Courses') {
      current = current.filter(a => a.course.toLowerCase().includes(filters.course.toLowerCase()));
    }

    if (filters.semester && filters.semester !== 'All Semesters') {
      current = current.filter(a => a.semester.toLowerCase() === filters.semester.toLowerCase());
    }

    if (filters.subject && filters.subject.trim() !== '') {
      current = current.filter(a => a.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      current = current.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.subject.toLowerCase().includes(query)
      );
    }

    if (filters.status && filters.status !== 'All') {
      current = current.filter(a => a.status === filters.status);
    }

    return current;
  }

  /**
   * Get summary KPIs
   */
  getStats(): AssignmentStats {
    const assignments = this.assignmentsSubject.value;
    return {
      totalAssignments: assignments.length,
      published: assignments.filter(a => a.status === 'Published').length,
      drafts: assignments.filter(a => a.status === 'Draft').length,
      totalSubmissions: assignments.reduce((acc, curr) => acc + curr.submissionsCount, 0)
    };
  }

  /**
   * Create new assignment
   */
  createAssignment(newAssignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt' | 'submissionsCount'>): Assignment {
    const currentAssignments = this.assignmentsSubject.value;
    const newId = currentAssignments.length > 0 ? Math.max(...currentAssignments.map(a => a.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    const createdAssignment: Assignment = {
      ...newAssignmentData,
      id: newId,
      submissionsCount: 0,
      createdAt: today,
      updatedAt: today
    };

    const updatedList = [createdAssignment, ...currentAssignments];
    this.assignmentsSubject.next(updatedList);
    return createdAssignment;
  }

  /**
   * Update existing assignment
   */
  updateAssignment(id: number, updatedData: Partial<Assignment>): Assignment | null {
    const currentAssignments = this.assignmentsSubject.value;
    const index = currentAssignments.findIndex(a => a.id === id);

    if (index === -1) return null;

    const today = new Date().toISOString().split('T')[0];
    const updatedAssignment: Assignment = {
      ...currentAssignments[index],
      ...updatedData,
      updatedAt: today
    };

    currentAssignments[index] = updatedAssignment;
    this.assignmentsSubject.next([...currentAssignments]);
    return updatedAssignment;
  }

  /**
   * Delete assignment by ID
   */
  deleteAssignment(id: number): boolean {
    const currentAssignments = this.assignmentsSubject.value;
    const filtered = currentAssignments.filter(a => a.id !== id);
    if (filtered.length !== currentAssignments.length) {
      this.assignmentsSubject.next(filtered);
      return true;
    }
    return false;
  }
}
