import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Halina Foto',
  description: 'Documentary and fine art photography portfolio by Halina Foto, an Oslo-based photographer. Editorial, portrait, documentary, and commercial work.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.add('is-loaded');`,
          }}
        />
      </body>
    </html>
  );
}
