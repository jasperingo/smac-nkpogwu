import Link from 'next/link';
import type { Metadata } from 'next';
import SearchForm from '@/components/search-form';

export const metadata: Metadata = {
  title: 'ST Matthew\'s Anglican Church Nkpogwu',
};

const navItems = [
  {
    href: '/',
    text: "Home",
  },
  {
    href: '/programs',
    text: "Programs",
  },
  {
    href: '/groups',
    text: "Groups",
  },
  {
    href: '/contacts',
    text: "Contacts",
  },
  {
    href: '/sign-in',
    text: "Sign in",
  },
];

export default function GeneralLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-foreground border-b"> 
        <Link href="/" className="container mx-auto px-4 pt-4 flex gap-4 items-center justify-center">
          <div className="w-8 h-8 bg-orange-500"></div>
          <h1 className="font-bold text-primary text-xl sm:hidden">SMAC Nkpogwu, Port Harcourt</h1>
          <h1 className="font-bold text-primary text-xl hidden sm:block md:text-3xl">ST Matthew's Anglican Church Nkpogwu, Port Harcourt</h1>
        </Link>

        <div className="container mx-auto px-4">
          <SearchForm value={''} action="/search" placeholder="Search programs, groups and people" />
        </div>

        <nav className="container mx-auto px-4 pb-2">
          <ul className="flex gap-2 items-center justify-between overflow-auto">

            {
              navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block p-1 text-nowrap b,order border-primary font-bold bg-foreground text-primary hover:bg-gray-200`}
                  >{ item.text }</Link>
                </li>
              ))
            }

          </ul>
        </nav>

      </header>
      
      <main className="mt-[10.5rem] pb-24">
        { children }
      </main>
    </>
  );
}
