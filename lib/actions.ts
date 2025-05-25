"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/db";

export async function createUserAction() {
  const { userId } = await auth();
  const user = await currentUser();

  if (userId && user) {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      try {
        await prisma.user.create({
          data: {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });

        return {
          success: "User created successfully.",
        };
      } catch (error) {
        console.error("Error creating user:", error);
        return {
          error: "Failed to create user. Please try again.",
        };
      }
    }
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
