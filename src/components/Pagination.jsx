import React from "react";
import { Button } from "./ui/button";
import PropTypes from "prop-types";

const Pagination = ({ page = 1, total_pages = 1, setPage }) => {
  if (page === 1 && page === total_pages) return null;
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`text-primary !opacity-100 ${page === 1 ? "!opacity-50" : ""}`}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === total_pages}
          className={`text-primary !opacity-100 ${page === total_pages ? "!opacity-50" : ""}`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number,
  total_pages: PropTypes.number,
  setPage: PropTypes.func,
};

export default Pagination;
