"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { TrackingGoal } from "@/app/generated/prisma";

import { finishOnboardingAction, getUserAction } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function OnboardingForm() {
  const { isLoaded, signOut } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    cycleLength: "28",
    periodLength: "5",
    lastPeriodDate: "",
    trackingGoal: TrackingGoal.GENERAL,
  });
  const router = useRouter();
  const totalSteps = 4;
  const progressPercentage = (step / totalSteps) * 100;
  let currentStepHtml: React.ReactNode;

  useEffect(() => {
    if (isLoaded) {
      getUserAction().then(
        (user) => {
          if (user?.onboardingCompleted) {
            router.push("/settings");
          }
        },
        (error) => {
          if (error.message === "Unauthorized") {
            signOut({
              redirectUrl: "/",
            });
          }
        },
      );
    }
  }, [isLoaded]);

  switch (step) {
    case 1:
      currentStepHtml = (
        <>
          <CardHeader className="text-center">
            <CardTitle>Welcome to CycleTracker! 🌸</CardTitle>
            <CardDescription>
              Let's set up your profile to give you the most accurate tracking
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-length">
                  What's your average cycle length?
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="cycle-length"
                    type="number"
                    min="20"
                    max="45"
                    value={onboardingData.cycleLength}
                    onChange={(e) =>
                      handleInputChange("cycleLength", e.target.value)
                    }
                  />
                  <span className="text-muted-foreground text-sm">days</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Most cycles are between 21-35 days. If you're not sure, 28
                  days is a good starting point.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period-length">
                  How long does your period usually last?
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="period-length"
                    type="number"
                    min="1"
                    max="10"
                    value={onboardingData.periodLength}
                    onChange={(e) =>
                      handleInputChange("periodLength", e.target.value)
                    }
                  />
                  <span className="text-muted-foreground text-sm">days</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Typical periods last 3-7 days.
                </p>
              </div>
            </div>
          </CardContent>
        </>
      );
      break;
    case 2:
      currentStepHtml = (
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
                <Label htmlFor="last-period">
                  First day of your last period
                </Label>
                <Input
                  id="last-period"
                  type="date"
                  value={onboardingData.lastPeriodDate}
                  onChange={(e) =>
                    handleInputChange("lastPeriodDate", e.target.value)
                  }
                  max={new Date().toISOString().split("T")[0]}
                />
                <p className="text-muted-foreground text-xs">
                  Select the first day your last period started. If you can't
                  remember the exact date, an estimate is fine.
                </p>
              </div>
            </div>
          </CardContent>
        </>
      );
      break;
    case 3:
      currentStepHtml = (
        <>
          <CardHeader className="text-center">
            <CardTitle>What's your main tracking goal?</CardTitle>
            <CardDescription>
              This helps us customize your experience and insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={onboardingData.trackingGoal}
              onValueChange={(value) =>
                handleInputChange("trackingGoal", value)
              }
              className="space-y-3"
            >
              <div className="hover:bg-muted/50 flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value={TrackingGoal.GENERAL} id="general" />
                <Label htmlFor="general" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">General health tracking</p>
                    <p className="text-muted-foreground text-sm">
                      Monitor cycles and symptoms
                    </p>
                  </div>
                </Label>
              </div>

              <div className="hover:bg-muted/50 flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem
                  value={TrackingGoal.CONCEPTION}
                  id="conception"
                />
                <Label htmlFor="conception" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Trying to conceive</p>
                    <p className="text-muted-foreground text-sm">
                      Track fertility and ovulation
                    </p>
                  </div>
                </Label>
              </div>

              <div className="hover:bg-muted/50 flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem
                  value={TrackingGoal.CONTRACEPTION}
                  id="contraception"
                />
                <Label
                  htmlFor="contraception"
                  className="flex-1 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">Natural contraception</p>
                    <p className="text-muted-foreground text-sm">
                      Avoid fertile days
                    </p>
                  </div>
                </Label>
              </div>

              <div className="hover:bg-muted/50 flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value={TrackingGoal.HEALTH} id="health" />
                <Label htmlFor="health" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Health monitoring</p>
                    <p className="text-muted-foreground text-sm">
                      Track symptoms and patterns
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </>
      );
      break;
    case 4:
      currentStepHtml = (
        <>
          <CardHeader className="text-center">
            <CardTitle>You're all set! 🎉</CardTitle>
            <CardDescription>
              Your CycleTracker is ready to help you understand your body
              better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-gradient-to-r from-rose-50 to-purple-50 p-6">
                <h3 className="mb-2 font-semibold">What's next?</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Start logging your daily symptoms</li>
                  <li>• View your personalized calendar</li>
                  <li>• Get insights about your cycle</li>
                  <li>• Set up helpful reminders</li>
                </ul>
              </div>

              <div className="text-muted-foreground text-xs">
                <p>
                  Remember: It may take a few cycles for predictions to become
                  more accurate as we learn your unique patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </>
      );
  }

  const handleNextStep = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      const response = await finishOnboardingAction({
        averageCycleLength: parseInt(onboardingData.cycleLength),
        averagePeriodLength: parseInt(onboardingData.periodLength),
        lastPeriodDate: new Date(onboardingData.lastPeriodDate),
        reminderDaysBefore: 2,
        enableNotifications: true,
        trackingGoal: onboardingData.trackingGoal,
      });

      if (response.success) {
        toast.success("Onboarding successful! Redirecting to dashboard...");
      } else {
        toast.error(response.error);
      }

      setIsLoading(false);
      router.push("/dashboard");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center justify-center">
          <Logo />
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="text-muted-foreground mb-2 flex justify-between text-sm">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Onboarding Form */}
        <Card className="border-0 shadow-xl">
          {currentStepHtml}
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={handleNextStep}
              className="w-full"
              disabled={isLoading}
            >
              {step === totalSteps ? (
                <>
                  Start Tracking
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="w-full"
                disabled={isLoading}
              >
                <ArrowLeftIcon className="ml-2 h-4 w-4" />
                Go Back
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Skip onboarding */}
        {step < totalSteps && (
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Skip for now
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
