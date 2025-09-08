import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { HistoryEntry, User } from '../types';
import ReportPDF from './ReportPDF';

interface ReportGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  user: User | null;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';
type Status = 'idle' | 'generating' | 'success';

const ReportGeneratorDialog: React.FC<ReportGeneratorDialogProps> = ({ isOpen, onClose, history, user }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [status, setStatus] = useState<Status>('idle');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (status === 'generating') return;
    setStatus('idle');
    setPdfUrl(null);
    onClose();
  }

  const getFilteredHistory = (): HistoryEntry[] => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return history.filter(entry => {
      const entryDate = new Date(entry.date);
      switch (timeframe) {
        case 'daily':
          return entryDate >= startOfToday;
        case 'weekly':
          return entryDate >= startOfWeek;
        case 'monthly':
          return entryDate >= startOfMonth;
        default:
          return false;
      }
    });
  };

  const generatePdf = async () => {
    const reportElement = document.getElementById('pdf-content');
    if (!reportElement) return;

    setStatus('generating');
    
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      pdf.save(`informe-nutricional-${timeframe}.pdf`); // Auto-download
      setStatus('success');
    } catch (error) {
        console.error("Error generating PDF:", error);
        setStatus('idle');
    }
  };
  
  const filteredHistory = getFilteredHistory();
  const reportDateRange = () => {
      if (!filteredHistory.length) return "N/A";
      const dates = filteredHistory.map(e => new Date(e.date));
      const firstDate = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
      const lastDate = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
      return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-end sm:items-center p-4 animate-fade-in"
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          {status !== 'success' && (
            <>
              <h3 className="text-lg leading-6 font-bold text-gray-900">
                Generar Informe Nutricional
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">
                  Selecciona el período para tu informe. Se incluirán todas las comidas registradas dentro de este rango.
                </p>
                <div className="flex rounded-md shadow-sm" role="group">
                  {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((t, index) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeframe(t)}
                      className={`py-2 px-4 text-sm font-medium ${timeframe === t ? 'bg-teal-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'} border border-gray-200 ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''} focus:z-10 focus:ring-2 focus:ring-teal-500 transition-colors w-full`}
                    >
                      {{daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual'}[t]}
                    </button>
                  ))}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4 text-center">
                  No hay registros en el período seleccionado para generar un informe.
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  El informe incluirá <strong>{filteredHistory.length}</strong> registro(s) del período: <strong>{reportDateRange()}</strong>.
                </p>
              )}
            </>
          )}

          {status === 'success' && (
             <div className="text-center">
                 <h3 className="text-lg font-bold text-gray-900">¡Informe Generado!</h3>
                 <p className="text-sm text-gray-600 mt-2">Tu informe ha sido descargado. También puedes usar estos enlaces.</p>
             </div>
          )}

          <div className="mt-6">
            {status !== 'success' ? (
                <button
                    type="button"
                    disabled={status === 'generating' || filteredHistory.length === 0}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={generatePdf}
                >
                    {status === 'generating' ? 'Generando...' : 'Generar y Descargar PDF'}
                </button>
            ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={pdfUrl ?? '#'}
                      download={`informe-nutricional-${timeframe}.pdf`}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Descargar de Nuevo
                    </a>
                     <a
                      href={`https://wa.me/?text=${encodeURIComponent('¡Hola! Te comparto mi informe nutricional de Calorie Vision. El archivo PDF ya está descargado en mi dispositivo.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Compartir en WhatsApp
                    </a>
                 </div>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              onClick={handleClose}
            >
              {status === 'success' ? 'Cerrar' : 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
      {/* Elemento oculto para renderizar el PDF */}
      <div className="absolute -z-10 -left-[9999px] top-0">
          <div id="pdf-container" ref={pdfRef}>
              <ReportPDF entries={filteredHistory} user={user} timeframe={timeframe}/>
          </div>
      </div>
    </>
  );
};

export default ReportGeneratorDialog;
