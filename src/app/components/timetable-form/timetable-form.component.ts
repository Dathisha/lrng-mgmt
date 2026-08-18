import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TimetableDay, TimetableEntry, TimeSlot } from '../../models/timetable.model';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-timetable-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './timetable-form.component.html',
  styleUrls: ['./timetable-form.component.css']
})
export class TimetableFormComponent implements OnInit {
  timetableForm!: FormGroup;
  isEditMode: boolean = false;
  entryId: number | null = null;
  pageTitle: string = 'Add New Timetable Entry';
  submitted: boolean = false;

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
  days: TimetableDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  academicYears: string[] = ['2025-2026', '2026-2027', '2027-2028'];
  timeSlots: TimeSlot[] = [];

  // Toast
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' | 'info' = 'success';

  constructor(
    private fb: FormBuilder,
    private timetableService: TimetableService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.timeSlots = this.timetableService.timeSlots;
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.entryId = +idParam;
      this.isEditMode = true;
      this.pageTitle = 'Edit Timetable Entry';
      this.loadEntryData(this.entryId);
    }
  }

  initForm(): void {
    this.timetableForm = this.fb.group({
      department: ['Computer Science & Engineering', Validators.required],
      course: ['B.Tech Computer Science', Validators.required],
      year: ['Year 4', Validators.required],
      semester: ['Semester 7', Validators.required],
      section: [''],
      day: ['Monday', Validators.required],
      periodNumber: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      startTime: ['09:00 AM', Validators.required],
      endTime: ['10:00 AM', Validators.required],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      subjectCode: ['', [Validators.required, Validators.minLength(2)]],
      faculty: ['', [Validators.required, Validators.minLength(3)]],
      academicYear: ['2026-2027', Validators.required],
      colorTag: ['blue']
    });

    // Auto update start and end time when period number changes
    this.timetableForm.get('periodNumber')?.valueChanges.subscribe(periodNum => {
      const slot = this.timeSlots.find(s => s.periodNumber === +periodNum);
      if (slot) {
        this.timetableForm.patchValue({
          startTime: slot.startTime,
          endTime: slot.endTime
        });
      }
    });
  }

  loadEntryData(id: number): void {
    const entry = this.timetableService.getTimetableById(id);
    if (entry) {
      this.timetableForm.patchValue({
        department: entry.department,
        course: entry.course,
        year: entry.year,
        semester: entry.semester,
        section: entry.section,
        day: entry.day,
        periodNumber: entry.periodNumber,
        startTime: entry.startTime,
        endTime: entry.endTime,
        subject: entry.subject,
        subjectCode: entry.subjectCode,
        faculty: entry.faculty,
        academicYear: entry.academicYear,
        colorTag: entry.colorTag || 'blue'
      });
    } else {
      this.showToast('Timetable entry not found.', 'danger');
      this.router.navigate(['/timetables']);
    }
  }

  get f() {
    return this.timetableForm.controls;
  }

  saveEntry(addAnother: boolean = false): void {
    this.submitted = true;

    if (this.timetableForm.invalid) {
      this.showToast('Please fix the errors in the form before saving.', 'danger');
      return;
    }

    const formVal = this.timetableForm.value;

    if (this.isEditMode && this.entryId !== null) {
      this.timetableService.updateTimetable(this.entryId, formVal);
      this.showToast('Timetable entry updated successfully!', 'success');
      setTimeout(() => this.router.navigate(['/timetables']), 1000);
    } else {
      this.timetableService.createTimetable(formVal);
      this.showToast('New timetable entry created successfully!', 'success');

      if (addAnother) {
        this.submitted = false;
        this.timetableForm.reset({
          department: formVal.department,
          course: formVal.course,
          year: formVal.year,
          semester: formVal.semester,
          section: formVal.section,
          day: formVal.day,
          periodNumber: 1,
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          academicYear: formVal.academicYear,
          colorTag: 'blue'
        });
      } else {
        setTimeout(() => this.router.navigate(['/timetables']), 1000);
      }
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.timetableForm.reset({
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: '',
      day: 'Monday',
      periodNumber: 1,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      academicYear: '2026-2027',
      colorTag: 'blue'
    });
    this.showToast('Form reset to default values.', 'info');
  }

  cancel(): void {
    this.router.navigate(['/timetables']);
  }

  showToast(message: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
