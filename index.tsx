import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeAiClient } from './services/geminiService';
import ApiKeyInput from './components/ApiKeyInput';

const Main: React.FC = () => {
  // Intenta obtener la clave desde sessionStorage al iniciar
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('GEMINI_API_KEY'));

  useEffect(() => {
    if (apiKey) {
      try {
        // Inicializa el cliente de IA y guarda la clave en sessionStorage
        initializeAiClient(apiKey);
        sessionStorage.setItem('GEMINI_API_KEY', apiKey);
      } catch (error) {
        console.error("Failed to initialize AI client:", error);
        // Si la clave es inválida, la borramos para que el usuario pueda introducir una nueva
        sessionStorage.removeItem('GEMINI_API_KEY');
        setApiKey(null); 
        alert("La clave de API proporcionada no es válida. Por favor, inténtalo de nuevo.");
      }
    }
  }, [apiKey]);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  // Si no hay clave de API, muestra el formulario para introducirla
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      </div>
    );
  }

  // Si la clave existe y el cliente está inicializado, muestra la aplicación principal
  return <App />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
