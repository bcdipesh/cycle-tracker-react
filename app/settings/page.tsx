"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, BellIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { getUserSettingsAction, updateUserSettingsAction } from "@/lib/actions";

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
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { isLoaded, signOut } = useAuth();
  const [userSettings, setUserSettings] = useState({
    averageCycleLength: "",
    averagePeriodLength: "",
    reminderDaysBefore: "",
    enableNotifications: "",
  });

  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      setIsLoadingSettings(true);

      const fetchSettings = async () => {
        try {
          const settings = await getUserSettingsAction();

          if (settings) {
            setUserSettings({
              averageCycleLength: settings.averageCycleLength.toString(),
              averagePeriodLength: settings.averagePeriodLength.toString(),
              reminderDaysBefore: settings.reminderDaysBefore.toString(),
              enableNotifications: settings.enableNotifications.toString(),
            });
          }
        } catch (error) {
          console.error("Error fetching user settings:", error);

          if (error instanceof Error) {
            // Handle unauthorized error
            if (error.message === "Unauthorized") {
              signOut({
                redirectUrl: "/",
              });
              return;
            }

            // Handle settings not found error
            if (error.message.includes("User settings not found")) {
              toast.error("Please complete onboarding first.");
              // Redirect to onboarding
              window.location.href = "/onboarding";
              return;
            }

            // Show generic error
            toast.error(error.message || "Failed to load settings.");
          }
        } finally {
          setIsLoadingSettings(false);
        }
      };

      fetchSettings();
    }
  }, [isLoaded, signOut]);

  const handleInputChange = (field: string, value: string) => {
    setUserSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Validate inputs before sending to server
    const validateNumber = (
      value: string,
      min: number,
      max: number,
      fieldName: string,
    ): number | null => {
      const num = parseInt(value);
      if (isNaN(num) || num < min || num > max) {
        toast.error(`${fieldName} must be between ${min} and ${max} days`);
        return null;
      }
      return num;
    };

    const cycleLength = validateNumber(
      userSettings.averageCycleLength,
      20,
      45,
      "Average cycle length",
    );
    const periodLength = validateNumber(
      userSettings.averagePeriodLength,
      1,
      10,
      "Average period length",
    );
    const reminderDays = validateNumber(
      userSettings.reminderDaysBefore,
      1,
      7,
      "Reminder days",
    );

    // Don't proceed if validation failed
    if (!cycleLength || !periodLength || !reminderDays) {
      setIsSaving(false);
      return;
    }

    const userSettingsData = {
      averageCycleLength: cycleLength,
      averagePeriodLength: periodLength,
      reminderDaysBefore: reminderDays,
      enableNotifications: userSettings.enableNotifications === "true",
    };

    try {
      const result = await updateUserSettingsAction(userSettingsData);

      if (result.success) {
        // Show success message
        toast.success("Settings updated successfully.");

        // If the server returned updated settings, update local state
        if (result.data) {
          setUserSettings({
            averageCycleLength: result.data.averageCycleLength.toString(),
            averagePeriodLength: result.data.averagePeriodLength.toString(),
            reminderDaysBefore: result.data.reminderDaysBefore.toString(),
            enableNotifications: result.data.enableNotifications.toString(),
          });
        }
      } else {
        // Show error message from server
        toast.error(result.error || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Error updating settings:", error);

      // Handle authentication errors
      if (error instanceof Error && error.message === "Unauthorized") {
        signOut({
          redirectUrl: "/",
        });
        toast.error("Unauthorized access. Please sign in again.");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to update settings.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
      </div>

      {/* Settings Form */}
      <Card className="mb-6 border-0 dark:bg-gradient-to-br dark:from-rose-950 dark:via-gray-950 dark:to-gray-950">
        <CardHeader>
          <CardTitle>Cycle Settings</CardTitle>
          <CardDescription>Customize your cycle tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="averageCycleLength">Average Cycle Length</Label>
            <div className="flex items-center gap-2">
              {isLoadingSettings ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input
                  id="averageCycleLength"
                  type="number"
                  value={userSettings?.averageCycleLength}
                  min={20}
                  max={45}
                  onChange={(e) =>
                    handleInputChange("averageCycleLength", e.target.value)
                  }
                />
              )}
              <span className="text-muted-foreground text-sm">days</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="averagePeriodLength">Average Period Length</Label>
            <div className="flex items-center gap-2">
              {isLoadingSettings ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input
                  id="averagePeriodLength"
                  type="number"
                  value={userSettings?.averagePeriodLength}
                  min={1}
                  max={10}
                  onChange={(e) =>
                    handleInputChange("averagePeriodLength", e.target.value)
                  }
                />
              )}
              <span className="text-muted-foreground text-sm">days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Form */}
      <Card className="mb-6 border-0 dark:bg-gradient-to-br dark:from-rose-950 dark:via-gray-950 dark:to-gray-950">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellIcon className="text-muted-foreground h-4 w-4" />
              <Label htmlFor="enableNotifications" className="cursor-pointer">
                Period Reminder
              </Label>
            </div>
            {isLoadingSettings ? (
              <Skeleton className="size-4" />
            ) : (
              <Switch
                id="enableNotifications"
                checked={userSettings?.enableNotifications === "true"}
                onCheckedChange={(checked) =>
                  handleInputChange("enableNotifications", checked.toString())
                }
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderDaysBefore">Remind me before</Label>
            <div className="flex items-center gap-2">
              {isLoadingSettings ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input
                  id="reminderDaysBefore"
                  type="number"
                  value={userSettings?.reminderDaysBefore}
                  min={1}
                  max={7}
                  onChange={(e) =>
                    handleInputChange("reminderDaysBefore", e.target.value)
                  }
                />
              )}
              <span className="text-muted-foreground text-sm">days</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoadingSettings || isSaving}
            className="relative"
          >
            {isSaving && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              </div>
            )}
            <span className={isSaving ? "opacity-0" : ""}>Save Changes</span>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
