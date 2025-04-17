import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppealsTable = ({ columns, appeals }) => {
  const table = useReactTable({
    data: appeals.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: appeals.pagination.total_pages,
    state: {
      pagination: appeals.pagination,
    },
    onPaginationChange: (state) => {
      table.setPageIndex(state.pageIndex);
    },
  });
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-x-scroll">
      <Table className="w-max min-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-[#E6EFF5]">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="font-bold text-[20px] leading-[30px] text-[#4693D6]"
                  >
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-[#E6EFF5] text-dark font-[500] text-[16px] leading-[24px]"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id} className={`h-5 text-start `}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

AppealsTable.propTypes = {
  columns: PropTypes.array.isRequired,
  appeals: PropTypes.object.isRequired,
};

export default AppealsTable;
