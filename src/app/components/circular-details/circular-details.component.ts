import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Circular } from '../../models/circular.model';
import { CircularService } from '../../services/circular.service';

@Component({
  selector: 'app-circular-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './circular-details.component.html',
  styleUrls: ['./circular-details.component.css']
})
export class CircularDetailsComponent implements OnInit {
  circular: Circular | undefined;
  selectedCircularToDelete: boolean = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private circularService: CircularService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.circular = this.circularService.getCircularById(id);
        if (!this.circular) {
          this.router.navigate(['/circulars']);
        }
      }
    });
  }

  togglePublishStatus(): void {
    if (!this.circular) return;
    const updated = this.circularService.togglePublishStatus(this.circular.id);
    if (updated) {
      this.circular = updated;
      const statusText = updated.status === 'Published' ? 'published' : 'unpublished (saved as draft)';
      this.showToast(`Circular is now ${statusText}.`, 'success');
    }
  }

  editCircular(): void {
    if (this.circular) {
      this.router.navigate(['/circulars/edit', this.circular.id]);
    }
  }

  confirmDelete(): void {
    this.selectedCircularToDelete = true;
  }

  executeDelete(): void {
    if (this.circular) {
      this.circularService.deleteCircular(this.circular.id);
      this.router.navigate(['/circulars']);
    }
  }

  cancelDelete(): void {
    this.selectedCircularToDelete = false;
  }

  backToList(): void {
    this.router.navigate(['/circulars']);
  }

  getPriorityBadgeClass(priority?: string): string {
    switch (priority) {
      case 'Urgent': return 'bg-danger text-white';
      case 'High': return 'bg-warning text-dark';
      case 'Medium': return 'bg-info text-dark';
      case 'Low': return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  }

  getStatusBadgeClass(status?: string): string {
    return status === 'Published' ? 'bg-success text-white' : 'bg-secondary text-white';
  }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
