'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabList({ items, path = '' }: Readonly<{ path?: string; items: { href: string; text: string; }[]; }>) {
  const urlPath = usePathname();

  return (
    <ul className="mb-4 flex gap-2 items-center overflow-auto">
      { 
        items.map((i) => (
          <li key={i.href}>
            <Link
              href={path + i.href}
              className={`block py-1 px-2 font-bold text-nowrap bg-foreground hover:bg-gray-100 
                ${urlPath.startsWith(path + i.href) && path + i.href !== path || urlPath === path + i.href ? 'border-b-4 border-primary' : ''}`}
            >{ i.text }</Link>
          </li>
        ))
      }
    </ul>
  );
}
