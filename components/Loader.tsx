
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full text-center py-20">
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-teal-500 border-t-transparent mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">{message}</p>
      <p className="text-gray-500">Por favor, espera un momento...</p>
    </div>
  );
};

export default Loader;