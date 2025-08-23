import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin sign in - ST Matthew\'s Anglican Church',
};

export default function AdminIndexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b"> 
        <div className="container mx-auto p-4 flex gap-4 items-center">
          <div className="w-8 h-10 bg-orange-500"></div>
          <h1 className="font-bold text-green-800 text-xl md:text-3xl">ST Matthew's Anglican Church</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-2">
        {children}
      </main>
    </>
  );
}
