import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

import PropTypes from "prop-types";
import {
  ArrowUp,
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@/components/Pagination";

const ComparisonTable = ({ columns, data, hasPagination = true }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageCount = searchParams.get("page")
    ? Number(searchParams.get("page")) > 0
      ? Number(searchParams.get("page"))
      : 1
    : 1;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePages = (isPrev = false) => {
    navigate({
      pathname: "",
      search: `?page=${isPrev ? pageCount - 1 : pageCount + 1}`,
    });
  };

  return (
    <>
      <div className="relative w-full border rounded-[8px] max-h-[450px] overflow-y-auto">
        <Table className="relative">
          <TableHeader className="sticky  bg-white w-full top-0 mb-[200px]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="!rounded-[80px] !overflow-hidden"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[#054985] ">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-[#E6EFF5] text-dark font-[500] text-[16px] leading-[24px] ${
                    index === 0 ? "bg-[#53ABF9] bg-opacity-20" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-5 text-start ">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasPagination && (
        <>
          <div className="flex items-center justify-center px-2 mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0 !cursor-pointer"
                onClick={() => handlePages(true)}
                disabled={pageCount === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => handlePages(false)}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* <Pagination page={pageCount} setPage={} total_pages={} /> */}
        </>
      )}
    </>
  );
};

ComparisonTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  hasPagination: PropTypes.bool,
};

export default ComparisonTable;
