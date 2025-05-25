import { createUserAction } from "@/lib/actions";

export default async function OnboardingPage() {
  const response = await createUserAction();

  if (response?.success) {
    console.log(response.success);
  }

  if (response?.error) {
    console.log(response.error);
  }

  return <div>Onboarding</div>;
}
