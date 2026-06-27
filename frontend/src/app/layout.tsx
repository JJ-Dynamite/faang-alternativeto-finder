import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Find free app alternatives',
  description: 'Find free app alternatives - Built with Rust + Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
