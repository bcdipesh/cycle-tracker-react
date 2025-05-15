import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

import { LogPeriodForm } from '@/components/log-period-form';

function App() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log your period for this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <LogPeriodForm />
        </CardContent>
      </Card>
    </>
  );
}

export default App;
