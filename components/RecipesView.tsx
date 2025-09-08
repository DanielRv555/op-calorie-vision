import React, { useState, useMemo } from 'react';
import type { Recipe } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { SearchIcon } from './icons/SearchIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';

const MacroPill: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div className={`flex-1 p-3 rounded-lg text-center ${color}`}>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-xl font-bold">{Math.round(value)}<span className="text-sm font-normal">{unit}</span></p>
    </div>
);

const RecipeDetailModal = ({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-title"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up"
                onClick={e => e.stopPropagation()}
                role="document"
            >
                <img src={recipe.foto} alt={recipe.nombre} className="w-full h-64 object-cover rounded-t-xl" />
                <div className="p-6">
                    <h2 id="recipe-title" className="text-3xl font-bold text-gray-800">{recipe.nombre}</h2>
                    
                    <div className="flex gap-2 sm:gap-4 text-white my-4">
                        <div className={`flex-1 p-3 rounded-lg text-center bg-teal-500`}>
                            <p className="text-sm font-medium opacity-80">Calorías</p>
                            <p className="text-xl font-bold">{Math.round(recipe.calorias)}<span className="text-sm font-normal">kcal</span></p>
                        </div>
                        <MacroPill label="Proteína" value={recipe.proteinas} unit="g" color="bg-sky-500" />
                        <MacroPill label="Carbs" value={recipe.carbohidratos} unit="g" color="bg-orange-500" />
                        <MacroPill label="Grasa" value={recipe.grasas} unit="g" color="bg-violet-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ingredientes</h3>
                            <ul className="text-gray-600 list-disc list-inside space-y-1 whitespace-pre-wrap">
                                {recipe.ingredientes.split('\n').filter(i => i.trim()).map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Preparación</h3>
                            <div className="text-gray-600 space-y-2 whitespace-pre-wrap">
                                {recipe.preparacion.split('\n').filter(s => s.trim()).map((step, i) => <p key={i}>{step}</p>)}
                            </div>
                        </div>
                    </div>

                    {recipe.video && recipe.video.startsWith('http') && (
                        <div className="mt-6">
                            <a 
                                href={recipe.video} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition"
                            >
                                <VideoCameraIcon className="w-5 h-5 mr-2" />
                                Ver Video de Preparación
                            </a>
                        </div>
                    )}

                    <div className="mt-6">
                        <button onClick={onClose} className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const RecipesView: React.FC<{ recipes: Recipe[], onBack: () => void }> = ({ recipes, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return recipes;
    return recipes.filter(r => r.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [recipes, searchQuery]);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2" aria-label="Volver">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Recetas Saludables</h2>
        </div>
      </div>
      
      <div className="relative mb-6">
        <label htmlFor="search-recipe" className="sr-only">Buscar receta</label>
        <input 
          id="search-recipe"
          type="text"
          placeholder="Buscar receta por nombre..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <button key={index} onClick={() => setSelectedRecipe(recipe)} className="text-left cursor-pointer bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group focus:outline-none focus:ring-2 focus:ring-teal-500">
              <img src={recipe.foto} alt={recipe.nombre} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors truncate" title={recipe.nombre}>{recipe.nombre}</h3>
                 <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-teal-50 p-2 rounded-lg text-center">
                        <p className="font-bold text-teal-800">{Math.round(recipe.calorias)}</p>
                        <p className="text-xs text-teal-700">Kcal</p>
                    </div>
                    <div className="bg-sky-50 p-2 rounded-lg text-center">
                        <p className="font-bold text-sky-800">{Math.round(recipe.proteinas)}g</p>
                        <p className="text-xs text-sky-700">Proteína</p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded-lg text-center">
                        <p className="font-bold text-orange-800">{Math.round(recipe.carbohidratos)}g</p>
                        <p className="text-xs text-orange-700">Carbs</p>
                    </div>
                    <div className="bg-violet-50 p-2 rounded-lg text-center">
                        <p className="font-bold text-violet-800">{Math.round(recipe.grasas)}g</p>
                        <p className="text-xs text-violet-700">Grasa</p>
                    </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
         <div className="text-center py-12">
            <p className="text-gray-500">Cargando recetas...</p>
        </div>
      )}
      
      {recipes.length > 0 && filteredRecipes.length === 0 && (
          <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron recetas con ese nombre.</p>
          </div>
      )}

      {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default RecipesView;