import Link from 'next/link';

export default function MenuList({ items }: Readonly<{ items: { href: string; text: string; }[]; }>) {
  return (
    <ul className="flex gap-2 items-center flex-wrap justify-end">
      { 
        items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              active-class="text-color-secondary"
              className="block p-2 border border-primary bg-primary text-on-primary hover:bg-primary-variant"
            >{ i.text }</Link>
          </li>
        ))
      }
    </ul>
  );
}
