export default function GenericTable<T>(
  { items, headings, renderItem }: Readonly<{ items: T[]; headings: string[];  renderItem: (item: T) => React.ReactNode; }>
) {
  return (
    <div className="my-4 w-full overflow-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            { headings.map((h) => <th key={h} className="p-2 border border-primary bg-primary text-on-primary">{ h }</th>) }
          </tr>
        </thead>

        <tbody>{ items.map(renderItem) }</tbody>

      </table>
    </div>
  );
}
