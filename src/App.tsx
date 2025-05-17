import { usePeriodLogs } from '@/hooks/usePeriodLogs';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { LogPeriodForm } from '@/components/log-period-form';
import { PeriodLogs } from '@/components/period-logs';

function App() {
  const [periodLogs, addPeriodLog] = usePeriodLogs();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log your period for this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <LogPeriodForm addPeriodLog={addPeriodLog} />
        </CardContent>
      </Card>

      <PeriodLogs periodLogs={periodLogs} />
    </>
  );
}

export default App;
