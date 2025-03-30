'use client';

import React from 'react';
import GlassMorphicContainer from './GlassMorphicContainer';

interface EnhancedProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const EnhancedProgressSteps: React.FC<EnhancedProgressStepsProps> = ({
  currentStep,
  totalSteps,
  className = '',
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-sm font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-white/80 text-sm">
          {progressPercentage}% Complete
        </span>
      </div>
      
      <GlassMorphicContainer className="h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}
        />
      </GlassMorphicContainer>
    </div>
  );
};

export default EnhancedProgressSteps;