import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialStatus, MaterialType, StudyMaterial, StudyMaterialFilter, StudyMaterialStats } from '../models/study-material.model';

@Injectable({
  providedIn: 'root'
})
export class StudyMaterialService {
  // Base API placeholder for future Laravel API integration
  private readonly apiUrl = 'http://127.0.0.1:8000/api/faculty/study-materials';

  private initialMaterials: StudyMaterial[] = [
    {
      id: 1,
      title: 'Complete Lecture Notes on Data Structures & Binary Trees',
      description: 'Comprehensive chapter-wise lecture notes covering Array Data Structures, Linked Lists, Stack/Queue implementations, and Binary Search Tree algorithms.',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      subject: 'Data Structures & Algorithms',
      subjectCode: 'CS701',
      materialType: 'PDF',
      topic: 'Chapter 3: Trees & Graphs',
      fileName: 'Data_Structures_Lecture_Notes_2026.pdf',
      fileSize: '4.8 MB',
      fileType: 'pdf',
      academicYear: '2026-2027',
      publishDate: '2026-08-02',
      uploadedBy: 'Dr. Ramesh Kumar',
      status: 'Published',
      createdAt: '2026-08-02',
      updatedAt: '2026-08-02'
    },
    {
      id: 2,
      title: 'Cloud Microservices & Container Orchestration Presentation',
      description: 'Slide deck presentation detailing Docker containers, Kubernetes deployments, service mesh architectures, and AWS serverless computing concepts.',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      subject: 'Cloud Computing & Microservices',
      subjectCode: 'CS702',
      materialType: 'PPT',
      topic: 'Module 4: Container Systems',
      fileName: 'Cloud_Microservices_Orchestration.pptx',
      fileSize: '12.4 MB',
      fileType: 'pptx',
      academicYear: '2026-2027',
      publishDate: '2026-08-04',
      uploadedBy: 'Prof. Ananya Sharma',
      status: 'Published',
      createdAt: '2026-08-04',
      updatedAt: '2026-08-04'
    },
    {
      id: 3,
      title: 'Angular 18 Enterprise Architecture Video Tutorial & Code Repo',
      description: 'Recorded live lecture demonstration on Angular Standalone Components, RxJS State Management, Reactive Forms, and Routing.',
      department: 'Information Technology',
      course: 'B.Tech IT',
      year: 'Year 3',
      semester: 'Semester 5',
      section: 'Section B',
      subject: 'Web Technologies & Frameworks',
      subjectCode: 'IT503',
      materialType: 'Video',
      topic: 'Chapter 5: Frontend Frameworks',
      externalLink: 'https://youtube.com/watch?v=example-angular-lms',
      academicYear: '2026-2027',
      publishDate: '2026-08-05',
      uploadedBy: 'Dr. Vikramaditya',
      status: 'Published',
      createdAt: '2026-08-05',
      updatedAt: '2026-08-05'
    },
    {
      id: 4,
      title: 'Database Normalization (1NF to 5NF) & SQL Practice Sets',
      description: 'Solved database normalization examples, SQL query exercises, index tuning tips, and ER diagram design patterns.',
      department: 'Information Technology',
      course: 'B.Tech IT',
      year: 'Year 3',
      semester: 'Semester 5',
      section: 'Section B',
      subject: 'Database Management Systems',
      subjectCode: 'IT501',
      materialType: 'Notes',
      topic: 'Chapter 2: Relational Models',
      fileName: 'DBMS_Normalization_Practice_Set.docx',
      fileSize: '2.1 MB',
      fileType: 'docx',
      academicYear: '2026-2027',
      publishDate: '2026-08-06',
      uploadedBy: 'Prof. Meera Nair',
      status: 'Published',
      createdAt: '2026-08-06',
      updatedAt: '2026-08-06'
    },
    {
      id: 5,
      title: 'Draft: Digital Signal Processing & Oscilloscope Hardware Manual',
      description: 'Lab practical manual for Signal Processing experiments using Digital Storage Oscilloscopes and Micro-controller boards.',
      department: 'Electronics & Communication',
      course: 'B.Tech ECE',
      year: 'Year 2',
      semester: 'Semester 3',
      section: 'Section A',
      subject: 'Digital Signal Processing',
      subjectCode: 'EC302',
      materialType: 'Lab Material',
      topic: 'Practical Experiment 4',
      fileName: 'DSP_Lab_Manual_Draft.pdf',
      fileSize: '3.6 MB',
      fileType: 'pdf',
      academicYear: '2026-2027',
      publishDate: '2026-08-10',
      uploadedBy: 'Dr. S. K. Gupta',
      status: 'Draft',
      createdAt: '2026-08-07',
      updatedAt: '2026-08-07'
    },
    {
      id: 6,
      title: 'IEEE Reference Papers & Case Studies on Neural Networks',
      description: 'Curated list of peer-reviewed IEEE research publications on Convolutional Neural Networks, Transformers, and Machine Learning.',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 'Year 4',
      semester: 'Semester 7',
      section: 'Section A',
      subject: 'Artificial Intelligence & ML',
      subjectCode: 'CS704',
      materialType: 'Reference Material',
      topic: 'Neural Network Architectures',
      externalLink: 'https://ieee.org/papers/deep-learning-case-studies',
      academicYear: '2026-2027',
      publishDate: '2026-08-08',
      uploadedBy: 'Dr. Priya Sundaram',
      status: 'Published',
      createdAt: '2026-08-08',
      updatedAt: '2026-08-08'
    }
  ];

  private materialsSubject = new BehaviorSubject<StudyMaterial[]>(this.initialMaterials);
  public materials$: Observable<StudyMaterial[]> = this.materialsSubject.asObservable();

  constructor() {}

  getMaterials(): Observable<StudyMaterial[]> {
    return this.materials$;
  }

  getMaterialById(id: number): StudyMaterial | undefined {
    return this.materialsSubject.value.find(m => m.id === id);
  }

  filterMaterials(filters: StudyMaterialFilter): StudyMaterial[] {
    let list = [...this.materialsSubject.value];

    if (filters.department && filters.department !== 'All') {
      list = list.filter(m => m.department.toLowerCase() === filters.department.toLowerCase());
    }

    if (filters.course && filters.course !== 'All') {
      list = list.filter(m => m.course.toLowerCase().includes(filters.course.toLowerCase()));
    }

    if (filters.semester && filters.semester !== 'All') {
      list = list.filter(m => m.semester.toLowerCase() === filters.semester.toLowerCase());
    }

    if (filters.subject && filters.subject !== 'All') {
      list = list.filter(m => m.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    }

    if (filters.materialType && filters.materialType !== 'All') {
      list = list.filter(m => m.materialType === filters.materialType);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter(m => m.status === filters.status);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.subjectCode.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q) ||
        m.uploadedBy.toLowerCase().includes(q) ||
        (m.fileName && m.fileName.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getStats(filteredList?: StudyMaterial[]): StudyMaterialStats {
    const list = filteredList || this.materialsSubject.value;
    return {
      totalMaterials: list.length,
      published: list.filter(m => m.status === 'Published').length,
      drafts: list.filter(m => m.status === 'Draft').length,
      pdfCount: list.filter(m => m.materialType === 'PDF' || m.fileType === 'pdf').length,
      videoLinkCount: list.filter(m => m.materialType === 'Video' || m.materialType === 'Link' || !!m.externalLink).length
    };
  }

  createMaterial(data: Omit<StudyMaterial, 'id' | 'createdAt' | 'updatedAt'>): StudyMaterial {
    const list = this.materialsSubject.value;
    const newId = list.length > 0 ? Math.max(...list.map(m => m.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];

    const newMaterial: StudyMaterial = {
      ...data,
      id: newId,
      createdAt: today,
      updatedAt: today
    };

    const updatedList = [newMaterial, ...list];
    this.materialsSubject.next(updatedList);
    return newMaterial;
  }

  updateMaterial(id: number, data: Partial<StudyMaterial>): StudyMaterial | null {
    const list = this.materialsSubject.value;
    const index = list.findIndex(m => m.id === id);

    if (index === -1) return null;

    const today = new Date().toISOString().split('T')[0];
    const updatedMaterial: StudyMaterial = {
      ...list[index],
      ...data,
      updatedAt: today
    };

    list[index] = updatedMaterial;
    this.materialsSubject.next([...list]);
    return updatedMaterial;
  }

  togglePublishStatus(id: number): StudyMaterial | null {
    const list = this.materialsSubject.value;
    const item = list.find(m => m.id === id);
    if (!item) return null;

    const newStatus: MaterialStatus = item.status === 'Published' ? 'Draft' : 'Published';
    return this.updateMaterial(id, { status: newStatus });
  }

  deleteMaterial(id: number): boolean {
    const list = this.materialsSubject.value;
    const filtered = list.filter(m => m.id !== id);
    if (filtered.length !== list.length) {
      this.materialsSubject.next(filtered);
      return true;
    }
    return false;
  }
}
