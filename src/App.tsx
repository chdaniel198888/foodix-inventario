import { useState } from 'react';
import { BODEGAS } from './config';
import ListaProductos from './components/ListaProductos';

export default function App() {
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900">
      {/* Prueba de estilos básicos */}
      <div className="p-8">
        <h1 className="text-6xl font-bold text-white mb-8">
          Sistema Foodix
        </h1>
        
        {/* Card de prueba con gradiente */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-3xl shadow-2xl mb-8">
          <p className="text-white text-2xl">
            Si ves este texto blanco sobre un fondo con gradiente azul-púrpura, 
            entonces Tailwind está funcionando correctamente.
          </p>
        </div>
        
        {/* Grid de bodegas */}
        <div className="grid grid-cols-2 gap-4">
          {BODEGAS.map((bodega) => (
            <button
              key={bodega.id}
              onClick={() => setBodegaSeleccionada(bodega.id)}
              className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl text-white hover:bg-white/30 transition-all"
            >
              <h3 className="text-xl font-bold">{bodega.nombre}</h3>
            </button>
          ))}
        </div>
      </div>
      
      {bodegaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Bodega seleccionada: {bodegaSeleccionada}
            </h2>
            <button 
              onClick={() => setBodegaSeleccionada(null)}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}