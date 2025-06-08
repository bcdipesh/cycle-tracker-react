'use client';

import { useFormContext } from 'react-hook-form';

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '@/lib/schemas/onboarding-schema';

export function Step1CycleInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>Welcome to CycleTracker! 🌸</CardTitle>
        <CardDescription>
          Let's set up your profile for the most accurate tracking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cycle-length">
            What's your average cycle length?
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="cycle-length"
              type="number"
              {...register('cycleLength', { valueAsNumber: true })}
            />
            <span className="text-muted-foreground text-sm">days</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Most cycles are between 21-35 days. If you're not sure, 28 days is a
            good starting point.
          </p>
          {errors.cycleLength && (
            <p className="text-sm font-medium text-destructive">
              {errors.cycleLength.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="period-length">
            How long does your period usually last?
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="period-length"
              type="number"
              {...register('periodLength', { valueAsNumber: true })}
            />
            <span className="text-muted-foreground text-sm">days</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Typical periods last 3-7 days.
          </p>
          {errors.periodLength && (
            <p className="text-sm font-medium text-destructive">
              {errors.periodLength.message}
            </p>
          )}
        </div>
      </CardContent>
    </>
  );
}
