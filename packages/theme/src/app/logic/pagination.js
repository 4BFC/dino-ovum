export const MAX_PAGE_SIZE = 30;

export function viewportPageSize(availableHeight, headerHeight, rowHeight) {
  return Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Math.floor((availableHeight - headerHeight) / Math.max(1, rowHeight))),
  );
}

export function pagination(total, pageSize, requestedPage) {
  const size = Math.min(MAX_PAGE_SIZE, Math.max(1, pageSize));
  const pages = Math.max(1, Math.ceil(total / size));
  const requested = /^\d+$/.test(String(requestedPage)) ? Number(requestedPage) : 1;
  const page = Math.min(pages, Math.max(1, requested));
  const start = (page - 1) * size;
  const first = Math.max(1, Math.min(page - 2, pages - 4));
  return {
    page,
    pages,
    start,
    end: Math.min(total, start + size),
    numbers: Array.from({length: Math.min(5, pages)}, (_, i) => first + i),
  };
}
