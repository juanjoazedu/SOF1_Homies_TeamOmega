import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 10;

export function usePagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    const goToPage = (nextPage: number) => {
        setPage(Math.min(Math.max(nextPage, 1), totalPages));
    };

    return {
        items: paginatedItems,
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        nextPage: () => goToPage(currentPage + 1),
        previousPage: () => goToPage(currentPage - 1),
        goToPage,
    };
}
