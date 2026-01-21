// frontend/src/types/index.ts

export interface Student {
  id: string;
  dni: string;      
  name: string;
  email: string;
  age: number;      
  gender: 'M' | 'F' | 'Otro';
  classroom: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  photo_url?: string;
}

export interface Exam {
  id: string;
  student_id: string;
  subject: string;
  score: number;
  exam_date: string;
}

export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}