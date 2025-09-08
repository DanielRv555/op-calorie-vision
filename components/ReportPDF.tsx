import React from 'react';
import type { HistoryEntry, NutritionData, User } from '../types';
import { CameraIcon } from './icons/CameraIcon';

interface ReportPDFProps {
  entries: HistoryEntry[];
  user: User | null;
  timeframe: 'daily' | 'weekly' | 'monthly';
}

const ReportPDF: React.FC<ReportPDFProps> = ({ entries, user, timeframe }) => {
  const timeframeText = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual'
  };

  const totals: NutritionData = entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.nutritionInfo.calories,
    protein: acc.protein + entry.nutritionInfo.protein,
    carbs: acc.carbs + entry.nutritionInfo.carbs,
    fat: acc.fat + entry.nutritionInfo.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const uniqueDays = new Set(entries.map(e => new Date(e.date).toDateString())).size;
  const average = uniqueDays > 0 ? {
    calories: totals.calories / uniqueDays,
    protein: totals.protein / uniqueDays,
    carbs: totals.carbs / uniqueDays,
    fat: totals.fat / uniqueDays,
  } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const dateRange = () => {
    if (!entries.length) return "";
    const dates = entries.map(e => new Date(e.date));
    const firstDate = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
    const lastDate = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
    return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
  };

  return (
    <div id="pdf-content" className="p-10 bg-white" style={{ width: '800px', fontFamily: 'Inter, sans-serif' }}>
      <header className="flex justify-between items-center pb-4 border-b-2 border-gray-200">
        <div className="flex items-center space-x-3">
          <CameraIcon className="w-10 h-10 text-teal-500" />
          <h1 className="text-4xl font-bold text-gray-800">Calorie Vision</h1>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-semibold text-gray-700">Informe Nutricional {timeframeText[timeframe]}</h2>
          <p className="text-gray-500">{dateRange()}</p>
        </div>
      </header>
      
      <section className="my-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen Promedio Diario</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-teal-50 p-4 rounded-lg">
                <p className="text-sm text-teal-700 font-medium">Calorías</p>
                <p className="text-2xl font-bold text-teal-800">{Math.round(average.calories)} <span className="text-base font-normal">kcal</span></p>
            </div>
            <div className="bg-sky-50 p-4 rounded-lg">
                <p className="text-sm text-sky-700 font-medium">Proteína</p>
                <p className="text-2xl font-bold text-sky-800">{Math.round(average.protein)}<span className="text-base font-normal">g</span></p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-700 font-medium">Carbohidratos</p>
                <p className="text-2xl font-bold text-orange-800">{Math.round(average.carbs)}<span className="text-base font-normal">g</span></p>
            </div>
            <div className="bg-violet-50 p-4 rounded-lg">
                <p className="text-sm text-violet-700 font-medium">Grasa</p>
                <p className="text-2xl font-bold text-violet-800">{Math.round(average.fat)}<span className="text-base font-normal">g</span></p>
            </div>
        </div>
        <div className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg">
            <strong>Usuario:</strong> {user?.usuario || 'N/A'} | <strong>Total de Comidas Registradas:</strong> {entries.length} | <strong>Días con Registros:</strong> {uniqueDays}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pt-4 border-t border-gray-200">Registro de Comidas</h3>
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 border border-gray-200 rounded-lg flex items-start space-x-4">
              <img src={entry.imageDataUrl} alt="Comida" className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow">
                <p className="font-semibold text-gray-700">
                  {new Date(entry.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Alimentos:</strong> {entry.identifiedFoods.join(', ') || 'N/A'}
                </p>
                <div className="mt-2 flex space-x-4 text-sm">
                  <span className="font-medium text-teal-700">Cal: {Math.round(entry.nutritionInfo.calories)}</span>
                  <span className="font-medium text-sky-700">P: {Math.round(entry.nutritionInfo.protein)}g</span>
                  <span className="font-medium text-orange-700">C: {Math.round(entry.nutritionInfo.carbs)}g</span>
                  <span className="font-medium text-violet-700">G: {Math.round(entry.nutritionInfo.fat)}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
        Informe generado por Calorie Vision &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default ReportPDF;
