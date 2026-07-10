import type { Metadata } from 'next';
import { Inter, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { EventsProvider } from '@/context/EventsContext';
import { JobsProvider } from '@/context/JobsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['opsz'] });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: '500' });

export const metadata: Metadata = {
  title: 'Waypoint',
  description: 'The jobs and events actually worth your commute.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable} h-full`}>
      <body className="min-h-full">
        <AuthProvider>
          <EventsProvider>
            <JobsProvider>{children}</JobsProvider>
          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
