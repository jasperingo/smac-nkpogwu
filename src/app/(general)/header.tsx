'use client'

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { UserEntity } from '@/models/entity';
import SearchForm from '@/components/search-form';

const baseNavItems = [
  {
    href: '/',
    text: 'Home',
  },
  {
    href: '/programs',
    text: 'Programs',
  },
  {
    href: '/groups',
    text: 'Groups',
  },
  {
    href: '/contacts',
    text: 'Contacts',
  },
];

export default function GeneralLayoutHeader({ user }: Readonly<{ user: UserEntity | null; }>) {
  const path = usePathname();

  const searchParams = useSearchParams();

  const search = searchParams.get('search');

  const navItems = [ ...baseNavItems, user !== null ? { href: `/users/${user.id}`, text: 'Profile' } : { href: '/sign-in', text: 'Sign in' } ];

  return (
    <header className="fixed top-0 left-0 w-full bg-foreground border-b"> 
      <Link href="/" className="container mx-auto px-4 pt-4 flex gap-4 items-center justify-center">
        <div className="w-8 h-8 bg-orange-500"></div>
        <h1 className="font-bold text-primary text-xl md:text-3xl">
          <span>ST Matthew's Anglican Church</span>
          <span className="hidden md:inline"> (Nkpogwu Deanery)</span>
        </h1>
      </Link>

      <div className="container mx-auto px-4">
        <SearchForm value={search ?? ''} action="/search" placeholder="Search programs, groups and people" />
      </div>

      <nav className="container mx-auto px-4">
        <ul className="flex gap-2 items-center justify-between overflow-auto">

          {
            navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block p-1 text-nowrap font-semibold md:px-4 
                    ${((path.startsWith(item.href) && item.href !== '/') || path === item.href) 
                      ? 'bg-primary text-on-primary hover:bg-primary-variant' 
                      : 'bg-foreground text-primary hover:bg-gray-200'}`}
                >{ item.text }</Link>
              </li>
            ))
          }

        </ul>
      </nav>

    </header>
  )
}
