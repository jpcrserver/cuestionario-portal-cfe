const { useState, useMemo } = React;

function App() {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState({
    areaContratante: 'division',
    areaContratanteOtra: '',
    agenteContratante: '',
    claveAgente: '',
    numeroProcedimiento: '',
    competitionType: '',
    naturalezaContratacion: '',
    objetoContrato: '',
    departamentoDestino: '',
    caracterProcedimiento: '',
    reservaPermanente: '',
    reservaTransitoria: '',
    tratados: [],
    pmcPbd: '',
    tipoEvaluacion: '',
    anticipo: '',
    garantias: [],
    precios: '',
    moneda: 'Pesos Mexicanos',
    formulaAjuste: '',
    adjudicacionPartidas: 'a_un_solo_concursante',
    suministroSimultaneo: false,
    bonoDesempeno: '',
    subastaElectronica: '',
    contratacionPlurianual: '',
    anioInicio: currentYear.toString(),
    anioFinal: '',
    plazoPago: '',
    plazoPagoPersonalizado: '',
    publicacion: '',
    publicacionHora: '',
    sesionAclaraciones: '',
    sesionAclaracionesHora: '',
    muestras: '',
    muestrasHora: '',
    aperturaTecnica: '',
    aperturaTecnicaHora: '',
    aperturaEconomica: '',
    aperturaEconomicaHora: '',
    fallo: '',
    falloHora: '',
    llevaLapem: '',
    lapemOpciones: [],
    incoterms: '',
    criteriosDesempate: '',
    numeroPartidas: '0',
    pbdValues: {},
    numConcursantes: '1',
    porcentajes: {},
    ofertaConjunta: ''
  });

  const [isExporting, setIsExporting] = useState(false);
  const [showFechaAdvertencia, setShowFechaAdvertencia] = useState(false);

  // Opciones estáticas
  const tratadosInternacionales = [
    "Tratado con América del Norte",
    "La República de Chile",
    "el Estado de Israel",
    "los Estados de la Asociación Europea de Libre Comercio",
    "el Acuerdo de Asociación Económica, Concertación Política y Cooperación con la comunidad Europea y sus Estados Miembros",
    "Acuerdo para el Fortalecimiento de la Asociación Económica con Japón",
    "Tratados con la República del Perú, Australia y Singapur"
  ];

  const garantiasOpciones = [
    "De Cumplimiento y Calidad",
    "Anticipo",
    "Del Fabricante",
    "De Sostenimiento de Oferta"
  ];

  const partidasNumeros = Array.from({ length: 1000 }, (_, i) => i + 1);
  const concursantesNumeros = Array.from({ length: 10 }, (_, i) => i + 1);
  const incoterms2020 = [
    "EXW (Ex Works)",
    "FCA (Free Carrier)",
    "CPT (Carriage Paid To)",
    "CIP (Carriage and Insurance Paid To)",
    "DAT (Delivered at Terminal)",
    "DAP (Delivered at Place)",
    "DDP (Delivered Duty Paid)",
    "FAS (Free Alongside Ship)",
    "FOB (Free On Board)",
    "CFR (Cost and Freight)",
    "CIF (Cost, Insurance and Freight)"
  ];
  const horas = Array.from({ length: 12 }, (_, i) => i + 1)
    .flatMap(hora => [
      `${hora}:00 AM`,
      `${hora}:30 AM`,
      `${hora === 12 ? 12 : hora % 12}:00 PM`,
      `${hora === 12 ? 12 : hora % 12}:30 PM`
    ]);

  // Funciones auxiliares
  const shouldShowReservaFields = () => {
    return (
      (formData.competitionType === 'concurso_abierto' && 
       formData.caracterProcedimiento === 'internacional_abierto') ||
      formData.caracterProcedimiento === 'internacional_bajo_cobertura_tratados'
    );
  };

  const shouldShowTratados = () => {
    return formData.caracterProcedimiento === 'internacional_bajo_cobertura_tratados';
  };

  const shouldShowFormulaAjuste = () => {
    return formData.precios === 'Variables';
  };

  const shouldShowPbdTable = () => {
    return formData.pmcPbd === 'PBD' && parseInt(formData.numeroPartidas) > 0;
  };

  const shouldShowSuministroSimultaneo = () => {
    return formData.adjudicacionPartidas === 'a_varios_concursantes';
  };

  const shouldShowPlazoPagoCustom = () => {
    return formData.plazoPago === 'otro';
  };

  const partidasOptions = useMemo(() => {
    const count = parseInt(formData.numeroPartidas) || 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [formData.numeroPartidas]);

  const concursantesOptions = useMemo(() => {
    const count = parseInt(formData.numConcursantes) || 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [formData.numConcursantes]);

  // Validación del formulario
  const validateForm = () => {
    const requiredFields = [
      'areaContratante', 'agenteContratante', 'claveAgente', 'numeroProcedimiento',
      'competitionType', 'naturalezaContratacion', 'objetoContrato', 'departamentoDestino',
      'caracterProcedimiento', 'pmcPbd', 'tipoEvaluacion', 'anticipo', 'garantias',
      'precios', 'moneda', 'ofertaConjunta', 'bonoDesempeno', 'subastaElectronica',
      'contratacionPlurianual', 'plazoPago', 'publicacion', 'sesionAclaraciones',
      'muestras', 'aperturaTecnica', 'aperturaEconomica', 'fallo', 'llevaLapem', 'incoterms'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Por favor, complete el campo: ${field}`);
        return false;
      }
    }

    if (formData.areaContratante === 'otra' && !formData.areaContratanteOtra) {
      alert('Por favor, complete el campo Área Contratante (Otra)');
      return false;
    }

    if (formData.claveAgente.length !== 7) {
      alert('La clave de agente debe tener exactamente 7 caracteres.');
      return false;
    }

    if (formData.numeroProcedimiento.length > 25) {
      alert('El número de procedimiento no debe exceder los 25 caracteres.');
      return false;
    }

    if (shouldShowReservaFields() && (!formData.reservaPermanente || !formData.reservaTransitoria)) {
      alert('Por favor, complete los campos de Reserva Permanente y Transitoria.');
      return false;
    }

    if (shouldShowTratados() && formData.tratados.length === 0) {
      alert('Por favor, seleccione al menos un Tratado Internacional.');
      return false;
    }

    if (formData.anticipo === 'si' && !formData.garantias.includes('Anticipo')) {
      alert('Si selecciona Anticipo "Sí", debe marcar la garantía de Anticipo.');
      return false;
    }

    if (shouldShowPbdTable() && formData.numeroPartidas > 0) {
      const numPartidas = parseInt(formData.numeroPartidas);
      for (let i = 1; i <= numPartidas; i++) {
        if (!formData.pbdValues[i] || isNaN(formData.pbdValues[i])) {
          alert(`Por favor, complete el valor de PBD para la partida ${i}`);
          return false;
        }
      }
    }

    return true;
  };

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === 'areaContratante' && value !== 'otra') {
      setFormData(prev => ({ ...prev, areaContratante: value }));
    } else if (name === 'areaContratanteOtra') {
      setFormData(prev => ({ ...prev, areaContratanteOtra: value }));
    } else if (name === 'suministroSimultaneo') {
      setFormData(prev => ({
        ...prev,
        suministroSimultaneo: checked,
        numConcursantes: checked ? '1' : '0',
        porcentajes: checked ? { '1': '' } : {}
      }));
    } else if (name === 'garantias') {
      setFormData(prev => {
        const newGarantias = type === 'checkbox' && checked 
          ? [...prev.garantias, value]
          : prev.garantias.filter(item => item !== value);
        return { ...prev, garantias: newGarantias };
      });
    } else if (name === 'tratados') {
      setFormData(prev => {
        const newTratados = checked 
          ? [...prev.tratados, value]
          : prev.tratados.filter(item => item !== value);
        return { ...prev, tratados: newTratados };
      });
    } else if (name === 'precios') {
      setFormData(prev => ({
        ...prev,
        precios: value,
        formulaAjuste: value === 'Fijos' ? '' : prev.formulaAjuste
      }));
    } else if (name === 'contratacionPlurianual') {
      setFormData(prev => ({
        ...prev,
        contratacionPlurianual: value,
        anioInicio: value === 'si' ? currentYear.toString() : '',
        anioFinal: value === 'si' ? '' : ''
      }));
    } else if (name === 'anioInicio' || name === 'anioFinal') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === 'plazoPago' && value !== 'otro') {
      setFormData(prev => ({
        ...prev,
        plazoPago: value,
        plazoPagoPersonalizado: ''
      }));
    } else if (name === 'plazoPagoPersonalizado') {
      setFormData(prev => ({ ...prev, plazoPagoPersonalizado: value }));
    } else if (name === 'lapemOpciones') {
      setFormData(prev => {
        const newOpciones = checked 
          ? [...prev.lapemOpciones, value]
          : prev.lapemOpciones.filter(item => item !== value);
        return { ...prev, lapemOpciones: newOpciones };
      });
    } else if (name === 'sesionAclaraciones') {
      setFormData(prev => ({ ...prev, sesionAclaraciones: value }));
      if (value) {
        const fecha = new Date(value);
        const tresDiasDespues = new Date(fecha);
        tresDiasDespues.setDate(fecha.getDate() + 3);
        setShowFechaAdvertencia(true);
      } else {
        setShowFechaAdvertencia(false);
      }
    } else if (name === 'adjudicacionPartidas') {
      const newAdjudicacion = value;
      const newSuministro = newAdjudicacion === 'a_varios_concursantes';
      setFormData(prev => ({
        ...prev,
        adjudicacionPartidas: newAdjudicacion,
        suministroSimultaneo: newSuministro,
        numConcursantes: newSuministro ? '1' : '0',
        porcentajes: newSuministro ? { '1': '' } : {}
      }));
    } else if (name === 'numConcursantes') {
      const newNum = parseInt(value);
      const newPorcentajes = {};
      for (let i = 1; i <= newNum; i++) {
        newPorcentajes[i] = formData.porcentajes[i] || '';
      }
      setFormData(prev => ({ ...prev, numConcursantes: value, porcentajes: newPorcentajes }));
    } else if (name === 'anticipo') {
      setFormData(prev => {
        const newAnticipo = value;
        let newGarantias = [...prev.garantias];
        if (newAnticipo === 'si' && !newGarantias.includes('Anticipo')) {
          newGarantias.push('Anticipo');
        } else if (newAnticipo === 'no') {
          newGarantias = newGarantias.filter(item => item !== 'Anticipo');
        }
        return { ...prev, anticipo: newAnticipo, garantias: newGarantias };
      });
    } else if (name === 'pbdValues') {
      setFormData(prev => ({
        ...prev,
        pbdValues: {
          ...prev.pbdValues,
          [value.name]: value.value
        }
      }));
    } else if (name.startsWith('porcentaje_')) {
      const concursante = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        porcentajes: {
          ...prev.porcentajes,
          [concursante]: value
        }
      }));
    } else if (name === 'caracterProcedimiento') {
      setFormData(prev => ({
        ...prev,
        caracterProcedimiento: value,
        criteriosDesempate: value === 'nacional' 
          ? 'Nacional' 
          : ['internacional_abierto', 'internacional_bajo_cobertura_tratados'].includes(value)
            ? 'Internacional'
            : ''
      }));
    } else if (name === 'ofertaConjunta') {
      setFormData(prev => ({
        ...prev,
        ofertaConjunta: checked ? value : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejo de porcentajes
  const handlePorcentajeChange = (e, concursante) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      porcentajes: {
        ...prev.porcentajes,
        [concursante]: value
      }
    }));
  };

  // Exportar a Excel (simulado)
  const exportToExcel = () => {
    if (!validateForm()) return;
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Datos exportados exitosamente (simulación)');
    }, 1500);
  };

  // Renderizado
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://www.cfe.gob.mx/SiteCollectionImages/logo_cfe.png " 
              alt="CFE Logo"
              className="h-12 w-auto mr-4"
            />
            <h1 className="text-xl md:text-2xl font-bold">
              Portal de Creación de Pliegos de Requisitos
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Características del Concurso</h2>

            {/* Área Contratante */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Área Contratante</label>
              <div className="space-y-3">
                <select
                  name="areaContratante"
                  value={formData.areaContratante}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="division">División de Distribución Jalisco</option>
                  <option value="otra">Otra</option>
                </select>
                {formData.areaContratante === 'otra' && (
                  <input
                    type="text"
                    name="areaContratanteOtra"
                    value={formData.areaContratanteOtra}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ingrese otra área contratante"
                  />
                )}
              </div>
            </div>

            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Agente Contratante</label>
                <input
                  type="text"
                  name="agenteContratante"
                  value={formData.agenteContratante}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Clave de Agente Contratante</label>
                <input
                  type="text"
                  name="claveAgente"
                  value={formData.claveAgente}
                  onChange={handleChange}
                  maxLength={7}
                  placeholder="7 caracteres"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Número de Procedimiento</label>
                <input
                  type="text"
                  name="numeroProcedimiento"
                  value={formData.numeroProcedimiento}
                  onChange={handleChange}
                  maxLength={25}
                  placeholder="Hasta 25 caracteres"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">PMC o PBD</label>
                <select
                  name="pmcPbd"
                  value={formData.pmcPbd}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="PMC">PMC</option>
                  <option value="PBD">PBD</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tipo de Concurso</label>
                <select
                  name="competitionType"
                  value={formData.competitionType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="concurso_abierto">Concurso Abierto</option>
                  <option value="concurso_simplificado">Concurso Simplificado</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Naturaleza de la Contratación</label>
                <select
                  name="naturalezaContratacion"
                  value={formData.naturalezaContratacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="bienes">Bienes</option>
                  <option value="servicios">Servicios</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Objeto del Contrato</label>
                <input
                  type="text"
                  name="objetoContrato"
                  value={formData.objetoContrato}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Título del procedimiento"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Departamento Destino</label>
                <input
                  type="text"
                  name="departamentoDestino"
                  value={formData.departamentoDestino}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Departamento Solicitante"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Carácter del Procedimiento</label>
                <select
                  name="caracterProcedimiento"
                  value={formData.caracterProcedimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="nacional">Nacional</option>
                  {formData.competitionType !== 'concurso_simplificado' && (
                    <option value="internacional_bajo_cobertura_tratados">Internacional Bajo Cobertura de los Tratados</option>
                  )}
                  <option value="internacional_abierto">Internacional Abierto</option>
                </select>
              </div>
            </div>

            {/* Oferta Conjunta - Checkboxes */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Oferta Conjunta</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="ofertaConjunta"
                    value="si"
                    checked={formData.ofertaConjunta === 'si'}
                    onChange={(e) => handleChange({ target: { name: 'ofertaConjunta', checked: e.target.checked, value: 'si', type: 'checkbox' } )}
                    className="mr-2"
                  />
                  <span>Sí</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="ofertaConjunta"
                    value="no"
                    checked={formData.ofertaConjunta === 'no'}
                    onChange={(e) => handleChange({ target: { name: 'ofertaConjunta', checked: e.target.checked, value: 'no', type: 'checkbox' } )}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Resto de campos... (se omite por brevedad) */}
            
            {/* Botón de exportación */}
            <button
              onClick={exportToExcel}
              disabled={isExporting}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                isExporting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                    <path className="opacity-75" d="M4 12a8 8 0 0 1 8 4v-4a12 12 0 0 0-12 12h4z" />
                  </svg>
                  Exportando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 1 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar a Excel
                </>
              )}
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            &copy; {currentYear} Portal de Creación de Pliegos de Requisitos by JPCR -9JJ61
            <br />
            División de Distribución Jalisco - Departamento Divisional de Abastecimientos
          </p>
        </div>
      </footer>
    </div>
  );
}

// Renderizar el componente
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);