'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { TrackingGoal } from '@/app/generated/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  OnboardingData,
  onboardingSchema,
} from '@/lib/schemas/onboarding-schema';
import { finishUserOnboarding } from '@/lib/services/user.service';

import { Step1CycleInfo } from './step1-cycle-info';
import { Step2LastPeriod } from './step2-last-period';
import { Step3TrackingGoal } from './step3-tracking-goal';
import { Step4Confirmation } from './step4-confirmation';

const totalSteps = 4;
const stepsValidation: (keyof OnboardingData)[][] = [
  ['cycleLength', 'periodLength'],
  ['lastPeriodDate'],
  ['trackingGoal'],
  [],
];

export function OnboardingForm() {
  const { userId } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onboardingForm = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      cycleLength: 28,
      periodLength: 5,
      lastPeriodDate: new Date(),
      trackingGoal: TrackingGoal.GENERAL,
    },
  });

  const handleNextStep = async () => {
    const fieldsToValidate = stepsValidation[currentStep - 1];
    const isValid = await onboardingForm.trigger(fieldsToValidate);
    if (!isValid) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (onboardingData: OnboardingData) => {
    startTransition(async () => {
      await finishUserOnboarding(userId!, {
        cycleLength: onboardingData.cycleLength,
        periodLength: onboardingData.periodLength,
        trackingGoal: onboardingData.trackingGoal,
        lastPeriodDate: onboardingData.lastPeriodDate,
      });
      toast.success('Onboarding completed successfully');
      router.push('/dashboard');
    });
  };

  return (
    <FormProvider {...onboardingForm}>
      <div className="mb-8">
        <div className="text-muted-foreground mb-2 flex justify-between text-sm">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <Progress
          value={Math.round((currentStep / totalSteps) * 100)}
          className="h-2"
        />
      </div>

      <form onSubmit={onboardingForm.handleSubmit(onSubmit)}>
        <Card>
          {currentStep === 1 && <Step1CycleInfo />}
          {currentStep === 2 && <Step2LastPeriod />}
          {currentStep === 3 && <Step3TrackingGoal />}
          {currentStep === 4 && <Step4Confirmation />}

          <CardFooter>
            <div className="w-full space-y-2">
              {currentStep < totalSteps && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full"
                >
                  Continue
                </Button>
              )}
              {currentStep === totalSteps && (
                <Button type="submit" disabled={isPending} className="w-full">
                  Start Tracking
                </Button>
              )}
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="w-full"
                >
                  Go Back
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
