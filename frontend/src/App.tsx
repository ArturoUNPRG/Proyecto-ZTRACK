import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { NotasAlumnos } from './pages/NotasAlumnos';
import { DashboardAlumnos } from './pages/DashboardAlumnos';
import logoZGroup from './assets/logo_zgroup.png';
import { useAppStore } from './store/useAppStore';
import { Search, Settings, BookOpen, GraduationCap, ChevronDown } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { setSearchTerm, searchTerm } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú cuando cambia la ruta (versión corregida)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };
    handleRouteChange();
  }, [location.pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term && location.pathname !== '/students') {
      navigate('/students');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-zgroup-blue text-white shadow-lg border-b border-zgroup-ice/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            <div 
              className="flex items-center gap-4 cursor-pointer min-w-fit" 
              onClick={() => {
                setSearchTerm('');
                navigate('/students');
              }}
            >
              <img 
                src={logoZGroup} 
                alt="ZGROUP Logo" 
                className="h-12 w-auto" 
              />
              <div className="hidden md:flex flex-col border-l border-white/20 pl-4">
                <span className="font-bold text-lg tracking-wide leading-none">ZTRACK</span>
                <span className="text-[10px] text-zgroup-ice uppercase tracking-widest mt-1">Sistema Académico</span>
              </div>
            </div>

            <div className="flex-1 max-w-lg relative group hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-zgroup-blue transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white focus:text-zgroup-dark focus:placeholder-gray-500 sm:text-sm transition-all duration-300"
                placeholder="Buscar por DNI o nombre..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors focus:outline-none"
              >
                <Settings size={20} />
                <span className="hidden md:block font-medium text-sm">Configuración</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 text-gray-800 animate-in fade-in slide-in-from-top-2 border border-gray-100 z-9999">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mantenimiento</p>
                  </div>
                  
                  <button 
                    onClick={() => { setIsMenuOpen(false); alert("Posible mejora: Gestión de Aulas"); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="bg-zgroup-ice p-2 rounded-lg text-zgroup-blue">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Gestionar Aulas</p>
                      <p className="text-xs text-gray-500">Grados y Secciones</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setIsMenuOpen(false); alert("Posible mejora: Gestión de Cursos"); }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Gestionar Cursos</p>
                      <p className="text-xs text-gray-500">Materias y Mallas</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full flex flex-col pt-4">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 text-center">
          <p className="text-zgroup-blue font-semibold text-sm">© 2026 ZGROUP</p>
          <p className="text-gray-400 text-xs mt-1">Desarrollado por Arturo Becerra</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<DashboardAlumnos />} />
        <Route path="/exams/:id" element={<NotasAlumnos />} />
      </Routes>
    </Layout>
  );
}
  
export default App;