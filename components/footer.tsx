import { Calendar } from 'lucide-react';

export function Footer() {
  return (
    <footer className="container mx-auto max-w-6xl border-t px-4 py-8">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 flex items-center space-x-2 md:mb-0">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-purple-500">
            <Calendar className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold">CycleTracker</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © 2024 CycleTracker. Your health, your data, your control.
        </p>
      </div>
    </footer>
  );
}
