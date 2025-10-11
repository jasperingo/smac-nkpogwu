'use client'

import { 
  Award, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Shapes, 
  Users, 
  X 
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Session } from '@/utils/session';

const navItems = [
  {
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    text: "Dashboard",
  },
  {
    icon: Users,
    href: '/admin/users',
    text: "Users",
  },
  {
    icon: Shapes,
    href: '/admin/groups',
    text: "Groups",
  },
  {
    icon: Award,
    href: '/admin/roles',
    text: "Roles",
  },
  {
    icon: LogOut,
    href: '/admin/sign-out',
    text: "Sign out",
  },
];

export default function AdminLayoutHeader({ session }: Readonly<{ session: Session | null; }>) {
  const path = usePathname();

  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => setShowNav(!showNav);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-foreground border-b"> 
        <div className="container mx-auto p-4 flex gap-4 items-center">
          { session && <button className="text-primary hover:bg-primary-variant lg:hidden" onClick={toggleNav}>
            <Menu size={32} />
            <span className="sr-only">Optn side navigation</span>
          </button> }

          <div className="w-8 h-8 bg-orange-500"></div>
          <h1 className="font-bold text-primary text-xl sm:hidden">SMAC</h1>
          <h1 className="font-bold text-primary text-xl hidden sm:block md:text-3xl">ST Matthew's Anglican Church</h1>
        </div>
      </header>

      { session && <>
        <div className={`fixed w-full left-0 top-0 h-full bg-color-on-surface/[.6] lg:hidden ${!showNav && 'hidden'}`}></div>

        <nav
          className={`fixed transition-all duration-300 w-3/4 top-0 h-full overflow-auto bg-foreground border-r 
            lg:h-[calc(100%-4.5rem)] lg:left-0 lg:w-72 lg:top-auto ${showNav ? 'left-0' : '-left-full'}`}
        >

          <button className="float-right m-2 text-primary hover:bg-primary-variant lg:hidden" onClick={toggleNav}>
            <X size={32} />
            <span className="sr-only">Close side navigation</span>
          </button>

          <ul className="py-2 px-4 clear-right">

            {
              navItems.map((item) => (
                <li className="mb-4" key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex gap-2 items-center p-2 border border-primary font-bold  
                      ${path.startsWith(item.href) ? 'bg-primary text-on-primary hover:bg-primary-variant' : 'bg-foreground text-primary hover:bg-gray-200'}`}
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
      </> }
    </>
  );
}
