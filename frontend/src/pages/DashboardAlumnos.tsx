import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  UserPlus, X, Loader2, AlertCircle, Trash2, 
  MapPin, Phone, User, Camera, Mail, Hash, Pencil, 
  AlertTriangle, ChevronLeft, ChevronRight, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Student } from '../types';

export const DashboardAlumnos = () => {
  const navigate = useNavigate();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { 
    students, 
    fetchStudents, 
    addStudent, 
    updateStudent,
    deleteStudent, 
    isLoading, 
    error,
    searchTerm    
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: string, name: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    dni: '', name: '', email: '', age: '', gender: 'M', 
    classroom: '', address: '', guardian_name: '', guardian_phone: '', photo_url: ''
  });

  // --- LÓGICA DE PAGINACIÓN RESPONSIVA ---
  const [itemsPerPage, setItemsPerPage] = useState(7); // Default inicial
  const [currentPage, setCurrentPage] = useState(1);
  const [prevSearch, setPrevSearch] = useState(searchTerm);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      dni: '', name: '', email: '', age: '', gender: 'M', classroom: '', 
      address: '', guardian_name: '', guardian_phone: '', photo_url: '' 
    });
  };

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // CÁLCULO DE FILAS VISIBLES
  useLayoutEffect(() => {
    const calculateRows = () => {
      if (tableContainerRef.current) {
        const containerHeight = tableContainerRef.current.offsetHeight;
        const contentHeight = containerHeight - 105; 
        const rowHeight = 73; // Altura exacta de tu fila
        const possibleRows = Math.floor(contentHeight / rowHeight);
        setItemsPerPage(Math.max(4, possibleRows)); // Mínimo 4 filas para no romper
      }
    };

    calculateRows();
    const observer = new ResizeObserver(() => calculateRows());
    if (tableContainerRef.current) observer.observe(tableContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          setIsModalOpen(false);
          resetForm();
        } else if (deleteModalOpen) {
          setDeleteModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, deleteModalOpen]);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.dni.includes(searchTerm)
  );

  if (searchTerm !== prevSearch) {
    setPrevSearch(searchTerm);
    setCurrentPage(1);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({ ...student, age: student.age.toString(), address: student.address || '', guardian_name: student.guardian_name || '', guardian_phone: student.guardian_phone || '', photo_url: student.photo_url || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dni.length !== 8) { alert("El DNI debe tener exactamente 8 dígitos."); return; }
    const payload = { ...formData, age: parseInt(formData.age), gender: formData.gender as 'M'|'F'|'Otro' };
    const success = editingId ? await updateStudent(editingId, payload) : await addStudent(payload);
    if (success) { setIsModalOpen(false); resetForm(); }
  };
  
  const openCreateModal = () => { resetForm(); setIsModalOpen(true); };
  const confirmDelete = (id: string, name: string) => { setStudentToDelete({ id, name }); setDeleteModalOpen(true); };
  const executeDelete = async () => { if (studentToDelete) { await deleteStudent(studentToDelete.id); setDeleteModalOpen(false); setStudentToDelete(null); } };
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, maxLength: number) => { const val = e.target.value.replace(/\D/g, ''); if (val.length <= maxLength) setFormData({ ...formData, [field]: val }); };
  const handlePhotoClick = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { if (file.size > 5 * 1024 * 1024) { alert("La imagen es muy pesada. Máximo 2MB."); return; } const reader = new FileReader(); reader.onloadend = () => { setFormData({ ...formData, photo_url: reader.result as string }); }; reader.readAsDataURL(file); }
  };
  const getInitials = (name: string) => { return name ? name.substring(0, 2).toUpperCase() : 'NN'; };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-zgroup-blue">Directorio de Alumnos</h1>
          <p className="text-gray-700 mt-1">Gestión de matrículas y apoderados</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-zgroup-blue hover:bg-zgroup-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg">
          <UserPlus size={20} /> Matricular Alumno
        </button>
      </div>

      {error && (<div className="bg-red-50 text-zgroup-red p-4 rounded-lg flex items-center gap-2 border border-red-200 shrink-0"><AlertCircle size={20} /> {error}</div>)}
      
      {/* TABLA PRINCIPAL (Se expande con flex-grow) */}
      <div ref={tableContainerRef} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-grow transition-all duration-300">
        
        {isLoading && students.length === 0 ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-zgroup-blue animate-spin" /></div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 text-gray-700">No hay alumnos registrados.</div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 bg-gray-50">ID Sistema</th>
                    <th className="px-6 py-4 bg-gray-50">Alumno</th>
                    <th className="px-6 py-4 bg-gray-50">DNI</th>
                    <th className="px-6 py-4 bg-gray-50">Edad</th>
                    <th className="px-6 py-4 bg-gray-50">Aula</th>
                    <th className="px-6 py-4 bg-gray-50">Correo</th>
                    <th className="px-6 py-4 bg-gray-50">Apoderado</th>
                    <th className="px-6 py-4 text-right bg-gray-50">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors h-[73px]">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                            {(((currentPage - 1) * itemsPerPage) + index + 1).toString().padStart(4, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zgroup-ice flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm shrink-0">
                            {student.photo_url ? (<img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />) : (<span className="text-zgroup-blue font-bold text-sm">{getInitials(student.name)}</span>)}
                          </div>
                          <div><p className="text-sm mt-1 font-medium">{student.name}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600"><span className="text-sm mt-1">{student.dni}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600"><span className="text-sm mt-1">{student.age} años</span></td>
                      <td className="px-6 py-4"><span className="text-sm mt-1">{student.classroom}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600"><span className="text-sm mt-1">{student.email}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.guardian_name ? (<div className="flex flex-col"><span className="font-medium">{student.guardian_name}</span><span className="text-md flex items-center gap-1 text-gray-400 mt-0.5"><Phone size={10} /> {student.guardian_phone}</span></div>) : (<span className="text-gray-300 italic text-md">No registrado</span>)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/exams/${student.id}`)} className="p-2 text-zgroup-blue hover:bg-zgroup-ice rounded-lg transition-colors" title="Ver Dashboard y Gráficos"><BarChart3 size={18} /></button>
                          <button onClick={() => handleEdit(student)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Editar"><Pencil size={18} /></button>
                          <button onClick={() => confirmDelete(student.id, student.name)} className="p-2 text-zgroup-red hover:bg-red-50 rounded-lg transition-colors" title="Eliminar"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {/* FILAS FANTASMA (Para que la tabla no se encoja) */}
                  {currentStudents.length < itemsPerPage && Array.from({ length: itemsPerPage - currentStudents.length }).map((_, index) => (
                    <tr key={`empty-${index}`} className="h-[73px]"><td colSpan={8} className="px-6 py-4">&nbsp;</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto">
                {filteredStudents.length > 0 && (
                  <>
                    <span className="text-sm text-gray-500">Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredStudents.length)} de {filteredStudents.length} alumnos</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"><ChevronLeft size={18} /></button>
                      <div className="hidden sm:flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (<button key={i + 1} onClick={() => paginate(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-zgroup-blue text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>))}
                      </div>
                      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"><ChevronRight size={18} /></button>
                    </div>
                  </>
                )}
            </div>
          </>
        )}
      </div>

      {/* MODAL CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-zgroup-blue">{editingId ? 'Editar Alumno' : 'Ficha de Matrícula'}</h2>
                <p className="text-sm text-gray-700">{editingId ? 'Modifique los datos necesarios' : 'Complete los datos del nuevo alumno'}</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-2 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"><X size={24} /></button>
            </div>
            {error && (<div className="mx-8 mt-6 mb-2 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"><AlertCircle size={20} /><span className="text-sm font-medium">{error}</span></div>)}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <form id="student-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center space-y-3">
                        <div className="w-32 h-32 rounded-full bg-zgroup-ice flex items-center justify-center text-4xl font-bold text-zgroup-blue border-4 border-white shadow-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" onClick={handlePhotoClick}>
                            {formData.photo_url ? (<img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />) : (getInitials(formData.name))}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <button type="button" onClick={handlePhotoClick} className="text-sm text-zgroup-blue font-bold flex items-center gap-2 hover:underline"><Camera size={16} /> {formData.photo_url ? 'Cambiar Foto' : 'Subir Foto'}</button>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2"><label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1 mb-1"><User size={12} /> Apellidos y Nombres *</label><input type="text" required minLength={5} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ej: Becerra Abad Arturo" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none" /></div>
                        <div><label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1 mb-1"><Hash size={12} /> DNI (8 dígitos) *</label><input type="text" required value={formData.dni} onChange={(e) => handleNumberInput(e, 'dni', 8)} placeholder="00000000" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none font-mono tracking-wide" /></div>
                        <div><label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1 mb-1"><Mail size={12} /> Correo *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="alumno@zgroup.com" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Edad *</label><input type="text" required value={formData.age} onChange={(e) => handleNumberInput(e, 'age', 2)} placeholder="00" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none text-center" /></div>
                            <div><label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Género *</label><select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none bg-white" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} ><option value="M">Masc.</option><option value="F">Fem.</option><option value="Otro">Otro</option></select></div>
                        </div>
                        <div><label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Aula Asignada *</label><input type="text" required value={formData.classroom} onChange={(e) => setFormData({...formData, classroom: e.target.value})} placeholder="Ej: 5to B" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none" /></div>
                    </div>
                </div>
                <hr className="border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-3"><h3 className="text-sm font-bold text-zgroup-blue uppercase mb-3 flex items-center gap-2"><MapPin size={16} /> Domicilio</h3><input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Dirección completa" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none bg-white" /></div>
                    <div className="p-3"><h3 className="text-sm font-bold text-zgroup-blue uppercase mb-3 flex items-center gap-2"><Phone size={16} /> Contacto Apoderado</h3><div className="space-y-3"><input type="text" value={formData.guardian_name} onChange={(e) => setFormData({...formData, guardian_name: e.target.value})} placeholder="Nombre del Tutor" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none bg-white" /><input type="tel" value={formData.guardian_phone} onChange={(e) => handleNumberInput(e, 'guardian_phone', 9)} placeholder="Teléfono" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-zgroup-blue outline-none bg-white" /></div></div>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
              <button form="student-form" disabled={isLoading} type="submit" className={`px-8 py-2.5 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all flex items-center gap-2 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-zgroup-blue hover:bg-zgroup-dark'}`}>{isLoading ? (<Loader2 size={18} className="animate-spin" />) : (editingId ? <Pencil size={18} /> : <UserPlus size={18} />)}{isLoading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Registrar')}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
           <div className="fixed inset-0 bg-zgroup-red/60 backdrop-blur-sm transition-opacity" onClick={() => setDeleteModalOpen(false)}></div>
           <div className="relative bg-white w-full md:w-[400px] md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 p-6 flex flex-col gap-4 ring-4 ring-zgroup-red/20">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 md:hidden"></div>
              <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-zgroup-red/10 rounded-full flex items-center justify-center mb-4 animate-bounce"><AlertTriangle size={28} className="text-zgroup-red" /></div>
                  <h3 className="text-xl font-bold text-zgroup-dark">¿Eliminar alumno?</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">Estás a punto de borrar a <span className="font-bold text-zgroup-dark">{studentToDelete?.name}</span>.<br/><span className="font-bold text-zgroup-red">Se eliminará su historial y notas.</span></p>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                  <button onClick={executeDelete} className="w-full bg-zgroup-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-200 hover:shadow-red-300 transform active:scale-95">Sí, Eliminar Alumno</button>
                  <button onClick={() => setDeleteModalOpen(false)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl transition-colors border border-gray-200">Cancelar</button>
              </div>
           </div>
        </div>
      )}
      
    </div>
  );
};