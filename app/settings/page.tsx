"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

export default function SettingsPage() {
  const { isLoaded, signOut } = useAuth();
  const [userSettings, setUserSettings] = useState({
    averageCycleLength: "",
    averagePeriodLength: "",
    reminderDaysBefore: "",
    enableNotifications: "",
  });

  useEffect(() => {
    if (isLoaded) {
      getUserSettingsAction().then(
        (settings) => {
          if (!settings) {
            return;
          }

          setUserSettings({
            averageCycleLength: settings.averageCycleLength.toString(),
            averagePeriodLength: settings.averagePeriodLength.toString(),
            reminderDaysBefore: settings.reminderDaysBefore.toString(),
            enableNotifications: settings.enableNotifications.toString(),
          });
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

  const handleInputChange = (field: string, value: string) => {
    setUserSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    const userSettingsData = {
      averageCycleLength: parseInt(userSettings.averageCycleLength),
      averagePeriodLength: parseInt(userSettings.averagePeriodLength),
      reminderDaysBefore: parseInt(userSettings.reminderDaysBefore),
      enableNotifications: userSettings.enableNotifications === "true",
    };

    try {
      toast.promise(updateUserSettingsAction(userSettingsData), {
        loading: "Updating settings...",
        success: "Settings updated successfully.",
        error: (error) => {
          if (error instanceof Error && error.message === "Unauthorized") {
            signOut({
              redirectUrl: "/",
            });
            return "Unauthorized access. Please sign in again.";
          }
          return error.message || "Failed to update settings.";
        },
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings.");
    }
  };

  return (
    <main className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
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
              <span className="text-muted-foreground text-sm">days</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="averagePeriodLength">Average Period Length</Label>
            <div className="flex items-center gap-2">
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
            <Switch
              id="enableNotifications"
              checked={userSettings?.enableNotifications === "true"}
              onCheckedChange={(checked) =>
                handleInputChange("enableNotifications", checked.toString())
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderDaysBefore">Remind me before</Label>
            <div className="flex items-center gap-2">
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
              <span className="text-muted-foreground text-sm">days</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
