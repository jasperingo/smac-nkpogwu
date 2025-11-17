'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { CalendarFold, Home, LogIn, LogOut, Menu, Phone, Shapes, User, X } from 'lucide-react';
import { UserEntity } from '@/models/entity';
import SearchForm from '@/components/search-form';

const baseNavItems = [
  {
    icon: Home,
    href: '/',
    text: 'Home',
  },
  {
    icon: CalendarFold,
    href: '/programs',
    text: 'Programs',
  },
  {
    icon: Shapes,
    href: '/groups',
    text: 'Groups',
  },
  {
    icon: Phone,
    href: '/contacts',
    text: 'Contacts',
  },
];

export default function GeneralLayoutHeader({ user }: Readonly<{ user: UserEntity | null; }>) {
  const path = usePathname();

  const searchParams = useSearchParams();

  const [showNav, setShowNav] = useState(false);
  
  const toggleNav = () => setShowNav(!showNav);

  const search = searchParams.get('search');

  const navItems = [ 
    ...baseNavItems, 
    ...(user !== null 
      ? [ { icon: User, href: `/users/${user.id}`, text: 'Profile' }, { icon: LogOut, href: '/sign-out', text: 'Sign out' } ]
      : [ { icon: LogIn, href: '/sign-in', text: 'Sign in' } ] )
  ];

  return (
    <header className="fixed z-50 top-0 left-0 w-full bg-foreground border-b"> 
      <Link href="/" className="container mx-auto px-4 pt-4 flex gap-2 items-center justify-center">
        <Image 
          width="20" 
          height="20" 
          className="w-10 h-10"
          alt="Logo iamge"
          src="/images/logo.png"
        />

        <h1 className="font-bold text-primary text-xl md:text-3xl">
          <span>ST Matthew's Anglican Church</span>
          <span className="hidden md:inline"> (Nkpogwu Deanery)</span>
        </h1>
      </Link>

      <div className="container mx-auto px-4 flex gap-2 items-center">
        <button className="text-primary border p-0.5 border-primary hover:bg-primary-variant lg:hidden" onClick={toggleNav}>
          <Menu size={32} />
          <span className="sr-only">Optn side navigation</span>
        </button> 

        <SearchForm value={search ?? ''} action="/search" placeholder="Search programs, groups and people" />
      </div>

      <div>
        <div className={`fixed w-full left-0 top-0 h-full bg-black/[.4] lg:hidden ${!showNav && 'hidden'}`}></div>
        
        <nav
          className={`fixed transition-all duration-300 w-3/4 top-0 h-full overflow-auto bg-foreground border-r 
            lg:static lg:border-0 lg:container lg:mx-auto lg:px-4 ${showNav ? 'left-0' : '-left-full'}`}
        >

          <button className="float-right m-2 text-primary hover:bg-primary-variant lg:hidden" onClick={toggleNav}>
            <X size={32} />
            <span className="sr-only">Close side navigation</span>
          </button>

          <ul className="py-2 px-4 clear-right lg:py-0 lg:flex lg:gap-2 lg:items-center lg:justify-between lg:overflow-auto">

            {
              navItems.map((item) => (
                <li key={item.href} className="mb-4 lg:mb-0">
                  <Link
                    href={item.href}
                    className={`flex gap-2 items-center p-2 text-nowrap font-semibold md:px-4 
                      ${((path.startsWith(item.href) && item.href !== '/') || path === item.href) 
                        ? 'bg-primary text-on-primary hover:bg-primary-variant' 
                        : 'bg-foreground text-primary hover:bg-gray-200'}`}
                    onClick={toggleNav}
                  >
                    <item.icon />
                    <span>{ item.text }</span>
                  </Link>
                </li>
              ))
            }

          </ul>
        </nav>
      </div>

    </header>
  )
}
