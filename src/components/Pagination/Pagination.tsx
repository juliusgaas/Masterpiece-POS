interface PaginationProps {
    page: number;
    onPrevious: () => void;
    onNext: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
}

export default function Pagination({
    page,
    onPrevious,
    onNext,
    hasPrevious = true,
    hasNext = true,
}: PaginationProps) {
    return (
        <div className="d-flex justify-content-between align-items-center mt-3" style={{
            width: '200px',
            transform: 'scale(.7)',
        }}>

            <button
                className="btn btn-outline-secondary"
                disabled={!hasPrevious}
                onClick={onPrevious}
            >
                Previous
            </button>

            <span>
                Page {page}
            </span>

            <button
                className="btn btn-primary"
                disabled={!hasNext}
                onClick={onNext}
            >
                Next
            </button>

        </div>
    );
}