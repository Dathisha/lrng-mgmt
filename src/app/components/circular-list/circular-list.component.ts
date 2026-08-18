import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Circular, CircularFilter, CircularStats } from '../../models/circular.model';
import { CircularService } from '../../services/circular.service';

@Component({
  selector: 'app-circular-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './circular-list.component.html',
  styleUrls: ['./circular-list.component.css']
})
export class CircularListComponent implements OnInit {
  circulars: Circular[] = [];
  filteredCirculars: Circular[] = [];
  stats: CircularStats = {
    totalCirculars: 0,
    published: 0,
    drafts: 0,
    urgent: 0
  };

  // Filter selections
  filterDepartment: string = 'All';
  filterCourse: string = 'All';
  filterSemester: string = 'All';
  filterStatus: string = 'All';
  filterPriority: string = 'All';
  searchQuery: string = '';

  // Options for dropdowns
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
    'B.Tech Information Technology',
    'B.Tech ECE',
    'B.Tech Mechanical',
    'B.Tech Civil',
    'M.Tech Software Eng',
    'BCA'
  ];

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

  statuses: string[] = ['All', 'Published', 'Draft'];
  priorities: string[] = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  // Delete modal state
  selectedCircularToDelete: Circular | null = null;

  // Notification Toast message
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private circularService: CircularService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.circularService.getCirculars().subscribe(data => {
      this.circulars = data;
      this.applyFilters();
      this.updateStats();
    });
  }

  applyFilters(): void {
    const filterParams: CircularFilter = {
      department: this.filterDepartment,
      course: this.filterCourse,
      semester: this.filterSemester,
      status: this.filterStatus,
      priority: this.filterPriority,
      searchQuery: this.searchQuery
    };
    this.filteredCirculars = this.circularService.filterCirculars(filterParams);
  }

  clearFilters(): void {
    this.filterDepartment = 'All';
    this.filterCourse = 'All';
    this.filterSemester = 'All';
    this.filterStatus = 'All';
    this.filterPriority = 'All';
    this.searchQuery = '';
    this.applyFilters();
    this.showToast('Filters reset to default.', 'info');
  }

  updateStats(): void {
    this.stats = this.circularService.getStats();
  }

  togglePublish(circular: Circular, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const updated = this.circularService.togglePublishStatus(circular.id);
    if (updated) {
      const actionText = updated.status === 'Published' ? 'published' : 'unpublished and saved as draft';
      this.showToast(`Circular "${updated.title}" has been ${actionText}.`, 'success');
      this.applyFilters();
      this.updateStats();
    }
  }

  confirmDelete(circular: Circular, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedCircularToDelete = circular;
  }

  executeDelete(): void {
    if (this.selectedCircularToDelete) {
      const title = this.selectedCircularToDelete.title;
      const success = this.circularService.deleteCircular(this.selectedCircularToDelete.id);
      if (success) {
        this.showToast(`Circular "${title}" deleted successfully.`, 'danger');
        this.applyFilters();
        this.updateStats();
      }
      this.selectedCircularToDelete = null;
    }
  }

  cancelDelete(): void {
    this.selectedCircularToDelete = null;
  }

  viewDetails(id: number): void {
    this.router.navigate(['/circulars/details', id]);
  }

  editCircular(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/circulars/edit', id]);
  }

  createNew(): void {
    this.router.navigate(['/circulars/create']);
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Urgent': return 'bg-danger text-white pulse-badge';
      case 'High': return 'bg-warning text-dark';
      case 'Medium': return 'bg-info text-dark';
      case 'Low': return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  }

  getStatusBadgeClass(status: string): string {
    return status === 'Published'
      ? 'bg-success text-white'
      : 'bg-secondary text-white';
  }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
