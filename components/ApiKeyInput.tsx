import React, { useState } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="w-full max-w-md">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 animate-fade-in-up">
            <div className="text-center mb-6">
                <CameraIcon className="w-12 h-12 text-teal-500 mx-auto" />
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight mt-2">
                    Calorie Vision
                </h1>
                <p className="text-gray-500 mt-2">Se necesita una clave de API de Gemini</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                        Tu Clave de API de Gemini
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                             <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="api-key"
                            name="api-key"
                            type="password"
                            required
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Ingresa tu clave aquí"
                            className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border">
                    Tu clave de API se almacena únicamente en tu navegador y no se comparte. 
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-teal-600 hover:underline ml-1"
                    >
                        Obtén tu clave aquí.
                    </a>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                        disabled={!apiKey.trim()}
                    >
                        Guardar y Continuar
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ApiKeyInput;
