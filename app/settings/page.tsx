'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getCurrentUserSettings } from '@/lib/actions/user.actions';
import { UserSettingsData } from '@/lib/schemas/usersettings-schema';

import { SettingsForm } from './_components/settings-form';
import { SettingsFormSkeleton } from './_components/settings-form-skeleton';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userSettings = await getCurrentUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <main className="mx-auto max-w-md">
      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {isLoading ? (
        <SettingsFormSkeleton />
      ) : (
        <SettingsForm settings={settings!} />
      )}
    </main>
  );
}
