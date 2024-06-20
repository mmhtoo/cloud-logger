import { PaginationResult } from '../dto';

export function mapToPaginationData<T>(param: {
  page: number;
  size: number;
  totalData: number;
  contents: T[];
}): PaginationResult<T> {
  const { page, size, totalData, contents } = param;
  // totalData is 10, size is 2 and totalPage is 5
  const totalPage = Math.ceil(totalData / Number(size));
  return {
    contents,
    totalData: totalData,
    totalPage,
    hasNextPage: page < totalPage, // current is less than total page,
  };
}
