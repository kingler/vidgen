'use client';

import React from 'react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-slate-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressSteps;