import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TimetableEntry } from '../../models/timetable.model';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-timetable-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './timetable-details.component.html',
  styleUrls: ['./timetable-details.component.css']
})
export class TimetableDetailsComponent implements OnInit {
  timetable: TimetableEntry | null = null;
  selectedEntryToDelete: TimetableEntry | null = null;
  toastMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private timetableService: TimetableService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      const data = this.timetableService.getTimetableById(id);
      if (data) {
        this.timetable = data;
      } else {
        this.router.navigate(['/timetables']);
      }
    }
  }

  backToList(): void {
    this.router.navigate(['/timetables']);
  }

  editTimetable(): void {
    if (this.timetable) {
      this.router.navigate(['/timetables/edit', this.timetable.id]);
    }
  }

  confirmDelete(): void {
    this.selectedEntryToDelete = this.timetable;
  }

  cancelDelete(): void {
    this.selectedEntryToDelete = null;
  }

  executeDelete(): void {
    if (this.timetable) {
      this.timetableService.deleteTimetable(this.timetable.id);
      this.router.navigate(['/timetables']);
    }
  }
}
