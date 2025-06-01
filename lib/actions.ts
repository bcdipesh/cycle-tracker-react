"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { UserSettings } from "@/app/generated/prisma";

import prisma from "@/lib/db";

export async function finishOnboardingAction(
  data: Omit<UserSettings, "id" | "userId"> & { lastPeriodDate?: Date },
) {
  const { userId } = await auth();
  const user = await currentUser();

  // Check if user is authenticated
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  try {
    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    // If user doesn't exist, add a new user in the database
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    }

    // Create a new user settings in the database
    await prisma.userSettings.create({
      data: {
        userId: dbUser.id,
        averageCycleLength: data.averageCycleLength,
        averagePeriodLength: data.averagePeriodLength,
        reminderDaysBefore: data.reminderDaysBefore,
        enableNotifications: data.enableNotifications,
        trackingGoal: data.trackingGoal,
      },
    });

    // If lastPeriodDate is provided, create a new period log in the database
    if (data.lastPeriodDate) {
      await prisma.period.create({
        data: {
          userId: dbUser.id,
          startDate: data.lastPeriodDate,
        },
      });
    }

    // Update the user's onboarding completed status
    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        onboardingCompleted: true,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in onboarding:", error);
    return {
      success: false,
      error: "Failed to save onboarding data.",
    };
  }
}

export async function getUserAction() {
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

  return user;
}

export async function getUserSettingsAction() {
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

  return userSettings;
}

export async function updateUserSettingsAction(
  data: Omit<UserSettings, "id" | "userId" | "trackingGoal">,
) {
  const user = await getUserAction();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Update user settings in database
  try {
    await prisma.userSettings.update({
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
    };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return {
      success: false,
      error: "Failed to update user settings.",
    };
  }
}

// import { type PeriodLog } from '@/lib/types';

// export async function getPeriodLogsAction(): Promise<
//   PeriodLog[] | { error: string }
// > {
//   try {
//     const logs = (await prisma.periodLog.findMany({
//       orderBy: {
//         startDate: 'desc',
//       },
//       where: {
//         endDate: {
//           not: null,
//         },
//       },
//     })) as PeriodLog[];

//     return logs;
//   } catch (error) {
//     console.error('Error fetching period logs:', error);
//     return {
//       error: 'Failed to fetch period logs',
//     };
//   }
// }

// export async function createPeriodLogAction(
//   data: Omit<PeriodLog, 'id' | 'endDate'> & Partial<Pick<PeriodLog, 'endDate'>>
// ) {
//   try {
//     const existingLog = await prisma.periodLog.findFirst({
//       where: {
//         startDate: data.startDate,
//       },
//     });

//     if (existingLog) {
//       return {
//         error:
//           'Period log already exists for this date. Please choose a different date.',
//       };
//     }

//     const log = await prisma.periodLog.create({
//       data: {
//         startDate: data.startDate,
//         endDate: data.endDate,
//       },
//     });

//     return log;
//   } catch (error) {
//     console.error('Error creating period log:', error);
//     return {
//       error: 'Failed to create period log. Please try again.',
//     };
//   } finally {
//     revalidatePath('/');
//   }
// }

// export async function deletePeriodLogAction(id: string) {
//   try {
//     await prisma.periodLog.delete({
//       where: { id },
//     });
//   } catch (error) {
//     console.error('Error deleting period log:', error);
//     return {
//       error: 'Failed to delete period log',
//     };
//   } finally {
//     revalidatePath('/');
//   }
// }
