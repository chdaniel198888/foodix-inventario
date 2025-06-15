import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Store, Warehouse, Factory, Grid3X3, TrendingUp, Clock, Plus, Sparkles, BarChart3, Users } from 'lucide-react';
import { BODEGAS } from './config';
import ListaProductos from './components/ListaProductos';

// Iconos para cada tipo de bodega
const ICONOS_BODEGA: Record<number, any> = {
  1: Warehouse,
  2: Package,
  3: Factory,
  4: Store,
  5: Store,
  6: Store,
  7: Store,
  8: Store
};

interface VistaPrincipalProps {
  onSelectBodega: (id: number) => void;
}

// Vista principal con diseño moderno
function VistaPrincipal({ onSelectBodega }: VistaPrincipalProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Efectos de fondo animados */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">Sistema Inteligente</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
            Foodix Inventory
          </h1>
          <p className="text-xl text-white/60">Gestión moderna de inventarios</p>
        </div>

        {/* Cards de estadísticas con efecto 3D */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
          <div className="group relative transform transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-75"></div>
            <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <BarChart3 className="w-12 h-12 text-white/80 mb-4" />
              <h3 className="text-white/80 text-sm font-medium mb-2">Total Productos</h3>
              <p className="text-4xl font-bold text-white">1,247</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">+12% este mes</span>
              </div>
            </div>
          </div>

          <div className="group relative transform transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <TrendingUp className="w-12 h-12 text-white/80 mb-4" />
              <h3 className="text-white/80 text-sm font-medium mb-2">Inventarios Hoy</h3>
              <p className="text-4xl font-bold text-white">3</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">En progreso</span>
              </div>
            </div>
          </div>

          <div className="group relative transform transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-75"></div>
            <div className="relative bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <Users className="w-12 h-12 text-white/80 mb-4" />
              <h3 className="text-white/80 text-sm font-medium mb-2">Usuarios Activos</h3>
              <p className="text-4xl font-bold text-white">8</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">En línea ahora</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de bodegas con efectos modernos */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Selecciona una Bodega</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BODEGAS.map((bodega) => {
              const Icono = ICONOS_BODEGA[bodega.id];
              const isHovered = hoveredCard === bodega.id;
              
              return (
                <button
                  key={bodega.id}
                  onClick={() => onSelectBodega(bodega.id)}
                  onMouseEnter={() => setHoveredCard(bodega.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative transform transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Efecto de brillo de fondo */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl blur-xl transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  {/* Card principal */}
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 overflow-hidden">
                    {/* Efecto de gradiente animado */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icono con efecto 3D */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                        <Icono className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Contenido */}
                    <h3 className="text-white font-semibold text-lg mb-2">{bodega.nombre}</h3>
                    <p className="text-white/60 text-sm mb-4">
                      {bodega.nombre.includes('Chios') || bodega.nombre.includes('Simón') || bodega.nombre.includes('Santo') 
                        ? 'Restaurante' 
                        : 'Almacén'}
                    </p>
                    
                    {/* Indicador de estado */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/40 text-xs">Disponible</span>
                    </div>
                    
                    {/* Efecto de hover en la esquina */}
                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer con efectos */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            Powered by Foodix Technology • {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

interface VistaConteoProps {
  bodegaId: number;
  onBack: () => void;
}

// Vista de conteo
function VistaConteo({ bodegaId, onBack }: VistaConteoProps) {
  const bodega = BODEGAS.find(b => b.id === bodegaId);
  const Icono = ICONOS_BODEGA[bodegaId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header glassmorphism */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Regresar</span>
          </button>
          
          <h1 className="text-xl font-semibold text-white">{bodega?.nombre}</h1>
          
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
            Guardar
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Card de información */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
              <Icono className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{bodega?.nombre}</h2>
              <p className="text-white/60">Inventario en progreso • ID: INV-2025-{String(bodegaId).padStart(3, '0')}</p>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <ListaProductos bodegaId={bodegaId} />
      </div>
    </div>
  );
}

// Componente principal
export default function App() {
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<number | null>(null);

  return (
    <>
      {!bodegaSeleccionada ? (
        <VistaPrincipal onSelectBodega={setBodegaSeleccionada} />
      ) : (
        <VistaConteo 
          bodegaId={bodegaSeleccionada} 
          onBack={() => setBodegaSeleccionada(null)} 
        />
      )}
    </>
  );
}