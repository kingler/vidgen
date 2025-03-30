'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { getCurrentStep } = useOnboarding();
  
  // Redirect to the current step or start at step 1
  useEffect(() => {
    const currentStep = getCurrentStep();
    router.replace(`/onboarding/step/${currentStep}`);
  }, [getCurrentStep, router]);
  
  // This is just rendered while the redirect happens
  return null;
}