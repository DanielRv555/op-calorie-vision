import React, { useState } from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface LoginProps {
    onLogin: (usuario: string, codigo: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [usuario, setUsuario] = useState('');
    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await onLogin(usuario, codigo);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md transition-all duration-300">
                <div className="text-center mb-6">
                    <CameraIcon className="w-12 h-12 text-teal-500 mx-auto" />
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight mt-2">
                        Calorie Vision
                    </h1>
                     <p className="text-gray-500 mt-2">Inicia sesión para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                            Usuario (Email)
                        </label>
                        <input
                            id="usuario"
                            name="usuario"
                            type="email"
                            autoComplete="email"
                            required
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                            Código (Contraseña)
                        </label>
                        <input
                            id="codigo"
                            name="codigo"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                    </div>
                    
                    {error && (
                         <div className="bg-red-50 border-l-4 border-red-400 p-3">
                            <p className="text-sm text-red-700">{error}</p>
                         </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
