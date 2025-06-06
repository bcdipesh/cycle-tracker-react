"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { UserSettings } from "@/app/generated/prisma";

import prisma from "@/lib/db";

/**
 * Type definition for consistent action results across all server actions
 */
export type ActionResult<T = any> =
  | { success: true; data?: T }
  | { success: false; error: string };

// Ensure compatibility with legacy success-only returns
export type LegacySuccessResult = { success: boolean };

/**
 * Complete the user onboarding process by creating or updating user profile,
 * settings, and initial period data
 * @param data User settings and optional last period date
 * @returns ActionResult with success status and data or error
 */
export async function finishOnboardingAction(
  data: Omit<UserSettings, "id" | "userId"> & { lastPeriodDate?: Date },
) {
  const { userId } = await auth();
  const user = await currentUser();

  // Check if user is authenticated
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Validate input data
  if (data.averageCycleLength < 20 || data.averageCycleLength > 45) {
    return {
      success: false,
      error: "Cycle length must be between 20 and 45 days.",
    };
  }

  if (data.averagePeriodLength < 1 || data.averagePeriodLength > 10) {
    return {
      success: false,
      error: "Period length must be between 1 and 10 days.",
    };
  }

  if (data.reminderDaysBefore < 1 || data.reminderDaysBefore > 7) {
    return {
      success: false,
      error: "Reminder days must be between 1 and 7 days.",
    };
  }

  // Validate last period date if provided
  if (data.lastPeriodDate) {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

    if (
      data.lastPeriodDate > new Date() ||
      data.lastPeriodDate < threeMonthsAgo
    ) {
      return {
        success: false,
        error:
          "Last period date must be within the last three months and not in the future.",
      };
    }
  }

  try {
    // Use a transaction to ensure all operations complete or fail together
    return await prisma.$transaction(async (tx) => {
      // Check if user exists in database
      let dbUser = await tx.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

      // If user doesn't exist, add a new user in the database
      if (!dbUser) {
        if (!user.emailAddresses?.[0]?.emailAddress) {
          throw new Error("User email address is required");
        }

        dbUser = await tx.user.create({
          data: {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          },
        });
      }

      // Check if user settings already exist
      const existingSettings = await tx.userSettings.findUnique({
        where: {
          userId: dbUser.id,
        },
      });

      let userSettings;

      // Create or update user settings
      if (existingSettings) {
        userSettings = await tx.userSettings.update({
          where: {
            userId: dbUser.id,
          },
          data: {
            averageCycleLength: data.averageCycleLength,
            averagePeriodLength: data.averagePeriodLength,
            reminderDaysBefore: data.reminderDaysBefore,
            enableNotifications: data.enableNotifications,
            trackingGoal: data.trackingGoal,
          },
        });
      } else {
        userSettings = await tx.userSettings.create({
          data: {
            userId: dbUser.id,
            averageCycleLength: data.averageCycleLength,
            averagePeriodLength: data.averagePeriodLength,
            reminderDaysBefore: data.reminderDaysBefore,
            enableNotifications: data.enableNotifications,
            trackingGoal: data.trackingGoal,
          },
        });
      }

      // If lastPeriodDate is provided, create a new period log in the database
      let periodData = null;
      if (data.lastPeriodDate) {
        periodData = await tx.period.create({
          data: {
            userId: dbUser.id,
            startDate: data.lastPeriodDate,
          },
        });
      }

      // Update the user's onboarding completed status
      const updatedUser = await tx.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          onboardingCompleted: true,
        },
      });

      return {
        success: true,
        data: {
          user: updatedUser,
          settings: userSettings,
          period: periodData,
        },
      };
    });
  } catch (error) {
    console.error("Error in onboarding:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        throw error; // Rethrow auth errors to be handled by the client
      }

      if (error.message.includes("User email address is required")) {
        return {
          success: false,
          error: "Invalid user data. Email address is required.",
        };
      }

      // Handle Prisma-specific errors
      if (error.message.includes("Unique constraint")) {
        return {
          success: false,
          error:
            "User settings already exist. Cannot complete onboarding again.",
        };
      }
    }

    return {
      success: false,
      error: "Failed to save onboarding data. Please try again.",
    };
  }
}

/**
 * Get the authenticated user from the database
 * @returns User object or throws Unauthorized error
 */
export async function getUserAction() {
  try {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return null; // User not found in our database (might be authenticated but not completed onboarding)
    }

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Unauthorized");
  }
}

/**
 * Get user settings from the database
 * @returns UserSettings object or throws Unauthorized error
 */
export async function getUserSettingsAction() {
  try {
    const user = await getUserAction();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Get user settings from database
    const userSettings = await prisma.userSettings.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userSettings) {
      throw new Error(
        "User settings not found. Please complete onboarding first.",
      );
    }

    return userSettings;
  } catch (error) {
    console.error("Error getting user settings:", error);

    // Preserve original error message if it's a custom error
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to get user settings");
  }
}

/**
 * Updates user settings with input validation and improved error handling
 * @param data User settings data to update
 * @returns ActionResult containing success status and data or error message
 */
export async function updateUserSettingsAction(
  data: Omit<UserSettings, "id" | "userId" | "trackingGoal">,
) {
  try {
    // Validate input data
    if (data.averageCycleLength < 20 || data.averageCycleLength > 45) {
      return {
        success: false,
        error: "Cycle length must be between 20 and 45 days.",
      };
    }

    if (data.averagePeriodLength < 1 || data.averagePeriodLength > 10) {
      return {
        success: false,
        error: "Period length must be between 1 and 10 days.",
      };
    }

    if (data.reminderDaysBefore < 1 || data.reminderDaysBefore > 7) {
      return {
        success: false,
        error: "Reminder days must be between 1 and 7 days.",
      };
    }

    const user = await getUserAction();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Update user settings in database
    const updatedSettings = await prisma.userSettings.update({
      where: {
        userId: user.id,
      },
      data: {
        averageCycleLength: data.averageCycleLength,
        averagePeriodLength: data.averagePeriodLength,
        reminderDaysBefore: data.reminderDaysBefore,
        enableNotifications: data.enableNotifications,
      },
    });

    return {
      success: true,
      data: updatedSettings,
    };
  } catch (error) {
    console.error("Error updating user settings:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        throw error; // Rethrow auth errors to be handled by the client
      }

      // Handle Prisma errors more specifically
      if (error.message.includes("Record to update not found")) {
        return {
          success: false,
          error: "User settings not found. Please complete onboarding first.",
        };
      }
    }

    return {
      success: false,
      error: "Failed to update user settings.",
    };
  }
}

export async function getCurrentPeriodAction() {
  try {
    const user = await getUserAction();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const period = await prisma.period.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    if (!period) {
      return null;
    }

    return period;
  } catch (error) {
    console.error("Error getting current period:", error);

    // Preserve original error message if it's a custom error
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to get current period");
  }
}
