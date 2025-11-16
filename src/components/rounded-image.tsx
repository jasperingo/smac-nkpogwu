import Image from 'next/image';

export default function RoundedImage({ src, alt }: Readonly<{ src: string; alt?: string; }>) {
  return (
    <Image
      src={src} 
      width="64" 
      height="64" 
      alt={alt ?? `Image: ${src}`} 
      className="block w-16 h-16 border border-gray-400 rounded-full" 
    />
  );
}
