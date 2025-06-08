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

export function Step2LastPeriod() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>When was your last period?</CardTitle>
        <CardDescription>
          This helps us predict your next cycle and fertile window.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last-period">First day of your last period</Label>
            <Input
              id="last-period"
              type="date"
              {...register('lastPeriodDate')}
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-muted-foreground text-xs">
              Select the first day your last period started. If you can't
              remember the exact date, an estimate is fine.
            </p>
            {errors.lastPeriodDate && (
              <p className="text-sm font-medium text-destructive">
                {errors.lastPeriodDate.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </>
  );
}
