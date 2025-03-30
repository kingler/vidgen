'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function StepIndexPage() {
  const router = useRouter();
  const { getCurrentStep } = useOnboarding();
  
  // Redirect to the current step
  useEffect(() => {
    const currentStep = getCurrentStep();
    router.replace(`/onboarding/step/${currentStep}`);
  }, [getCurrentStep, router]);
  
  // This is just rendered while the redirect happens
  return null;
}