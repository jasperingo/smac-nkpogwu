export default function SimpleDescriptionList(
  { items, caption }: Readonly<{ items: { term: string; details: string | number | boolean | React.ReactNode; displayRow?: boolean; }[]; caption?: string; }>
) {
  return (
    <dl>
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
