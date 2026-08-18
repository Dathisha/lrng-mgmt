import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialType, StudyMaterial } from '../../models/study-material.model';
import { StudyMaterialService } from '../../services/study-material.service';

@Component({
  selector: 'app-study-material-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './study-material-details.component.html',
  styleUrls: ['./study-material-details.component.css']
})
export class StudyMaterialDetailsComponent implements OnInit {
  material: StudyMaterial | null = null;
  selectedMaterialToDelete: StudyMaterial | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studyMaterialService: StudyMaterialService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      const data = this.studyMaterialService.getMaterialById(id);
      if (data) {
        this.material = data;
      } else {
        this.router.navigate(['/study-materials']);
      }
    }
  }

  backToList(): void {
    this.router.navigate(['/study-materials']);
  }

  editMaterial(): void {
    if (this.material) {
      this.router.navigate(['/study-materials/edit', this.material.id]);
    }
  }

  confirmDelete(): void {
    this.selectedMaterialToDelete = this.material;
  }

  cancelDelete(): void {
    this.selectedMaterialToDelete = null;
  }

  executeDelete(): void {
    if (this.material) {
      this.studyMaterialService.deleteMaterial(this.material.id);
      this.router.navigate(['/study-materials']);
    }
  }

  downloadResource(): void {
    if (this.material?.externalLink) {
      window.open(this.material.externalLink, '_blank');
    } else if (this.material?.fileName) {
      alert(`Simulating download for: ${this.material.fileName}`);
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
}
