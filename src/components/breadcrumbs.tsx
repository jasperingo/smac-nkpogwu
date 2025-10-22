'use client'

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs({ excludeRoot }: Readonly<{ excludeRoot?: boolean; }>) {
  const path = usePathname();

  const crumbs = path.substring(1).split('/');

  const root = crumbs[0];

  if (excludeRoot) {
    crumbs.shift();
  }

  return (
    <h2 className="mb-4 font-bold text-lg md:text-2xl">

      <ul className="flex gap-2 items-center flex-wrap">
        { 
          crumbs.map((p, i) => (
            <li key={p + i} className="flex gap-2 items-center">
              <Link href={(excludeRoot ? '/' + root : '') + crumbs.slice(0, i + 1).reduce((pv, cv) => pv + '/' + cv, '')}>
                { p.substring(0, 1).toUpperCase().concat(p.substring(1).toLowerCase()).replace('-', ' ') }
              </Link>

              { i < crumbs.length - 1 && <ChevronRight /> }
            </li>
          ))
        }
      </ul>

    </h2>
  );
}
