import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TimetableDay, TimetableEntry, TimetableFilter, TimetableStats, TimeSlot } from '../../models/timetable.model';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-timetable-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './timetable-list.component.html',
  styleUrls: ['./timetable-list.component.css']
})
export class TimetableListComponent implements OnInit {
  timetables: TimetableEntry[] = [];
  filteredTimetables: TimetableEntry[] = [];
  timeSlots: TimeSlot[] = [];
  days: TimetableDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  stats: TimetableStats = {
    totalClasses: 0,
    activeDays: 0,
    uniqueSubjects: 0,
    totalCourses: 0
  };

  // View Mode: 'grid' (Weekly Matrix) or 'list' (Data Table)
  activeViewMode: 'grid' | 'list' = 'grid';

  // Filters
  filterDepartment: string = 'All';
  filterCourse: string = 'All';
  filterYear: string = 'All';
  filterSemester: string = 'All';
  filterSection: string = 'All';
  filterAcademicYear: string = 'All';
  searchQuery: string = '';

  // Dropdown Options
  departments: string[] = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  courses: string[] = [
    'All',
    'B.Tech Computer Science',
    'B.Tech IT',
    'B.Tech ECE',
    'B.Tech Mechanical',
    'B.Tech Civil'
  ];

  years: string[] = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];

  semesters: string[] = [
    'All',
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ];

  sections: string[] = ['All', 'Section A', 'Section B', 'Section C'];
  academicYears: string[] = ['All', '2025-2026', '2026-2027', '2027-2028'];

  // Delete Modal State
  selectedEntryToDelete: TimetableEntry | null = null;

  // View Details Modal State
  selectedEntryToView: TimetableEntry | null = null;

  // Toast Notification
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private timetableService: TimetableService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.timeSlots = this.timetableService.timeSlots;
    this.timetableService.getTimetables().subscribe(data => {
      this.timetables = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filters: TimetableFilter = {
      department: this.filterDepartment,
      course: this.filterCourse,
      year: this.filterYear,
      semester: this.filterSemester,
      section: this.filterSection,
      academicYear: this.filterAcademicYear,
      searchQuery: this.searchQuery
    };

    this.filteredTimetables = this.timetableService.filterTimetables(filters);
    this.stats = this.timetableService.getStats(this.filteredTimetables);
  }

  clearFilters(): void {
    this.filterDepartment = 'All';
    this.filterCourse = 'All';
    this.filterYear = 'All';
    this.filterSemester = 'All';
    this.filterSection = 'All';
    this.filterAcademicYear = 'All';
    this.searchQuery = '';
    this.applyFilters();
    this.showToast('Filters reset to default view.', 'info');
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.activeViewMode = mode;
  }

  /**
   * Helper to retrieve entry for a specific day and period number for the Weekly Grid
   */
  getEntryForSlot(day: TimetableDay, periodNumber: number): TimetableEntry | undefined {
    return this.filteredTimetables.find(t => t.day === day && t.periodNumber === periodNumber);
  }

  createNew(): void {
    this.router.navigate(['/timetables/create']);
  }

  editEntry(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/timetables/edit', id]);
  }

  viewDetails(entry: TimetableEntry, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedEntryToView = entry;
  }

  closeViewModal(): void {
    this.selectedEntryToView = null;
  }

  confirmDelete(entry: TimetableEntry, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedEntryToDelete = entry;
  }

  executeDelete(): void {
    if (this.selectedEntryToDelete) {
      const subject = this.selectedEntryToDelete.subject;
      const success = this.timetableService.deleteTimetable(this.selectedEntryToDelete.id);
      if (success) {
        this.showToast(`Timetable entry for "${subject}" deleted successfully.`, 'danger');
        this.applyFilters();
      }
      this.selectedEntryToDelete = null;
    }
  }

  cancelDelete(): void {
    this.selectedEntryToDelete = null;
  }

  getSubjectCardClass(colorTag?: string): string {
    switch (colorTag) {
      case 'blue': return 'subject-card-blue';
      case 'pink': return 'subject-card-pink';
      case 'cyan': return 'subject-card-cyan';
      case 'green': return 'subject-card-green';
      case 'purple': return 'subject-card-purple';
      case 'amber': return 'subject-card-amber';
      default: return 'subject-card-blue';
    }
  }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
