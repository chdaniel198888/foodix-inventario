import { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronRight, Check } from 'lucide-react';
import { AIRTABLE_CONFIG, BODEGAS } from '../config';

interface Producto {
  id: string;
  nombre: string;
  unidadMedida: string;
  equivalencia: string;
  categoria?: string;
}

interface ProductoConteoProps {
  producto: Producto;
}

// Mapeo de bodega ID a campos de Airtable
const CAMPOS_BODEGA: Record<number, { conteo: string; unidad: string }> = {
  1: { conteo: 'Conteo Bodega Principal', unidad: 'Unidad Conteo Bodega Principal' },
  2: { conteo: 'Conteo Bodega Materia Prima', unidad: 'Unidad Conteo Bodega Materia Prima' },
  3: { conteo: 'Conteo Planta Producción', unidad: 'Unidad Conteo Planta Producción' },
  4: { conteo: 'Conteo Chios', unidad: 'Unidad Conteo Chios' },
  5: { conteo: 'Conteo Chios', unidad: 'Unidad Conteo Chios' },
  6: { conteo: 'Conteo Chios', unidad: 'Unidad Conteo Chios' },
  7: { conteo: 'Conteo Simón Bolón', unidad: 'Unidad Conteo Simón Bolón' },
  8: { conteo: 'Conteo Santo Cachón', unidad: 'Unidad Conteo Santo Cachón' }
};

function ProductoConteo({ producto }: ProductoConteoProps) {
  const [conteo1, setConteo1] = useState(0);
  const [conteo2, setConteo2] = useState(0);
  const [conteo3, setConteo3] = useState(0);
  const [cantidadPedir, setCantidadPedir] = useState(0);
  const [expandido, setExpandido] = useState(false);
  const [modificado, setModificado] = useState(false);

  const total = conteo1 + conteo2 + conteo3;

  const handleChange = (setter: (val: number) => void, value: string) => {
    setter(parseInt(value) || 0);
    setModificado(true);
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div 
        className="px-4 py-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-base">{producto.nombre}</h3>
          {producto.categoria && (
            <p className="text-sm text-gray-500 mt-0.5">{producto.categoria}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {modificado && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          <div className="text-right">
            <p className="font-semibold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">{producto.unidadMedida}</p>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandido ? 'rotate-90' : ''}`} />
        </div>
      </div>
      
      {expandido && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
          <div className="space-y-4 pt-4">
            {/* Conteos */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Conteo por ubicación
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={conteo1 || ''}
                    onChange={(e) => handleChange(setConteo1, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-center 
                             text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="C1"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={conteo2 || ''}
                    onChange={(e) => handleChange(setConteo2, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-center 
                             text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="C2"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={conteo3 || ''}
                    onChange={(e) => handleChange(setConteo3, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-center 
                             text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="C3"
                  />
                </div>
              </div>
            </div>
            
            {/* Cantidad a pedir */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Cantidad a pedir
              </label>
              <input
                type="number"
                value={cantidadPedir || ''}
                onChange={(e) => handleChange(setCantidadPedir, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-center 
                         text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>
            
            {/* Equivalencia */}
            {producto.equivalencia && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">Equivalencia</p>
                <p className="text-sm text-blue-900 mt-1">{producto.equivalencia}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListaProductos({ bodegaId }: { bodegaId: number }) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('ListaProductos montado, bodegaId:', bodegaId);

  useEffect(() => {
    console.log('useEffect ejecutado, llamando cargarProductos...');
    cargarProductos();
  }, [bodegaId]);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.categoria && p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
      );
      setProductosFiltrados(filtrados);
    }
  }, [busqueda, productos]);

  const cargarProductos = async () => {
    console.log('cargarProductos iniciado');
    try {
      setCargando(true);
      setError(null);
      
      const camposBodega = CAMPOS_BODEGA[bodegaId];
      console.log('Campos bodega:', camposBodega);
      
      if (!camposBodega) {
        throw new Error('Bodega no configurada');
      }
      
      let todosLosRegistros: any[] = [];
      let offset = null;
      let intentoDirecto = true;
      
      do {
        let url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}?view=${AIRTABLE_CONFIG.viewId}&pageSize=100`;
        if (offset) {
          url += `&offset=${offset}`;
        }
        
        console.log(`Cargando página de productos... offset: ${offset || 'inicial'}`);
        
        try {
          let response;
          
          if (intentoDirecto) {
            response = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
              }
            });
          }
          
          if (!intentoDirecto || !response || !response.ok) {
            if (intentoDirecto) {
              console.log('Error directo, intentando con proxy...');
              intentoDirecto = false;
            }
            
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            response = await fetch(proxyUrl, {
              headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
              }
            });
          }
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.records) {
            todosLosRegistros = todosLosRegistros.concat(data.records);
            console.log(`Registros obtenidos en esta página: ${data.records.length}`);
            console.log(`Total acumulado: ${todosLosRegistros.length}`);
          }
          
          offset = data.offset;
          
        } catch (pageError) {
          console.error('Error al cargar página:', pageError);
          if (todosLosRegistros.length === 0) {
            mostrarProductosEjemplo();
            return;
          } else {
            break;
          }
        }
        
      } while (offset);
      
      console.log(`Total de registros obtenidos: ${todosLosRegistros.length}`);
      procesarDatos({ records: todosLosRegistros }, camposBodega);
      
    } catch (err: any) {
      console.error('Error completo:', err);
      mostrarProductosEjemplo();
    }
  };

  const procesarDatos = (data: any, camposBodega: { conteo: string; unidad: string }) => {
    console.log('Procesando datos de Airtable...');
    console.log(`Total de registros a procesar: ${data.records?.length || 0}`);
    console.log(`Filtrando por campo: ${camposBodega.conteo}`);
    
    if (data && data.records) {
      const productosAplicables = data.records.filter((record: any) => {
        const aplicaEnBodega = record.fields[camposBodega.conteo];
        return aplicaEnBodega === 'Sí';
      });
      
      console.log(`Productos que tienen "Sí" en ${camposBodega.conteo}: ${productosAplicables.length}`);
      
      const productosFormateados = productosAplicables.map((record: any) => ({
        id: record.id,
        nombre: record.fields['Nombre Producto'] || 'Sin nombre',
        unidadMedida: record.fields[camposBodega.unidad] || 'UN',
        equivalencia: record.fields['Equivalencias Inventarios'] || '',
        categoria: record.fields['Categoría'] || ''
      }));
      
      console.log(`${productosFormateados.length} productos formateados para esta bodega`);
      setProductos(productosFormateados);
      setProductosFiltrados(productosFormateados);
      
      if (productosFormateados.length === 0) {
        setError('No se encontraron productos que apliquen para esta bodega');
      }
    } else {
      setError('Formato de datos inesperado de Airtable');
    }
    setCargando(false);
  };

  const mostrarProductosEjemplo = () => {
    console.log('Usando datos de ejemplo...');
    const productosEjemplo: Producto[] = [
      { id: '1', nombre: 'Harina', unidadMedida: 'KG', equivalencia: '1 saco = 50kg', categoria: 'Granos' },
      { id: '2', nombre: 'Azúcar', unidadMedida: 'KG', equivalencia: '1 saco = 50kg', categoria: 'Endulzantes' },
      { id: '3', nombre: 'Aceite', unidadMedida: 'LT', equivalencia: '1 bidón = 20lt', categoria: 'Aceites' },
      { id: '4', nombre: 'Sal', unidadMedida: 'KG', equivalencia: '1 saco = 25kg', categoria: 'Condimentos' },
      { id: '5', nombre: 'Leche', unidadMedida: 'LT', equivalencia: '1 caja = 12lt', categoria: 'Lácteos' },
      { id: '6', nombre: 'Jamón', unidadMedida: 'KG', equivalencia: '', categoria: 'Carnes' },
      { id: '7', nombre: 'Queso', unidadMedida: 'KG', equivalencia: '', categoria: 'Lácteos' },
      { id: '8', nombre: 'Pan Hamburguesa', unidadMedida: 'UN', equivalencia: '1 paquete = 8un', categoria: 'Panadería' },
    ];
    
    setProductos(productosEjemplo);
    setProductosFiltrados(productosEjemplo);
    setError('No se pudo conectar con Airtable. Mostrando datos de ejemplo.');
    setCargando(false);
  };

  if (cargando) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-gray-200 rounded-full"></div>
          <div className="w-12 h-12 border-3 border-gray-700 rounded-full animate-spin 
                        border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-gray-600 text-sm">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo con búsqueda */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                       transition-all"
            />
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="px-4 pb-3 flex gap-2">
          <button className="flex-1 py-2 bg-gray-100 rounded-full text-sm font-medium 
                           text-gray-700 flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex-1 py-2 bg-gray-100 rounded-full text-sm font-medium 
                           text-gray-700 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-gray-100 px-4 py-3 text-xs text-gray-600 flex justify-between items-center">
        <div className="flex gap-4">
          <span>Total: <strong className="text-gray-900">{productos.length}</strong></span>
          <span>Mostrando: <strong className="text-gray-900">{productosFiltrados.length}</strong></span>
          <span>Modificados: <strong className="text-green-600">0</strong></span>
        </div>
        <span className="text-gray-500">Actualizado hace 1 min</span>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      {/* Lista de productos estilo móvil */}
      <div className="pb-32">
        {productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center px-8">
              {productos.length === 0 
                ? "No se encontraron productos para esta bodega" 
                : "No hay productos que coincidan con tu búsqueda"}
            </p>
          </div>
        ) : (
          productosFiltrados.map(producto => (
            <ProductoConteo key={producto.id} producto={producto} />
          ))
        )}
      </div>

      {/* Footer fijo con acciones */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-gray-100 rounded-lg text-sm font-medium 
                           text-gray-700 active:bg-gray-200">
            Guardar Borrador
          </button>
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm 
                           font-medium active:bg-blue-700 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Finalizar Conteo
          </button>
        </div>
      </div>
    </div>
  );
}