import React from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { metadataSchema } from '@/lib/meta-data-schema';

export function PaginationBar({
  metadata: { totalPages, currentPage, totalCount },
  onPageChange,
}: {
  metadata: z.infer<typeof metadataSchema>;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const summary = (
    <p className="text-sm font-medium text-gray-600">
      Page {currentPage} of {totalPages} ({totalCount} items)
    </p>
  );

  if (totalPages <= 1) {
    return <div className="flex items-center justify-between">{summary}</div>;
  }

  if (totalPages === 2) {
    return (
      <div className="flex items-center justify-between">
        {summary}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (totalPages <= 6) {
    return (
      <div className="flex items-center justify-between">
        {summary}
        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? 'default' : 'outline'}
              size="sm"
              className="text-center font-mono"
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const getPagination = () => {
    const pages = [];
    const range = 2; // Number of pages to show on each side of the current page

    pages.push(1); // Always show first page

    if (currentPage - range > 2) {
      pages.push('...');
    }

    for (
      let i = Math.max(2, currentPage - range);
      i <= Math.min(totalPages - 1, currentPage + range);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + range < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      {summary}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageClick(currentPage - 1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {getPagination().map((page, index) => (
            <Button
              key={index}
              variant={
                typeof page !== 'number'
                  ? 'ghost'
                  : currentPage === page
                    ? 'default'
                    : 'outline'
              }
              className="text-center font-mono"
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageClick(currentPage + 1)}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
