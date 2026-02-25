'use client';

import { useEffect, useState } from 'react';
import Menu from './Menu';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';

interface SiteSettings {
  siteTitle?: string;
  contactEmail?: string;
  theme?: 'dark' | 'light';
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const startTime = Date.now();
      try {
        const data = await client.fetch(siteSettingsQuery);
        setSettings(data);
        if (data?.theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        const elapsed = Date.now() - startTime;
        const minDelay = 500;
        if (elapsed < minDelay) {
          setTimeout(() => setIsLoading(false), minDelay - elapsed);
        } else {
          setIsLoading(false);
        }
      }
    }
    fetchSettings();
  }, []);

  if (isLoading) {
    return <div className="loading-screen" />;
  }

  return (
    <>
      <Menu
        siteTitle={settings?.siteTitle || 'Halina Foto'}
        contactEmail={settings?.contactEmail}
      />
      {children}
    </>
  );
}
