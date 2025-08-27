'use client'

export default function AdminPageHeading({ text }: Readonly<{ text: string; }>) {
  return <h2 className="mb-4 font-bold text-lg md:text-2xl">{ text }</h2>;
}
