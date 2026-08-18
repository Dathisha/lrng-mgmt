import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Assignment, AssignmentFilter, AssignmentStats, AssignmentStatus, AssignmentType } from '../../models/assignment.model';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-faculty-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-assignment.component.html',
  styleUrls: ['./faculty-assignment.component.css']
})
export class FacultyAssignmentComponent implements OnInit {
  assignments: Assignment[] = [];
  filteredAssignments: Assignment[] = [];
  stats: AssignmentStats = {
    totalAssignments: 0,
    published: 0,
    drafts: 0,
    totalSubmissions: 0
  };

  // Filter State
  filters: AssignmentFilter = {
    department: '',
    course: '',
    semester: '',
    subject: '',
    searchQuery: '',
    status: 'All'
  };

  // Options for Dropdowns
  departments: string[] = ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering'];
  courses: string[] = ['B.Tech Computer Science', 'B.Tech Information Technology', 'M.Tech Software Engineering', 'MCA Master of Computer Applications'];
  semesters: string[] = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  sections: string[] = ['Section A', 'Section B', 'Section C', 'Section D'];
  assignmentTypes: AssignmentType[] = ['Homework', 'Quiz', 'Project', 'Lab Report', 'Presentation', 'Midterm Exam', 'Final Exam'];

  // Modal & Form State
  isFormModalOpen = false;
  isViewModalOpen = false;
  isDeleteModalOpen = false;
  isEditMode = false;

  // Selected Assignment for Detail or Delete
  selectedAssignment: Assignment | null = null;

  // Form Fields
  formAssignment: Partial<Assignment> = {
    title: '',
    subject: '',
    course: 'B.Tech Computer Science',
    semester: 'Semester 3',
    section: '',
    description: '',
    dueDate: '',
    status: 'Published'
  };

  toastMessage: string | null = null;

  constructor(private assignmentService: AssignmentService) {}

  ngOnInit(): void {
    this.assignmentService.assignments$.subscribe(data => {
      this.assignments = data;
      this.applyFilters();
      this.updateStats();
    });
  }

  updateStats(): void {
    this.stats = this.assignmentService.getStats();
  }

  applyFilters(): void {
    this.filteredAssignments = this.assignmentService.filterAssignments(this.filters);
  }

  resetFilters(): void {
    this.filters = {
      department: '',
      course: '',
      semester: '',
      subject: '',
      searchQuery: '',
      status: 'All'
    };
    this.applyFilters();
  }

  // Open Create Modal
  openCreateModal(): void {
    this.isEditMode = false;
    this.formAssignment = {
      title: '',
      subject: '',
      course: 'B.Tech Computer Science',
      semester: 'Semester 3',
      section: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Published'
    };
    this.isFormModalOpen = true;
  }

  // Open Edit Modal
  openEditModal(assignment: Assignment): void {
    this.isEditMode = true;
    this.selectedAssignment = assignment;
    this.formAssignment = { ...assignment };
    this.isFormModalOpen = true;
  }

  // Open View Details Modal
  openViewModal(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.isViewModalOpen = true;
  }

  // Open Delete Confirmation Modal
  openDeleteModal(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.isDeleteModalOpen = true;
  }

  // Close Modals
  closeModals(): void {
    this.isFormModalOpen = false;
    this.isViewModalOpen = false;
    this.isDeleteModalOpen = false;
    this.selectedAssignment = null;
  }

  // Save Assignment (Create / Edit)
  saveAssignment(): void {
    if (!this.formAssignment.title || !this.formAssignment.subject || !this.formAssignment.dueDate) {
      this.showToast('Please fill in all required fields marked with *');
      return;
    }

    if (this.isEditMode && this.selectedAssignment) {
      this.assignmentService.updateAssignment(this.selectedAssignment.id, this.formAssignment);
      this.showToast('Assignment updated successfully!');
    } else {
      this.assignmentService.createAssignment(this.formAssignment as Omit<Assignment, 'id' | 'createdAt' | 'updatedAt' | 'submissionsCount'>);
      this.showToast('New assignment created successfully!');
    }

    this.closeModals();
  }

  // Delete Assignment Action
  confirmDelete(): void {
    if (this.selectedAssignment) {
      this.assignmentService.deleteAssignment(this.selectedAssignment.id);
      this.showToast('Assignment deleted successfully!');
    }
    this.closeModals();
  }

  // Show Toast Alert
  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
