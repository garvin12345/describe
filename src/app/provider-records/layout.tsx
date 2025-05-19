import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provider Records - Sidecar Health',
  description: 'Confirm provider records',
};

export default function ProviderRecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 