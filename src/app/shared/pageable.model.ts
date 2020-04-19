export class Pageable<T> {
  content: Array<T>;
  page: Page;
}

export class Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}


