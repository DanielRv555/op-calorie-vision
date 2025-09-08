import React, { useState } from 'react';
import type { GoalData } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { FireIcon } from './icons/TargetIcon';

interface GoalsViewProps {
  initialGoals: GoalData | null;
  onSave: (goals: GoalData) => void;
  onBack: () => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ initialGoals, onSave, onBack }) => {
  const [goals, setGoals] = useState<GoalData>(initialGoals || { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoals(prev => ({ ...prev, [name]: value === '' ? 0 : parseInt(value, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goals);
  };
  
  const renderInput = (name: keyof GoalData, label: string, unit: string) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <input
                type="number"
                id={name}
                name={name}
                value={goals[name] === 0 ? '' : goals[name]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{unit}</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-in">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Establece Tus Objetivos Diarios</h2>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                {renderInput('calories', 'Calorías', 'kcal')}
                {renderInput('protein', 'Proteína', 'g')}
                {renderInput('carbs', 'Carbohidratos', 'g')}
                {renderInput('fat', 'Grasa', 'g')}

                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
                >
                    <FireIcon className="w-5 h-5 mr-2"/>
                    Guardar Objetivos
                </button>
            </form>
        </div>
    </div>
  );
};

export default GoalsView;