import Image from 'next/image';

export default function ItemPageTopDetails(
  { 
    title, 
    id, 
    imageUrl, 
    imageAlt, 
    createdDatetime,
    updatedDatetime,
    children 
  }: Readonly<{ 
    title: string; 
    id?: number; 
    imageUrl?: string; 
    imageAlt?: string; 
    createdDatetime?: Date; 
    updatedDatetime?: Date | null; 
    children?: React.ReactNode; 
  }>
) {
  return (
    <div className="bg-foreground p-4 mb-4 md:flex md:gap-4 md:items-center md:justify-center">
      {
        imageUrl && (
          <Image 
            width="64" 
            height="64" 
            src={imageUrl} 
            alt={imageAlt ?? `${title} image`} 
            className="block w-24 h-24 mx-auto mb-2 border border-gray-400 rounded-full md:m-0" 
          />
        )
      }

      <div className="text-center">
        <div className="font-bold text-lg md:text-xl">{ title }</div>

        { id !== undefined && <div className="w-fit my-2 mx-auto py-1 px-4 text-on-primary bg-primary-variant">ID: { id }</div> }

        { createdDatetime !== undefined && <div className="w-fit my-2 mx-auto py-1 px-4 bg-gray-200">Created on: { createdDatetime.toLocaleString() }</div> }

        { 
          updatedDatetime !== undefined && updatedDatetime !== null && (
            <div className="w-fit my-2 mx-auto py-1 px-4 bg-gray-200">
              Last modified on: { updatedDatetime.toLocaleString() }
            </div> 
          )
        }

        { children }
      </div>
    </div>
  );
}
