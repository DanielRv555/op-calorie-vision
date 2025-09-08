import React, { useState } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { KeyIcon } from './icons/KeyIcon';

interface SettingsViewProps {
  onUpdateApiKey: (newKey: string) => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onUpdateApiKey, onBack }) => {
  const [newApiKey, setNewApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newApiKey.trim()) {
      onUpdateApiKey(newApiKey.trim());
    }
  };

  return (
    <div className="w-full animate-fade-in max-w-lg mx-auto">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2" aria-label="Volver">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Configuración</h2>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                        Actualizar Clave de API de Gemini
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
                            value={newApiKey}
                            onChange={(e) => setNewApiKey(e.target.value)}
                            placeholder="Ingresa tu nueva clave aquí"
                            className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border">
                    Tu clave de API se almacena únicamente en tu navegador. Al actualizarla, la nueva clave reemplazará a la anterior.
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-teal-600 hover:underline ml-1"
                    >
                        Obtén tu clave aquí.
                    </a>
                </div>
                
                <button
                    type="submit"
                    disabled={!newApiKey.trim()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                >
                    Guardar Nueva Clave
                </button>
            </form>
        </div>
    </div>
  );
};

export default SettingsView;
