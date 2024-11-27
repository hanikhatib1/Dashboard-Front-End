import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import React from "react";

const InvoicesTable = ({ columns, invoices }) => {
  const table = useReactTable({
    data: invoices.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="w-full">
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-[#E6EFF5] !bg-[#53ABF9] !bg-opacity-20"
            >
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

InvoicesTable.propTypes = {
  columns: PropTypes.array.isRequired,
  invoices: PropTypes.object.isRequired,
};

export default InvoicesTable;
