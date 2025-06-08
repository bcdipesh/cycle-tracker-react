'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { TrackingGoal } from '@/app/generated/prisma';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { OnboardingData } from '@/lib/schemas/onboarding-schema';

import { TrackingGoalOption } from './tracking-goal-option';

const goalOptions = [
  {
    value: TrackingGoal.GENERAL,
    id: 'general',
    label: 'General health tracking',
    description: 'Monitor cycles and symptoms',
  },
  {
    value: TrackingGoal.CONCEPTION,
    id: 'conception',
    label: 'Trying to conceive',
    description: 'Track fertility and ovulation',
  },
  {
    value: TrackingGoal.CONTRACEPTION,
    id: 'contraception',
    label: 'Natural contraception',
    description: 'Avoid fertile days',
  },
  {
    value: TrackingGoal.HEALTH,
    id: 'health',
    label: 'Health monitoring',
    description: 'Track symptoms and patterns',
  },
];

export function Step3TrackingGoal() {
  const {
    control,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>What's your main tracking goal?</CardTitle>
        <CardDescription>
          This helps us customize your experience and insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          name="trackingGoal"
          control={control}
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              value={value}
              onValueChange={onChange}
              className="space-y-3"
            >
              {goalOptions.map((option) => (
                <TrackingGoalOption key={option.id} {...option} />
              ))}
            </RadioGroup>
          )}
        />
        {errors.trackingGoal && (
          <p className="text-sm font-medium text-destructive">
            {errors.trackingGoal.message}
          </p>
        )}
      </CardContent>
    </>
  );
}
