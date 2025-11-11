export default function SimpleDescriptionList(
  { 
    items, 
    caption,
    insideForm = false,
    itemsSpacing = 'none',
  }: Readonly<{ 
    caption?: string; 
    itemsSpacing?: 'none' | 'md' | 'lg';
    insideForm?: boolean; 
    items: { term: string; details: string | number | boolean | React.ReactNode; displayRow?: boolean; remove?: boolean; }[]; 
  }>
) {
  return (
    <dl className={insideForm ? 'mb-4 border p-2 col-span-full' : ''}>
      { caption && <div className="font-bold">{ caption }</div> }

      {
        items.map((item) => item.remove === true ? null : (
          <div 
            key={item.term} 
            className={`
              ${item.displayRow === true ? 'flex gap-2 items-center' : ''} 
              ${itemsSpacing === 'lg' ? 'mb-4' : (itemsSpacing === 'md' ? 'mb-2' : '')}
            `}
          >
            <dt className="font-bold">{ item.term }</dt>
            <dd>{ item.details }</dd>
          </div>
        ))
      }
    </dl>
  );
}
