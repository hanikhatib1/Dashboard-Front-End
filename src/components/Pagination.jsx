import React from "react";
import PropTypes from "prop-types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomPagination = ({ page = 1, total_pages = 1, setPage }) => {
  if (total_pages <= 1) return null;

  const pagesToShow = () => {
    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, page - half);
    let end = Math.min(total_pages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = pagesToShow();

  return (
    <Pagination className="my-4">
      <PaginationContent className="flex gap-2">
        <PaginationItem className="mx-2">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) setPage(page - 1);
            }}
            className={`${
              page === 1 ? "pointer-events-none opacity-50" : ""
            } w-max px-2 border rounded-[20px] border-[#1A73E8] !cursor-pointer`}
          >
            <ChevronLeft className="mr-1" />
            Previous
          </PaginationLink>
        </PaginationItem>

        {visiblePages[0] > 1 && (
          <>
            <PaginationItem className="rounded-[20px]">
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(1);
                }}
                className="border !rounded-[20px] border-[#1A73E8] !cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
            {visiblePages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {visiblePages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage(p);
              }}
              isActive={p === page}
              className={`border !rounded-[20px] border-[#1A73E8] !cursor-pointer
                ${p === page ? "bg-[#1A73E8] text-white" : ""}
              `}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {visiblePages[visiblePages.length - 1] < total_pages && (
          <>
            {visiblePages[visiblePages.length - 1] < total_pages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(total_pages);
                }}
                className="border !rounded-[20px] border-[#1A73E8] !cursor-pointer"
              >
                {total_pages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem className="mx-2">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < total_pages) setPage(page + 1);
            }}
            className={`border !rounded-[20px] border-[#1A73E8] !cursor-pointer w-max px-2 ${
              page === total_pages ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Next
            <ChevronRight className="ml-1" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

CustomPagination.propTypes = {
  page: PropTypes.number.isRequired,
  total_pages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default CustomPagination;
