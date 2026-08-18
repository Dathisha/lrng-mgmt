import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Circular, CircularAttachment, CircularAudience, CircularPriority, CircularStatus } from '../../models/circular.model';
import { CircularService } from '../../services/circular.service';

@Component({
  selector: 'app-circular-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './circular-form.component.html',
  styleUrls: ['./circular-form.component.css']
})
export class CircularFormComponent implements OnInit {
  circularForm!: FormGroup;
  isEditMode: boolean = false;
  circularId: number | null = null;
  pageTitle: string = 'Create New Faculty Circular';

  // Attachments list state
  attachments: CircularAttachment[] = [];

  // Dropdown options
  departments: string[] = [
    'All Departments',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  courses: string[] = [
    'All Courses',
    'B.Tech Computer Science',
    'B.Tech Information Technology',
    'B.Tech ECE',
    'B.Tech Mechanical',
    'B.Tech Civil',
    'M.Tech Software Eng',
    'BCA'
  ];

  semesters: string[] = [
    'All Semesters',
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ];

  audiences: CircularAudience[] = [
    'All Students',
    'Specific Course',
    'Specific Department'
  ];

  priorities: CircularPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  // Form submission attempt flag for error messages
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private circularService: CircularService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check if editing existing circular
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.circularId = +idParam;
        this.pageTitle = 'Edit Faculty Circular';
        this.loadCircular(this.circularId);
      }
    });
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.circularForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      circularNumber: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      department: ['Computer Science & Engineering', Validators.required],
      course: ['B.Tech Computer Science', Validators.required],
      semester: ['Semester 5', Validators.required],
      section: [''],
      audience: ['Specific Course' as CircularAudience, Validators.required],
      priority: ['Medium' as CircularPriority, Validators.required],
      publishDate: [today, Validators.required],
      expiryDate: [''],
      status: ['Published' as CircularStatus, Validators.required]
    });
  }

  private loadCircular(id: number): void {
    const circular = this.circularService.getCircularById(id);
    if (circular) {
      this.circularForm.patchValue({
        title: circular.title,
        circularNumber: circular.circularNumber || '',
        description: circular.description,
        department: circular.department,
        course: circular.course,
        semester: circular.semester,
        section: circular.section || '',
        audience: circular.audience,
        priority: circular.priority,
        publishDate: circular.publishDate,
        expiryDate: circular.expiryDate || '',
        status: circular.status
      });
      this.attachments = [...circular.attachments];
    } else {
      this.router.navigate(['/circulars']);
    }
  }

  // Handle mock file uploads
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let fileType: 'pdf' | 'docx' | 'image' | 'other' = 'other';
        if (ext === 'pdf') fileType = 'pdf';
        else if (['doc', 'docx'].includes(ext)) fileType = 'docx';
        else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) fileType = 'image';

        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

        this.attachments.push({
          name: file.name,
          size: sizeInMb,
          type: fileType
        });
      }
    }
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  // Submit as Published or Draft
  saveCircular(targetStatus: CircularStatus): void {
    this.submitted = true;
    this.circularForm.patchValue({ status: targetStatus });

    if (this.circularForm.invalid) {
      return;
    }

    const formValues = this.circularForm.value;

    const circularData = {
      circularNumber: formValues.circularNumber,
      title: formValues.title,
      description: formValues.description,
      department: formValues.department,
      course: formValues.course,
      semester: formValues.semester,
      section: formValues.section,
      audience: formValues.audience,
      priority: formValues.priority,
      publishDate: formValues.publishDate,
      expiryDate: formValues.expiryDate,
      attachments: this.attachments,
      status: targetStatus
    };

    if (this.isEditMode && this.circularId) {
      this.circularService.updateCircular(this.circularId, circularData);
    } else {
      this.circularService.createCircular(circularData);
    }

    this.router.navigate(['/circulars']);
  }

  cancel(): void {
    this.router.navigate(['/circulars']);
  }

  // Convenient getters for form validation in template
  get f() {
    return this.circularForm.controls;
  }
}
