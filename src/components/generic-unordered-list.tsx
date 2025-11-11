export default function GenericUnorderedList<T>(
  { 
    items, 
    renderItem, 
    responsiveness = 'grid',
    emptyText = 'No item available' 
  }: Readonly<{ 
    items: T[]; 
    emptyText?: string; 
    responsiveness?: 'none' | 'grid';
    renderItem: (item: T, index: number) => React.ReactNode; 
  }>
) {
  return (
    <ul className={responsiveness === 'grid' ? 'mb-4 md:grid md:gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'mb-4'}>
      
      { items.map(renderItem) }
    
      { 
        items.length === 0 && (
          <li 
            className={`px-4 py-8 text-center border ${responsiveness === 'grid' ? 'md:col-span-2 xl:col-span-3 2xl:col-span-4' : ''}`}
          >{ emptyText }</li> 
        )
      }

    </ul>
  );
}
