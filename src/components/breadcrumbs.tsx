'use client'

import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs({ excludeRoot }: Readonly<{ excludeRoot?: boolean; }>) {
  const path = usePathname();

  const crumbs = path.substring(1).split('/');

  if (excludeRoot) {
    crumbs.shift();
  }

  return (
    <h2 className="mb-4 font-bold text-lg md:text-2xl">

      <ul className="flex gap-2 items-center flex-wrap">
        { 
          crumbs.map((p, i) => (
            <li key={p} className="flex gap-2 items-center">
              <span>{ p.substring(0, 1).toUpperCase().concat(p.substring(1).toLowerCase()) }</span>

              { i < crumbs.length - 1 && <ChevronRight /> }
            </li>
          ))
        }
      </ul>

    </h2>
  );
}
