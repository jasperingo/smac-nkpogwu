import Link from 'next/link';

export default function ActionLink({ href, children }: Readonly<{ href: string; children: React.ReactNode; }>) {
  return (
    <Link 
      href={href}
      className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
    >{ children }</Link>
  );
}
