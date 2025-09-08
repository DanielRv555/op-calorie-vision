import React, { useState } from 'react';
import type { HistoryEntry, GoalData, NutritionData, User } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { FireIcon } from './icons/TargetIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';
import ConfirmationDialog from './ConfirmationDialog';
import ReportGeneratorDialog from './ReportGeneratorDialog';

interface HistoryViewProps {
  history: HistoryEntry[];
  goals: GoalData | null;
  user: User | null;
  onSelect: (entry: HistoryEntry) => void;
  onBack: () => void;
  onSetGoals: () => void;
  onDelete: (id: number) => void;
}

const GoalProgress: React.FC<{ label: string, unit: string, current: number, goal: number | undefined }> = ({ label, unit, current, goal }) => {
    if (goal === undefined || goal <= 0) return null;
    
    const percentage = Math.min((current / goal) * 100, 150);
    let barColor = 'bg-teal-500';
    if (percentage >= 90 && percentage <= 110) {
        barColor = 'bg-green-500';
    } else if (percentage > 110) {
        barColor = 'bg-red-500';
    }

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">
                    <span className="font-bold text-gray-800">{Math.round(current)}</span> / {goal} {unit}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
            </div>
        </div>
    );
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, goals, user, onSelect, onBack, onSetGoals, onDelete }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const today = new Date().toDateString();
  const todaysConsumption: NutritionData = history
    .filter(entry => new Date(entry.date).toDateString() === today)
    .reduce((total, entry) => ({
      calories: total.calories + entry.nutritionInfo.calories,
      protein: total.protein + entry.nutritionInfo.protein,
      carbs: total.carbs + entry.nutritionInfo.carbs,
      fat: total.fat + entry.nutritionInfo.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
  const requestDelete = (id: number) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete !== null) {
      onDelete(itemToDelete);
    }
    setIsConfirmOpen(false);
    setItemToDelete(null);
  };


  return (
    <>
      <div className="w-full animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Resumen e Historial</h2>
          </div>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center text-sm bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-lg transition border"
            aria-label="Generar informe nutricional"
            >
             <DocumentArrowDownIcon className="w-5 h-5 mr-1.5"/>
             Informe
          </button>
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Progreso de Hoy</h3>
          {goals ? (
            <div className="space-y-4">
              <GoalProgress label="Calorías" unit="kcal" current={todaysConsumption.calories} goal={goals.calories} />
              <GoalProgress label="Proteína" unit="g" current={todaysConsumption.protein} goal={goals.protein} />
              <GoalProgress label="Carbohidratos" unit="g" current={todaysConsumption.carbs} goal={goals.carbs} />
              <GoalProgress label="Grasa" unit="g" current={todaysConsumption.fat} goal={goals.fat} />
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No has establecido tus objetivos diarios.</p>
              <button
                onClick={onSetGoals}
                className="mt-3 inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <FireIcon className="w-5 h-5 mr-2" />
                Establecer Objetivos
              </button>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
              <p className="text-gray-500">Tu historial de comidas está vacío.</p>
              <p className="text-gray-500 text-sm">¡Analiza una comida para empezar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Comidas Registradas</h3>
            {history.map((entry) => (
              <div
                key={entry.id}
                className="w-full flex items-center space-x-2 rounded-lg hover:bg-gray-100 bg-white border p-2 transition-colors group"
              >
                <button
                  onClick={() => onSelect(entry)}
                  className="flex-grow flex items-center space-x-4 text-left p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  aria-label={`Ver detalles de la comida del ${new Date(entry.date).toLocaleString()}`}
                >
                  <img src={entry.imageDataUrl} alt="Comida Anterior" className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-gray-700">{new Date(entry.date).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{entry.identifiedFoods.join(', ') || 'Info Nutricional'}</p>
                  </div>
                  <div className="text-right flex-shrink-0 pr-2">
                    <p className="text-lg font-bold text-teal-600">{Math.round(entry.nutritionInfo.calories)}</p>
                    <p className="text-xs text-gray-400">kcal</p>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                      e.stopPropagation();
                      requestDelete(entry.id);
                  }}
                  aria-label="Eliminar entrada del historial"
                  className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
      >
          ¿Estás seguro de que quieres eliminar permanentemente esta entrada del historial? Esta acción no se puede deshacer.
      </ConfirmationDialog>

      <ReportGeneratorDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        history={history}
        user={user}
      />
    </>
  );
};

export default HistoryView;