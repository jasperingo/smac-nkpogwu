export default function GenericTable<T>(
  { 
    items, 
    headings, 
    renderItem, 
    emptyText = 'No item available' 
  }: Readonly<{ 
    items: T[]; 
    headings: Readonly<string[]>; 
    emptyText?: string; 
    renderItem: (item: T, index: number) => React.ReactNode; 
  }>
) {
  return (
    <div className="mb-4 w-full overflow-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            { headings.map((h) => <th key={h} className="p-2 border border-primary bg-primary text-on-primary">{ h }</th>) }
          </tr>
        </thead>

        <tbody>
          { items.map(renderItem) }
        
          { 
            items.length === 0 && (
              <tr>
                <td colSpan={headings.length} className="px-4 py-8 text-center border">{ emptyText }</td>
              </tr>
            )
          }
        </tbody>

      </table>
    </div>
  );
}
