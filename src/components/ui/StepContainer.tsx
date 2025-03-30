'use client';

import React, { ReactNode } from 'react';
import EnhancedGlassMorphicContainer from './EnhancedGlassMorphicContainer';
import { useRouter } from 'next/navigation';

interface StepContainerProps {
  children: ReactNode;
  title: string;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  backVisible?: boolean;
}

/**
 * A consistent container for all onboarding steps
 * Ensures unified styling and navigation across steps
 */
export const StepContainer: React.FC<StepContainerProps> = ({
  children,
  title,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextDisabled = false,
  backVisible = true,
}) => {
  const router = useRouter();

  // Default handlers navigate between steps
  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentStep < totalSteps) {
      router.push(`/onboarding/step/${currentStep + 1}`);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      router.push(`/onboarding/step/${currentStep - 1}`);
    } else {
      router.push('/');
    }
  };

  // Calculate completion percentage
  const completionPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <EnhancedGlassMorphicContainer className="max-w-2xl w-full mx-auto p-6">
      {/* Step indicator and progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-white/80">{completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Section title */}
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>

      {/* Main content */}
      <div className="mb-6">
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {backVisible ? (
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-custom-gray-40 text-white rounded-md border border-white/20 hover:bg-custom-gray-50 transition-colors"
          >
            Back
          </button>
        ) : (
          <div></div> // Empty div to maintain spacing with flex justify-between
        )}

        <button
          onClick={handleNext}
          disabled={nextDisabled}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
            nextDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </EnhancedGlassMorphicContainer>
  );
};

export default StepContainer;