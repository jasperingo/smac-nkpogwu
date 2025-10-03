import Link from 'next/link';
import { ReactElement } from 'react';
import { PaginatedListDto } from '@/models/dto';

export default function PaginationList({ path, pagination, params }: { path: string; pagination: PaginatedListDto<any>, params: Map<string, string | undefined> }) {
  let queryParams = '';

  for (const [key, value] of params.entries()) {
    queryParams += value ? `&${key}=${value}` : '';
  }
  
  const pageLinks: ReactElement[] = [];

  for (let i = 1; i <= pagination.totalPages; i++) {
    pageLinks.push((
      <li key={i}>
        <Link 
          href={`${path}?page=${i}${queryParams}`} 
          className={`block px-2 py-1 border border-primary hover:bg-primary-variant ${i === pagination.currentPage && 'bg-primary text-on-primary'}`}
        >{ i }</Link>
      </li>
    ));
  }

  return (
    <ul className="flex gap-2 items-center flex-wrap">
      <li>
        { 
          pagination.currentPage > 1 
          ? (
              <Link 
                href={`${path}?page=${pagination.currentPage - 1}${queryParams}`} 
                className="block px-2 py-1 border border-primary hover:bg-primary-variant"
              >Previous</Link>
            )
          : (
              <span className="block px-2 py-1 border border-primary bg-gray-400">Previous</span>
            )
        }
      </li>

      { pageLinks }

      <li>
        { 
          pagination.currentPage < pagination.totalPages
          ? (
              <Link 
                href={`${path}?page=${pagination.currentPage + 1}${queryParams}`} 
                className="block px-2 py-1 border border-primary hover:bg-primary-variant"
              >Next</Link>
            )
          : (
              <span className="block px-2 py-1 border border-primary bg-gray-400">Next</span>
            )
        }
      </li> 
    </ul>
  );
}
