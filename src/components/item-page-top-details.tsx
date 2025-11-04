import Image from 'next/image';

export default function ItemPageTopDetails({ title, id, imageUrl, imageAlt }: Readonly<{ title: string; id: number; imageUrl?: string; imageAlt?: string; }>) {
  return (
    <div className="bg-foreground p-4 mb-4 md:flex md:gap-4 md:items-center md:justify-center">
      {
        imageUrl && (
          <Image 
            src={imageUrl} 
            alt={imageAlt ?? `${title} image`} 
            width="64" 
            height="64" 
            className="block w-24 h-24 mx-auto mb-2 border border-gray-400 rounded-full md:m-0" 
          />
        )
      }

      <div className="text-center">
        <div className="mb-2 font-bold text-lg md:text-xl">{ title }</div>

        <div className="w-fit mx-auto py-1 px-4 text-on-primary bg-primary-variant">ID: { id }</div>
      </div>
    </div>
  );
}
