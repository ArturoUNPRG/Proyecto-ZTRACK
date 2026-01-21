import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { type Exam } from '../types';

import { 
  ArrowLeft, Plus, GraduationCap, AlertCircle, Trash2, 
  User, Mail, Phone, MapPin, Calculator, BookOpen, Pencil, 
  AlertTriangle,  BarChart3, LineChart, Target, Clock,
} from 'lucide-react';

import { 
  BarChart, Bar, LineChart as RechartsLine, Line, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Tooltip, ResponsiveContainer, Cell, XAxis, YAxis, CartesianGrid,
  Legend
} from 'recharts';

export const NotasAlumnos = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        students, activeStudent, setActiveStudent, exams, 
        fetchStudentExams, addExam, updateExam, deleteExam, 
        isLoading, error, fetchStudents
    } = useAppStore();

    const [subject, setSubject] = useState('');
    const [score, setScore] = useState('');

    // Estado para Edición
    const [editingExamId, setEditingExamId] = useState<string | null>(null);

    // Estado para Modal de Eliminación
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [examToDelete, setExamToDelete] = useState<string | null>(null);

    // Estado para gráfico activo en móvil
    const [activeChartIndex, setActiveChartIndex] = useState(0);

    useEffect(() => {
        const initData = async () => {
            if (!id) return;

            if (students.length === 0) {
                await fetchStudents();
            }

            const allStudents = useAppStore.getState().students;
            const current = allStudents.find(s => s.id === id);
            
            if (current) {
                setActiveStudent(current);
            }
            await fetchStudentExams(id);
        };

        initData();
    }, [id, fetchStudents, fetchStudentExams, setActiveStudent, students.length]);

    useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && deleteModalOpen) {
        setDeleteModalOpen(false);
        }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    // Limpiar el event listener cuando el componente se desmonte o el modal se cierre
    return () => {
        window.removeEventListener('keydown', handleEscKey);
    };
    }, [deleteModalOpen]);

    // Manejo de Inputs (SOLO ENTEROS)
    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Solo números
    if (val === '') { setScore(''); return; }
        const num = parseInt(val);
    if (!isNaN(num) && num >= 0 && num <= 20) {
        setScore(val);  
    }
    };

    // Cargar datos al formulario para editar
    const handleEditClick = (exam: Exam) => {
        setEditingExamId(exam.id);
        setSubject(exam.subject);
        setScore(exam.score.toString());
    };

    const handleCancelEdit = () => {
        setEditingExamId(null);
        setSubject('');
        setScore('');
    };

    // Guardar (Crear o Editar)
    const handleSaveExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !score || !subject.trim()) {
        alert("Faltan datos.");
        return;
    }

    const numScore = parseInt(score);
    let success = false;

    if (editingExamId) {
    // EDITAR
        success = await updateExam(editingExamId, { subject, score: numScore });
    } else {
    // CREAR
        success = await addExam({ student_id: id, subject, score: numScore });
    }

    if (success) {
        handleCancelEdit(); // Limpia form y estado
    }
    };

    // Abrir Modal de Eliminar
    const confirmDelete = (examId: string) => {
        setExamToDelete(examId);
        setDeleteModalOpen(true);
    };

    // Ejecutar Eliminación
    const executeDelete = async () => {
        if (examToDelete) {
        await deleteExam(examToDelete);
        setDeleteModalOpen(false);
        setExamToDelete(null);
    }
    };

    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'NN';

    const average = exams.length > 0 
    ? (exams.reduce((acc, curr) => acc + curr.score, 0) / exams.length).toFixed(1)
    : '0';
    const averageNum = parseFloat(average);

    // Calcular estadísticas
    const maxScore = exams.length > 0 ? Math.max(...exams.map(e => e.score)) : 0;
    const passedExams = exams.filter(e => e.score >= 11).length;
    const passPercentage = exams.length > 0 ? Math.round((passedExams / exams.length) * 100) : 0;

    // Datos para gráficos
    const barChartData = exams.map(exam => ({
        name: exam.subject.length > 10 ? exam.subject.substring(0, 10) + '...' : exam.subject,
        fullName: exam.subject,
        score: exam.score,
        status: exam.score >= 11 ? 'Aprobado' : 'Reprobado'
    }));

    // Datos para gráfico de línea (tendencia por orden de creación)
    const lineChartData = exams.map((exam, index) => ({
        index: index + 1,
        subject: exam.subject,
        score: exam.score,
        date: `Examen ${index + 1}`
    }));

    // Datos para radar chart (comparación de desempeño)
    const radarChartData = exams.slice(0, 6).map(exam => ({
        subject: exam.subject.length > 8 ? exam.subject.substring(0, 8) : exam.subject,
        score: exam.score,
        fullMark: 20
    }));

    if (!activeStudent && !isLoading) return <div className="p-10 text-center">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zgroup-ice/20 to-white w-full">
        {/* Header */}
        <div className="w-full bg-white border-b border-gray-200">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                
                {/* Primera línea: Navegación y título */}
                <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <button 
                    onClick={() => navigate('/students')} 
                    className="flex items-center text-zgroup-dark hover:text-zgroup-blue transition-colors font-medium text-sm"
                    >
                    <ArrowLeft size={16} className="mr-1" /> 
                    <span className="hidden sm:inline">Volver</span>
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="text-sm font-medium text-zgroup-dark">Sistema Académico</div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                    {exams.length} {exams.length === 1 ? 'nota' : 'notas'}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${averageNum >= 13 ? 'bg-green-100 text-green-800' : averageNum >= 11 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    PROMEDIO: {average}
                    </div>
                </div>
                </div>

                {/* Segunda línea: Información del estudiante */}
                {activeStudent && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
                    {/* Foto y datos principales */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                            {activeStudent.photo_url ? (
                                <img src={activeStudent.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zgroup-ice flex items-center justify-center text-base font-bold text-zgroup-dark ">
                                {getInitials(activeStudent.name)}
                                </div>
                            )}
                            </div>
                        </div>
                        
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-[22px] font-bold text-zgroup-dark">
                                    {activeStudent.name}
                                </h1>
                                <span className="text-sm text-gray-600 font-medium bg-gray-50 px-2 py-0.5 rounded ml-2">
                                    {activeStudent.classroom}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <User size={13} className="text-gray-400" />
                                    <span className="font-medium">DNI:</span>
                                    <span className="text-[14px]">{activeStudent.dni}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Mail size={13} className="text-gray-400" />
                                    <span className="truncate max-w-[150px] sm:max-w-[200px] text-[14px]">{activeStudent.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone size={11} className="text-gray-400" />
                                    <span className="font-medium">Apoderado:</span>
                                    <span className="ml-1">{activeStudent.guardian_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={11} className="text-gray-400" />
                                    <span className="truncate max-w-[120px]">{activeStudent.address || 'Sin dirección'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas compactas - ALINEADAS HORIZONTALMENTE */}
                    <div className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                        <div className="flex items-center justify-center gap-4 sm:gap-6">
                            <div className="text-center">
                            <p className="text-[12px] font-bold text-gray-500 uppercase mb-0.5">NOTA MÁXIMA</p>
                            <p className="text-sm font-bold text-green-600">{maxScore}</p>
                            </div>
                            <div className="text-center">
                            <p className="text-[12px] font-bold text-gray-500 uppercase mb-0.5">APROBADO</p>
                            <p className="text-sm font-bold text-zgroup-blue">{passPercentage}%</p>
                            </div>
                            <div className="text-center">
                            <p className="text-[12px] font-bold text-gray-500 uppercase mb-0.5">CURSOS</p>
                            <p className="text-sm font-bold text-zgroup-dark">{exams.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>

        {/* Contenido Principal */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"> 
            
            {/* Sección de Gráficos */}
            <div className="mb-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-zgroup-dark flex items-center gap-2">
                    <BarChart3 size={20} className="text-zgroup-blue" />
                    <span className="hidden sm:inline">Visualización de Desempeño</span>
                    <span className="sm:hidden">Gráficos</span>
                    </h2>
                    <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveChartIndex(0)}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeChartIndex === 0 ? 'bg-zgroup-blue text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Barras
                    </button>
                    <button 
                        onClick={() => setActiveChartIndex(1)}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeChartIndex === 1 ? 'bg-zgroup-blue text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Tendencia
                    </button>
                    {exams.length >= 3 && (
                        <button 
                        onClick={() => setActiveChartIndex(2)}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${activeChartIndex === 2 ? 'bg-zgroup-blue text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                        Comparación
                        </button>
                    )}
                    </div>
                </div>

                {/* Gráfico de Barras - Mostrar solo el activo */}
                <div className={`rounded-2xl p-4 sm:p-6  ${activeChartIndex !== 0 ? 'hidden' : ''}`}>              
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h3 className="font-bold text-zgroup-dark flex items-center gap-2 text-base sm:text-lg">
                        <BarChart3 size={18} className="text-zgroup-blue" />
                        Rendimiento por Curso
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs sm:text-sm">Aprobado</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-zgroup-red"></div>
                        <span className="text-xs sm:text-sm">Reprobado</span>
                        </div>
                    </div>
                    </div>
                    <div className="h-[250px] sm:h-[300px]">
                    {barChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                            <YAxis domain={[0, 20]} stroke="#6b7280" fontSize={12} />
                            <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelFormatter={(label) => `Curso: ${label}`}
                            />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                            {barChartData.map((entry, index) => (
                                <Cell 
                                key={`cell-${index}`} 
                                fill={entry.score >= 11 ? '#16a34a' : '#dc3545'} 
                                strokeWidth={2}
                                stroke={entry.score >= 11 ? '#15803d' : '#b91c1c'}
                                />
                            ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <BarChart3 size={48} className="mb-3 opacity-30" />
                        <p className="text-sm">No hay datos para mostrar</p>
                        <p className="text-xs mt-1">Agrega notas para ver el gráfico</p>
                        </div>
                    )}
                    </div>
                </div>

                {/* Gráfico de Línea - Mostrar solo el activo */}
                <div className={`rounded-2xl p-4 sm:p-6 ${activeChartIndex !== 1 ? 'hidden' : ''}`}>
                    <h3 className="font-bold text-zgroup-dark flex items-center gap-2 mb-6 text-base sm:text-lg">
                    <LineChart size={18} className="text-zgroup-blue" />
                    Tendencia Académica
                    </h3>
                    <div className="h-[250px] sm:h-[300px]">
                    {lineChartData.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                        <RechartsLine data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="index" stroke="#6b7280" fontSize={12} />
                            <YAxis domain={[0, 20]} stroke="#6b7280" fontSize={12} />
                            <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            }}
                            formatter={(value) => [`${value} puntos`, 'Nota']}
                            labelFormatter={(label) => `Evaluación ${label}`}
                            />
                            <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#1a2c4e" 
                            strokeWidth={3}
                            dot={{ stroke: '#1a2c4e', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </RechartsLine>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <LineChart size={48} className="mb-3 opacity-30" />
                        <p className="text-sm">Se necesitan al menos 2 notas</p>
                        <p className="text-xs mt-1">Para ver la tendencia</p>
                        </div>
                    )}
                    </div>
                </div>

                {/* Gráfico de Radar - Mostrar solo el activo */}
                {exams.length >= 3 && (
                    <div className={`rounded-2xl p-4 sm:p-6 ${activeChartIndex !== 2 ? 'hidden' : ''}`}>
                    <h3 className="font-bold text-zgroup-dark flex items-center gap-2 mb-6 text-base sm:text-lg">
                        <Target size={18} className="text-zgroup-blue" />
                        Análisis Comparativo
                    </h3>
                    <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={11} />
                            <PolarRadiusAxis domain={[0, 20]} stroke="#6b7280" />
                            <Radar
                            name="Notas"
                            dataKey="score"
                            stroke="#1a2c4e"
                            fill="#1a2c4e"
                            fillOpacity={0.4}
                            strokeWidth={2}
                            />
                            <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                            }}
                            />
                            <Legend />
                        </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                )}
            </div>
                

            {/* Grid Principal: Tabla + Formulario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tabla de Notas */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-zgroup-dark flex items-center gap-2">
                        <BookOpen size={20} className="text-zgroup-blue" />
                        Historial Académico
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        {exams.length} {exams.length === 1 ? 'registro' : 'registros'}
                        </span>
                    </div>
                    </div>

                    {exams.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-zgroup-ice rounded-full mb-3">
                        <GraduationCap size={24} className="text-zgroup-blue" />
                        </div>
                        <h3 className="text-gray-700 font-medium mb-1">Sin historial académico</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Agrega la primera evaluación usando el formulario.
                        </p>
                    </div>
                    ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Curso</th>
                            <th className="px-6 py-3 text-center">Nota</th>
                            <th className="px-6 py-3 text-center">Estado</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {exams.map((exam) => (
                            <tr 
                            key={exam.id} 
                            className={`hover:bg-zgroup-ice/20 transition-colors ${editingExamId === exam.id ? 'bg-zgroup-ice' : ''}`}
                            >
                            <td className="px-6 py-3">
                                <div className="font-medium text-zgroup-dark">{exam.subject}</div>
                            </td>
                            <td className="px-6 py-3 text-center">
                                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-base font-bold ${
                                exam.score >= 13 ? 'text-zgroup-blue' :
                                exam.score >= 11 ? 'text-yellow-600' : 
                                'text-zgroup-red'
                                }`}>
                                {exam.score}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${
                                exam.score >= 11 
                                    ? 'text-zgroup-blue' 
                                    : 'text-zgroup-red'
                                }`}>
                                {exam.score >= 11 ? 'Aprobado' : 'Reprobado'}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <div className="flex justify-end gap-1">
                                <button 
                                    onClick={() => handleEditClick(exam)}
                                    className="p-2 text-gray-400 hover:text-zgroup-blue hover:bg-zgroup-ice/50 rounded-lg transition-colors"
                                    title="Editar nota"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button 
                                    onClick={() => confirmDelete(exam.id)}
                                    className="p-2 text-gray-400 hover:text-zgroup-red hover:bg-zgroup-ice/50 rounded-lg transition-colors"
                                    title="Eliminar nota"
                                >
                                    <Trash2 size={14} />
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                        </table>
                    </div>
                    )}
                </div>

                {/* Formulario Sticky */}
                <div className="lg:col-span-1">
                    <div className={`sticky top-28 bg-white rounded-xl shadow border ${editingExamId ? 'border-blue-300' : 'border-gray-200'} transition-colors`}>
                    <div className="p-5">
                        <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${editingExamId ? 'bg-blue-100' : 'bg-zgroup-ice'}`}>
                            {editingExamId ? (
                                <Pencil size={16} className="text-blue-600" />
                            ) : (
                                <Plus size={16} className="text-zgroup-blue" />
                            )}
                            </div>
                            <div>
                            <h3 className="font-bold text-zgroup-dark text-sm">
                                {editingExamId ? 'Editar Nota' : 'Nueva Evaluación'}
                            </h3>
                            </div>
                        </div>
                        </div>

                        {error && (
                        <div className="mb-4 p-2 bg-red-50 text-zgroup-red text-xs rounded border border-red-100 flex gap-1 items-start">
                            <AlertCircle size={12} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                        )}

                        <form onSubmit={handleSaveExam} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nombre del Curso
                            </label>
                            <div className="relative">
                            <BookOpen size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                required
                                minLength={2}
                                placeholder="Ej: Matemáticas"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-zgroup-blue focus:border-zgroup-blue outline-none"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                            Calificación (0-20)
                            </label>
                            <div className="relative">
                            <Calculator size={14} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                required
                                placeholder="00"
                                className="w-full pl-9 pr-10 py-2 text-base font-bold text-center border border-gray-200 rounded-lg focus:ring-1 focus:ring-zgroup-blue focus:border-zgroup-blue outline-none"
                                value={score}
                                onChange={handleScoreChange}
                                maxLength={2}
                            />
                            <div className="absolute right-3 top-2.5 text-xs text-gray-400">
                                pts
                            </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                            <span>Mín: 0</span>
                            <span>Aprob: 11</span>
                            <span>Máx: 20</span>
                            </div>
                        </div>

                        <div className="pt-3">
                            <div className="flex gap-2">
                            {editingExamId && (
                                <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3 py-2 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex-1 text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                                editingExamId 
                                    ? 'bg-blue-600 hover:bg-blue-700' 
                                    : 'bg-zgroup-blue hover:bg-zgroup-dark'
                                }`}
                            >
                                {isLoading ? (
                                <>
                                    <Clock size={12} className="animate-spin" />
                                    <span>Procesando...</span>
                                </>
                                ) : editingExamId ? (
                                'Actualizar Nota'
                                ) : (
                                'Guardar Evaluación'
                                )}
                            </button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </div> 
        
        {/* Modal de Eliminación */}
        {deleteModalOpen && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                tabIndex={-1}
                onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    setDeleteModalOpen(false);
                }
                }}
            >
                {/* Overlay con blur */}
                <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={() => setDeleteModalOpen(false)}
                ></div>

                {/* Modal */}
                <div 
                className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 focus:outline-none"
                tabIndex={0}
                >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-zgroup-red to-red-600"></div>
                
                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <AlertTriangle size={36} className="text-zgroup-red" />
                    </div>
                    <h3 className="text-2xl font-bold text-zgroup-dark mb-3">¿Eliminar permanentemente?</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Esta acción eliminará la calificación del sistema y afectará los cálculos estadísticos. 
                        <span className="block font-bold text-zgroup-red mt-2">Esta operación no se puede deshacer.</span>
                    </p>
                    </div>

                    <div className="flex flex-col gap-3">
                    <button 
                        onClick={executeDelete}
                        className="w-full bg-gradient-to-r from-zgroup-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Sí, Eliminar Definitivamente
                    </button>
                    <button 
                        onClick={() => setDeleteModalOpen(false)}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 rounded-xl transition-colors duration-200 border border-gray-200"
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
                </div>
            </div>
        )}
    </div>
  );
};