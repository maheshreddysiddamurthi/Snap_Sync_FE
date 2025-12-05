'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import Auth0ProviderWithConfig from './authoprovider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Auth0ProviderWithConfig>
      <ThemeProvider>{children}</ThemeProvider>
    </Auth0ProviderWithConfig>
  );
}
