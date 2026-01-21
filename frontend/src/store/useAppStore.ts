import { create } from 'zustand';
import api from '../services/api';
import type { Student, Exam, ApiResponse } from '../types';

interface AppState {
  // Estado
  students: Student[];
  isLoading: boolean;
  error: string | null;
  activeStudent: Student | null;
  exams: Exam[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Acciones
  fetchStudents: () => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  setActiveStudent: (student: Student | undefined) => void;
  fetchStudentExams: (studentId: string) => Promise<void>;
  addExam: (exam: Omit<Exam, 'id' | 'exam_date'>) => Promise<boolean>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<boolean>;
  deleteExam: (id: string) => Promise<boolean>;
  updateExam: (id: string, exam: { subject: string; score: number }) => Promise<boolean>;
  
}

export const useAppStore = create<AppState>((set) => ({
  students: [],
  isLoading: false,
  error: null,
  activeStudent: null,
  exams: [],
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  addStudent: async (studentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<Student>>('/students', studentData);
      set((state) => ({ 
        students: [response.data.data, ...state.students], 
        isLoading: false 
      }));
      return true;
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.detail || 'Error al crear estudiante';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  deleteStudent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/students/${id}`);
      // Filtramos el array local para quitar el eliminado sin recargar todo
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
        isLoading: false
      }));
      return true;
    } catch {
      set({ error: 'No se pudo eliminar el estudiante', isLoading: false });
      return false;
    }
  },

  setActiveStudent: (student) => {
    set({ activeStudent: student || null, exams: [], error: null });
  },

  fetchStudentExams: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Exam[]>>(`/exams/${studentId}`);
      set({ exams: response.data.data || [], isLoading: false });
    } catch {
      set({ exams: [], error: 'Error al cargar notas', isLoading: false });
    }
  },

  addExam: async (examData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<ApiResponse<Exam>>('/exams', examData);
      set((state) => ({ 
        exams: [...state.exams, response.data.data], 
        isLoading: false 
      }));
      return true;
    } catch {
      set({ error: 'Error al registrar nota', isLoading: false });
      return false;
    }
  },

  updateStudent: async (id, studentData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/students/${id}`, studentData);
      // Actualizamos la lista localmente para no recargar todo
      set((state) => ({
        students: state.students.map((s) => 
          s.id === id ? { ...s, ...studentData } : s
        ),
        isLoading: false
      }));
      return true;
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any).response?.data?.detail || 'Error al actualizar';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  deleteExam: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/exams/${id}`);
      // Actualizar la lista local quitando el examen borrado
      set((state) => ({
        exams: state.exams.filter((e) => e.id !== id),
        isLoading: false
      }));
      return true;
    } catch {
      set({ error: 'No se pudo eliminar la nota', isLoading: false });
      return false;
    }
  },

  updateExam: async (id, examData) => {
    set({ isLoading: true, error: null });
    try {
      const payload = { ...examData, student_id: "ignored_on_update" }; 

      await api.put(`/exams/${id}`, payload);
      
      set((state) => ({
        exams: state.exams.map((e) => e.id === id ? { ...e, ...examData } : e),
        isLoading: false
      }));
      return true;
    } catch {
      set({ error: 'Error al actualizar nota', isLoading: false });
      return false;
    }
  },
  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<ApiResponse<Student[]>>('/students');
      set({ students: response.data.data || [], isLoading: false });
    } catch {
      set({ error: 'Error al cargar estudiantes', isLoading: false });
    }
  },



}));