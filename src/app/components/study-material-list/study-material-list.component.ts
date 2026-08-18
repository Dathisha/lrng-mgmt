import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialType, StudyMaterial, StudyMaterialFilter, StudyMaterialStats } from '../../models/study-material.model';
import { StudyMaterialService } from '../../services/study-material.service';

@Component({
  selector: 'app-study-material-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './study-material-list.component.html',
  styleUrls: ['./study-material-list.component.css']
})
export class StudyMaterialListComponent implements OnInit {
  materials: StudyMaterial[] = [];
  filteredMaterials: StudyMaterial[] = [];

  stats: StudyMaterialStats = {
    totalMaterials: 0,
    published: 0,
    drafts: 0,
    pdfCount: 0,
    videoLinkCount: 0
  };

  // Filter selections
  filterDepartment: string = 'All';
  filterCourse: string = 'All';
  filterSemester: string = 'All';
  filterSubject: string = 'All';
  filterMaterialType: string = 'All';
  filterStatus: string = 'All';
  searchQuery: string = '';

  // Dropdown options
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

  subjects: string[] = [
    'All',
    'Data Structures & Algorithms',
    'Cloud Computing & Microservices',
    'Web Technologies & Frameworks',
    'Database Management Systems',
    'Digital Signal Processing',
    'Artificial Intelligence & ML'
  ];

  materialTypes: string[] = [
    'All',
    'Notes',
    'PDF',
    'PPT',
    'Document',
    'Video',
    'Link',
    'Reference Material',
    'Lab Material',
    'Other'
  ];

  statuses: string[] = ['All', 'Published', 'Draft'];

  // Delete modal state
  selectedMaterialToDelete: StudyMaterial | null = null;

  // View details modal state
  selectedMaterialToView: StudyMaterial | null = null;

  // Toast Notification
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private studyMaterialService: StudyMaterialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studyMaterialService.getMaterials().subscribe(data => {
      this.materials = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filters: StudyMaterialFilter = {
      department: this.filterDepartment,
      course: this.filterCourse,
      semester: this.filterSemester,
      subject: this.filterSubject,
      materialType: this.filterMaterialType,
      status: this.filterStatus,
      searchQuery: this.searchQuery
    };

    this.filteredMaterials = this.studyMaterialService.filterMaterials(filters);
    this.stats = this.studyMaterialService.getStats(this.filteredMaterials);
  }

  clearFilters(): void {
    this.filterDepartment = 'All';
    this.filterCourse = 'All';
    this.filterSemester = 'All';
    this.filterSubject = 'All';
    this.filterMaterialType = 'All';
    this.filterStatus = 'All';
    this.searchQuery = '';
    this.applyFilters();
    this.showToast('Filters reset to default view.', 'info');
  }

  togglePublish(material: StudyMaterial, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const updated = this.studyMaterialService.togglePublishStatus(material.id);
    if (updated) {
      const statusText = updated.status === 'Published' ? 'published' : 'saved as draft';
      this.showToast(`Study material "${updated.title}" has been ${statusText}.`, 'success');
      this.applyFilters();
    }
  }

  createNew(): void {
    this.router.navigate(['/study-materials/create']);
  }

  editMaterial(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/study-materials/edit', id]);
  }

  viewDetails(material: StudyMaterial, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/study-materials/details', material.id]);
  }

  confirmDelete(material: StudyMaterial, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedMaterialToDelete = material;
  }

  executeDelete(): void {
    if (this.selectedMaterialToDelete) {
      const title = this.selectedMaterialToDelete.title;
      const success = this.studyMaterialService.deleteMaterial(this.selectedMaterialToDelete.id);
      if (success) {
        this.showToast(`Study material "${title}" deleted successfully.`, 'danger');
        this.applyFilters();
      }
      this.selectedMaterialToDelete = null;
    }
  }

  cancelDelete(): void {
    this.selectedMaterialToDelete = null;
  }

  downloadMaterial(material: StudyMaterial, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (material.externalLink) {
      window.open(material.externalLink, '_blank');
      this.showToast(`Opening external resource link...`, 'info');
    } else if (material.fileName) {
      this.showToast(`Simulating file download for "${material.fileName}" (${material.fileSize}).`, 'success');
    } else {
      this.showToast(`No attached file found for this material.`, 'warning');
    }
  }

  getTypeBadgeClass(type: MaterialType): string {
    switch (type) {
      case 'PDF': return 'bg-danger text-white';
      case 'PPT': return 'bg-warning text-dark';
      case 'Video': return 'bg-purple text-white';
      case 'Link': return 'bg-info text-dark';
      case 'Notes': return 'bg-primary text-white';
      case 'Lab Material': return 'bg-success text-white';
      case 'Reference Material': return 'bg-secondary text-white';
      default: return 'bg-dark text-white';
    }
  }

  getTypeIcon(type: MaterialType): string {
    switch (type) {
      case 'PDF': return '📄';
      case 'PPT': return '📊';
      case 'Video': return '🎥';
      case 'Link': return '🔗';
      case 'Notes': return '📝';
      case 'Lab Material': return '🧪';
      case 'Reference Material': return '📚';
      default: return '📁';
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
