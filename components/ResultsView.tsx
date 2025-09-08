import React from 'react';
import type { NutritionData } from '../types';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';


interface ResultsViewProps {
  imageUrl: string;
  nutritionInfo: NutritionData;
  identifiedFoods: string[];
  onReset: () => void;
  isHistoryView?: boolean;
  mealDescription?: string;
}

const MacroPill: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div className={`flex-1 p-3 rounded-lg text-center ${color}`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-xl font-bold">{Math.round(value)}<span className="text-sm font-normal">{unit}</span></p>
    </div>
);

const ResultsView: React.FC<ResultsViewProps> = ({ imageUrl, nutritionInfo, identifiedFoods, onReset, isHistoryView = false, mealDescription }) => {
  return (
    <div className="w-full animate-fade-in max-w-2xl mx-auto space-y-6">
      <img src={imageUrl} alt="Comida Analizada" className="rounded-lg w-full h-auto max-h-96 object-cover" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700">Estimación Nutricional</h2>
        <p className="text-5xl font-bold text-teal-600 my-2">{Math.round(nutritionInfo.calories)}</p>
        <p className="text-gray-500">Calorías Totales (kcal)</p>
      </div>

      <div className="flex gap-2 sm:gap-4 text-white">
        <MacroPill label="Proteína" value={nutritionInfo.protein} unit="g" color="bg-sky-500" />
        <MacroPill label="Carbohidratos" value={nutritionInfo.carbs} unit="g" color="bg-orange-500" />
        <MacroPill label="Grasa" value={nutritionInfo.fat} unit="g" color="bg-violet-500" />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Análisis Basado En:</h3>
        {identifiedFoods.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
          {identifiedFoods.map((food, index) => (
            <li key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {food}
            </li>
          ))}
        </ul>
        ) : <p className="text-gray-500 text-sm">No se identificaron alimentos específicos para esta entrada.</p>}
      </div>

      {mealDescription && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Tu Descripción:</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">{mealDescription}</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
      >
        {isHistoryView ? (
          <>
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Volver al Historial
          </>
        ) : (
          <>
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Analizar Otra Comida
          </>
        )}
      </button>
    </div>
  );
};

export default ResultsView;