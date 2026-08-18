import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialStatus, MaterialType, StudyMaterial } from '../../models/study-material.model';
import { StudyMaterialService } from '../../services/study-material.service';

@Component({
  selector: 'app-study-material-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './study-material-form.component.html',
  styleUrls: ['./study-material-form.component.css']
})
export class StudyMaterialFormComponent implements OnInit {
  materialForm!: FormGroup;
  isEditMode: boolean = false;
  materialId: number | null = null;
  pageTitle: string = 'Upload Study Material';
  submitted: boolean = false;

  // File Upload State
  selectedFile: File | null = null;
  uploadedFileName: string | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileType: string | null = null;

  // Dropdown options
  departments: string[] = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  courses: string[] = [
    'B.Tech Computer Science',
    'B.Tech IT',
    'B.Tech ECE',
    'B.Tech Mechanical',
    'B.Tech Civil',
    'M.Tech Software Eng',
    'BCA'
  ];

  years: string[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

  semesters: string[] = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ];

  sections: string[] = ['Section A', 'Section B', 'Section C', 'Section D'];

  subjects: string[] = [
    'Data Structures & Algorithms',
    'Cloud Computing & Microservices',
    'Web Technologies & Frameworks',
    'Database Management Systems',
    'Digital Signal Processing',
    'Artificial Intelligence & ML'
  ];

  materialTypes: MaterialType[] = [
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

  academicYears: string[] = ['2025-2026', '2026-2027', '2027-2028'];

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'success';

  constructor(
    private fb: FormBuilder,
    private studyMaterialService: StudyMaterialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.materialId = +idParam;
      this.isEditMode = true;
      this.pageTitle = 'Edit Study Material';
      this.loadMaterialData(this.materialId);
    }
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.materialForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      department: ['Computer Science & Engineering', Validators.required],
      course: ['B.Tech Computer Science', Validators.required],
      year: ['Year 4', Validators.required],
      semester: ['Semester 7', Validators.required],
      section: [''],
      subject: ['Data Structures & Algorithms', Validators.required],
      subjectCode: ['CS701', Validators.required],
      materialType: ['PDF' as MaterialType, Validators.required],
      topic: ['', Validators.required],
      externalLink: [''],
      academicYear: ['2026-2027', Validators.required],
      publishDate: [today, Validators.required],
      uploadedBy: ['Dr. Ramesh Kumar', Validators.required],
      status: ['Published' as MaterialStatus, Validators.required]
    });
  }

  loadMaterialData(id: number): void {
    const data = this.studyMaterialService.getMaterialById(id);
    if (data) {
      this.materialForm.patchValue({
        title: data.title,
        description: data.description,
        department: data.department,
        course: data.course,
        year: data.year,
        semester: data.semester,
        section: data.section,
        subject: data.subject,
        subjectCode: data.subjectCode,
        materialType: data.materialType,
        topic: data.topic,
        externalLink: data.externalLink || '',
        academicYear: data.academicYear,
        publishDate: data.publishDate,
        uploadedBy: data.uploadedBy,
        status: data.status
      });

      if (data.fileName) {
        this.uploadedFileName = data.fileName;
        this.uploadedFileSize = data.fileSize || '2.5 MB';
        this.uploadedFileType = data.fileType || 'pdf';
      }
    } else {
      this.showToast('Study material record not found.', 'danger');
      this.router.navigate(['/study-materials']);
    }
  }

  get f() {
    return this.materialForm.controls;
  }

  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.selectedFile = file;
      this.uploadedFileName = file.name;
      this.uploadedFileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      this.uploadedFileType = file.name.split('.').pop()?.toLowerCase() || 'file';
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.uploadedFileName = null;
    this.uploadedFileSize = null;
    this.uploadedFileType = null;
  }

  saveMaterial(targetStatus: MaterialStatus = 'Published'): void {
    this.submitted = true;

    if (this.materialForm.invalid) {
      this.showToast('Please complete all required form fields.', 'danger');
      return;
    }

    const formVal = this.materialForm.value;
    formVal.status = targetStatus;

    if (this.uploadedFileName) {
      formVal.fileName = this.uploadedFileName;
      formVal.fileSize = this.uploadedFileSize || '2.0 MB';
      formVal.fileType = this.uploadedFileType || 'pdf';
    }

    if (this.isEditMode && this.materialId !== null) {
      this.studyMaterialService.updateMaterial(this.materialId, formVal);
      this.showToast('Study material updated successfully!', 'success');
    } else {
      this.studyMaterialService.createMaterial(formVal);
      const actionLabel = targetStatus === 'Published' ? 'published' : 'saved as draft';
      this.showToast(`Study material ${actionLabel} successfully!`, 'success');
    }

    setTimeout(() => this.router.navigate(['/study-materials']), 1000);
  }

  resetForm(): void {
    this.submitted = false;
    this.removeFile();
    const today = new Date().toISOString().split('T')[0];
    this.materialForm.reset({
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: '',
      subject: 'Data Structures & Algorithms',
      subjectCode: 'CS701',
      materialType: 'PDF',
      academicYear: '2026-2027',
      publishDate: today,
      uploadedBy: 'Dr. Ramesh Kumar',
      status: 'Published'
    });
    this.showToast('Form fields reset.', 'info');
  }

  cancel(): void {
    this.router.navigate(['/study-materials']);
  }

  showToast(message: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
