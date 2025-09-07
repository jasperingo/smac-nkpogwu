import { generalConstraints } from '@/models/constraints';

export function calculatePaginationOffset(page: number, limit: number = generalConstraints.paginationLimit) {
  return (page - 1) * limit;
}

export function calculatePaginationPages(itemsCount: number, limit: number = generalConstraints.paginationLimit) {
  return Math.ceil(itemsCount / limit);
}

export function resolvePaginationParams(page?: string | number, limit: number = generalConstraints.paginationLimit) {
  if (page === undefined) {
    page = generalConstraints.paginationDefault;
  } else {
    page = Number(page);

    if (isNaN(page) || page < 1) {
      page = generalConstraints.paginationDefault;
    }
  }

  return { page, pageLimit: limit };
}
