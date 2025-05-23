import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default Loader;
