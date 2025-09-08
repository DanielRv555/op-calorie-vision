import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';

interface AnalysisViewProps {
  imageDataUrl: string;
  identifiedFoods: string[];
  onIdentify: () => void;
  onAnalyze: () => void;
  isIdentifying: boolean;
  hasIdentified: boolean;
  mealDescription: string;
  onDescriptionChange: (description: string) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ imageDataUrl, identifiedFoods, onIdentify, onAnalyze, isIdentifying, hasIdentified, mealDescription, onDescriptionChange }) => {
  return (
    <div className="w-full animate-fade-in max-w-2xl mx-auto">
      <img src={imageDataUrl} alt="Comida" className="rounded-lg w-full h-auto max-h-96 object-cover mb-4" />
      
      <div className="my-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción Adicional (Opcional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition"
          placeholder="Ej: 'El pollo es a la plancha', 'la ensalada tiene aderezo césar', 'usé 2 cucharadas de aceite de oliva'..."
          value={mealDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">Proporcionar más detalles puede mejorar la precisión del análisis.</p>
      </div>

      {!hasIdentified && (
        <button
          onClick={onIdentify}
          disabled={isIdentifying}
          className="w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          Encontrar Alimentos en la Imagen
        </button>
      )}

      {hasIdentified && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Alimentos Identificados:</h3>
          {identifiedFoods.length > 0 ? (
            <ul className="flex flex-wrap gap-2 mb-4">
              {identifiedFoods.map((food, index) => (
                <li key={index} className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                  {food}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-4">No se pudieron identificar alimentos específicos. Aún puedes intentar analizar la imagen.</p>
          )}

          <button
            onClick={onAnalyze}
            className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            <CalculatorIcon className="w-5 h-5 mr-2" />
            Calcular Nutrición
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;