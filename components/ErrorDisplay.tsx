
import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';


interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg shadow-md w-full text-center animate-fade-in">
      <div className="flex flex-col items-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-red-800">Ocurrió un Error</h3>
        <p className="mt-2 text-sm text-red-700">
          {message}
        </p>
        <button
          onClick={onReset}
          className="mt-6 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Intentar de Nuevo
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
