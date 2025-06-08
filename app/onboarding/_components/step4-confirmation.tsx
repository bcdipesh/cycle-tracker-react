import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Step4Confirmation() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>You're all set! 🎉</CardTitle>
        <CardDescription>
          Your CycleTracker is ready to help you understand your body better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
          <div className="rounded-lg bg-gradient-to-r from-rose-50 to-purple-50 p-6 dark:from-rose-950 dark:to-purple-950">
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
              Remember: It may take a few cycles for predictions to become more
              accurate as we learn your unique patterns.
            </p>
          </div>
        </div>
      </CardContent>
    </>
  );
}
