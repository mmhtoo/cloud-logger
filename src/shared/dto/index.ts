export type PaginationResult<T> = {
  contents: T[];
  hasNextPage: boolean;
  totalPage: number;
  totalData: number;
};
