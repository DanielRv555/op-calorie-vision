import React from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { RecipeBookIcon } from './icons/BookOpenIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { FireIcon } from './icons/TargetIcon';
import { HistoryIcon } from './icons/HistoryIcon';


interface HeaderProps {
  onShowHistory: () => void;
  onShowGoals: () => void;
  onLogout: () => void;
  onShowRecipes: () => void;
}


const Header: React.FC<HeaderProps> = ({ onShowHistory, onShowGoals, onLogout, onShowRecipes }) => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-10">
      <div className="py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CameraIcon className="w-8 h-8 text-teal-500" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Calorie Vision
            </h1>
          </div>
          <div className="flex items-center space-x-2">
             <button
              onClick={onShowRecipes}
              aria-label="Ver recetas"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <RecipeBookIcon className="w-6 h-6" />
            </button>
             <button
              onClick={onShowGoals}
              aria-label="Establecer objetivos"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <FireIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onShowHistory}
              aria-label="Ver historial de comidas"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <HistoryIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onLogout}
              aria-label="Cerrar sesión"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;