'use client';

import { Button } from '@/components/ui/button';

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  isSubmitting: boolean;
  submittingText?: string;
};

export function SubmitButton({
  children,
  isSubmitting,
  submittingText = 'Saving...',
  ...props
}: SubmitButtonProps) {
  return (
    <Button {...props} disabled={props.disabled || isSubmitting}>
      {isSubmitting ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {submittingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
