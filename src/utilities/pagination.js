export const getPageRange = (currentPage, totalPages) => {
  const delta = 2; // Number of pages to show on each side of current page
  const range = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // First page
      i === totalPages || // Last page
      (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "...") {
      range.push("...");
    }
  }

  return range;
};
export const calculatePagination = (items, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return {
    currentItems,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
  };
};
