import { CalendarIcon } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-purple-500">
        <CalendarIcon className="h-4 w-4" />
      </div>
      <span className="text-xl font-bold dark:text-white">CycleTracker</span>
    </div>
  );
}
