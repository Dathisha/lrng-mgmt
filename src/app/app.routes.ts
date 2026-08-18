import { Routes } from '@angular/router';
import { FacultyAssignmentComponent } from './components/faculty-assignment/faculty-assignment.component';
import { CircularListComponent } from './components/circular-list/circular-list.component';
import { CircularFormComponent } from './components/circular-form/circular-form.component';
import { CircularDetailsComponent } from './components/circular-details/circular-details.component';
import { TimetableListComponent } from './components/timetable-list/timetable-list.component';
import { TimetableFormComponent } from './components/timetable-form/timetable-form.component';
import { TimetableDetailsComponent } from './components/timetable-details/timetable-details.component';
import { StudyMaterialListComponent } from './components/study-material-list/study-material-list.component';
import { StudyMaterialFormComponent } from './components/study-material-form/study-material-form.component';
import { StudyMaterialDetailsComponent } from './components/study-material-details/study-material-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'assignments', pathMatch: 'full' },
  { path: 'assignments', component: FacultyAssignmentComponent },
  { path: 'circulars', component: CircularListComponent },
  { path: 'circulars/create', component: CircularFormComponent },
  { path: 'circulars/edit/:id', component: CircularFormComponent },
  { path: 'circulars/details/:id', component: CircularDetailsComponent },
  { path: 'timetables', component: TimetableListComponent },
  { path: 'timetables/create', component: TimetableFormComponent },
  { path: 'timetables/edit/:id', component: TimetableFormComponent },
  { path: 'timetables/details/:id', component: TimetableDetailsComponent },
  { path: 'study-materials', component: StudyMaterialListComponent },
  { path: 'study-materials/create', component: StudyMaterialFormComponent },
  { path: 'study-materials/edit/:id', component: StudyMaterialFormComponent },
  { path: 'study-materials/details/:id', component: StudyMaterialDetailsComponent },
  { path: '**', redirectTo: 'assignments' }
];
