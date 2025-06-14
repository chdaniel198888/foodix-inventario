import { useState, useEffect } from 'react';
import { Package, ChevronRight, Grid3X3, Warehouse, Factory, Store, Calendar, Clock, User } from 'lucide-react';
import { BODEGAS } from './config';
import ListaProductos from './components/ListaProductos';

// Iconos para cada tipo de bodega
const ICONOS_BODEGA: Record<number, any> = {
  1: Warehouse,  // Principal
  2: Package,    // Materia Prima
  3: Factory,    // Planta Producción
  4: Store,      // Chios Real Audiencia
  5: Store,      // Chios Floreana
  6: Store,      // Chios Portugal
  7: Store,      // Simón Bolón
  8: Store       // Santo Cachón
};

function App() {
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<number | null>(null);
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const bodegaActual = BODEGAS.find(b => b.id === bodegaSeleccionada);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Profesional */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Sistema de Inventario - {bodegaActual ? bodegaActual.nombre : 'Foodix'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Operario: Usuario Sistema
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {horaActual.toLocaleDateString('es-EC', { 
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-lg font-medium text-gray-900">
                  {horaActual.toLocaleTimeString('es-EC', { 
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
              
              {bodegaSeleccionada && (
                <button
                  onClick={() => setBodegaSeleccionada(null)}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg 
                           font-medium transition-colors duration-200"
                >
                  Cambiar Bodega
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {!bodegaSeleccionada ? (
          /* Selección de bodega estilo profesional */
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Selección de Bodega
              </h2>
              <p className="text-gray-500 mb-8">
                Seleccione la bodega donde realizará el conteo de inventario
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BODEGAS.map(bodega => {
                  const IconoBodega = ICONOS_BODEGA[bodega.id];
                  const esRestaurante = bodega.nombre.includes('Chios') || 
                                      bodega.nombre.includes('Simón') || 
                                      bodega.nombre.includes('Santo');
                  
                  return (
                    <button
                      key={bodega.id}
                      onClick={() => setBodegaSeleccionada(bodega.id)}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-6 
                               text-left transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center 
                                      shadow-sm border border-gray-200">
                          <IconoBodega className="w-6 h-6 text-gray-600" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 
                                               transition-colors mt-1" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {bodega.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {esRestaurante ? 'Restaurante' : 'Almacén'}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">Disponible</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel de información */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium text-gray-700">Último Inventario</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-900">Hace 7 días</p>
                <p className="text-sm text-gray-500 mt-1">07/06/2025</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Grid3X3 className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium text-gray-700">Total Productos</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-900">1,247</p>
                <p className="text-sm text-gray-500 mt-1">En todas las bodegas</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium text-gray-700">Inventarios Hoy</h3>
                </div>
                <p className="text-2xl font-semibold text-gray-900">3</p>
                <p className="text-sm text-gray-500 mt-1">Completados</p>
              </div>
            </div>
          </div>
        ) : (
          /* Vista de conteo profesional */
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Registro de Inventario
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Bodega: {bodegaActual?.nombre}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">ID Inventario:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        INV-{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}{String(new Date().getDate()).padStart(2, '0')}-{String(bodegaSeleccionada).padStart(3, '0')}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">En proceso</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <ListaProductos bodegaId={bodegaSeleccionada} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;