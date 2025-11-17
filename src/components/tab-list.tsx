'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabList({ items, path = '' }: Readonly<{ path?: string; items: { href: string; text: string; remove?: boolean; }[]; }>) {
  const urlPath = usePathname();

  return (
    <ul className="mb-4 flex gap-2 items-center overflow-auto">
      { 
        items.map((i) => {
          if (i.remove === true) {
            return null;
          }

          const indexOfQuery = i.href.indexOf('?');

          const hrefNoQuery = indexOfQuery === -1 ? i.href : i.href.substring(0, indexOfQuery);

          const pathAndHref = path + hrefNoQuery;

          return (
            <li key={i.href}>
              <Link
                href={path + i.href}
                className={`block py-1 px-2 font-bold text-nowrap bg-foreground hover:bg-gray-100 
                  ${((urlPath.startsWith(pathAndHref) && pathAndHref !== path) || urlPath === pathAndHref) ? 'border-b-4 border-primary' : ''}`}
              >{ i.text }</Link>
            </li>
          );
        })
      }
    </ul>
  );
}
