interface PaginationProps {
  label: string;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const Pagination = ({
  label,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
}: PaginationProps) => (
  <div className="pagination" aria-label={label}>
    <button type="button" onClick={onPrevious} disabled={!hasPreviousPage}>
      {'<'}
    </button>

    <span className="pagination-info">
      Page {currentPage} of {totalPages}
    </span>

    <button type="button" onClick={onNext} disabled={!hasNextPage}>
      {'>'}
    </button>
  </div>
);