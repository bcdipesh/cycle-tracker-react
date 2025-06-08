import { TrackingGoal } from '@/app/generated/prisma';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

type TrackingGoalOptionProps = {
  value: TrackingGoal;
  id: string;
  label: string;
  description: string;
};

export function TrackingGoalOption({
  value,
  id,
  label,
  description,
}: TrackingGoalOptionProps) {
  return (
    <div className="hover:bg-muted/50 flex items-center space-x-2 rounded-lg border p-3">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </Label>
    </div>
  );
}
