export default function SimpleDescriptionList(
  { 
    items, 
    caption,
    insideForm = false,
  }: Readonly<{ 
    caption?: string; 
    insideForm?: boolean; 
    items: { term: string; details: string | number | boolean | React.ReactNode; displayRow?: boolean; }[]; 
  }>
) {
  return (
    <dl className={insideForm ? 'mb-4 border p-2 col-span-full' : ''}>
      { caption && <div className="font-bold">{ caption }</div> }

      {
        items.map((item) => (
          <div key={item.term} className={item.displayRow === true ? 'flex gap-2 items-center' : ''}>
            <dt className="font-bold">{ item.term }</dt>
            <dd>{ item.details }</dd>
          </div>
        ))
      }
    </dl>
  );
}
