import type { Metadata } from 'next';
import './globals.css';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import Menu from '@/components/Menu';

export const metadata: Metadata = {
  title: 'Gallery of Things',
  description: 'A photography portfolio',
};

async function getSiteSettings() {
  try {
    return await client.fetch(siteSettingsQuery);
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const theme = settings?.theme || 'dark';

  return (
    <html lang="en" data-theme={theme === 'light' ? 'light' : undefined}>
      <body>
        <Menu 
          siteTitle={settings?.siteTitle || 'Gallery of Things'} 
          contactEmail={settings?.contactEmail}
        />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.add('is-loaded');`,
          }}
        />
      </body>
    </html>
  );
}
