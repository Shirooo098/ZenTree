import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface TableProps<T> {
  items: T[];
  tableHeads: string[];
  tableRow: (item: T, index: number) => React.ReactNode;
}

function TableUI<T>({ tableHeads, tableRow, items }: TableProps<T>) {
  return (
    /* table */
    <Table >
      <TableHeader>
        <TableRow>
          {tableHeads.map((item, index) => {
            return <TableHead key={index} className="px-4 h-12 text-muted-foreground">{item}</TableHead>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody >
        {items && items.length > 0 ? (
          items.map((item, index) => tableRow(item, index))
        ) : (
          <TableRow>
            <TableCell colSpan={tableHeads.length}>No data found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableUI;