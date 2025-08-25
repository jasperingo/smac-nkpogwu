import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "ST Matthew's Anglican Church",
  description: "Diocese of Niger Delta North, Anglican Communion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        {children}
      </body>
    </html>
  );
}
