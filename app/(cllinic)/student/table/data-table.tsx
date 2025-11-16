"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import z from "zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentSchema } from "@/components/dashboard";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { AddMedicalModal } from "@/components/addMedical";
import { AddConsultationModal } from "@/components/addConsultation";

export interface DataTableMeta<TData> {
  editingRowId: string | null;
  setEditingRowId: (id: string | null) => void;
  onEdit: (row: Row<TData>) => void;
  onCancel: (rowId: string) => void;
  onSave: (row: Row<TData>) => void;
  updateEditedRowData: (rowId: string, columnId: string, value: string) => void;
  editedRowData: Record<string, Partial<TData>>;
  onAddMedical: (student: TData) => void;
  onConsultation: (student: TData) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends z.infer<typeof studentSchema>, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [editedRowData, setEditedRowData] = React.useState<
    Record<string, Partial<TData>>
  >({});

  //Handle medical
  const [isAddMedicalModalOpen, setIsAddMedicalModalOpen] =
    React.useState(false);

  const [selectedStudentMedical, setSelectedStudentMedical] = React.useState<TData | null>(
    null
  );

  //handle consultation
  const [isAddConsultationModalOpen, setIsAddConsultationModalOpen] =
    React.useState(false);


  const [selectedStudentConsultation, setSelectedStudentConsultation] = React.useState<TData | null>(
    null
  );

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["student"],
    mutationFn: async (data: z.infer<typeof studentSchema>) => {
      const res = await axios
        .put(`/api/clinic/${data.id}`, data)
        .then((res) => res.data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Clinic"] });
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      editingRowId,
      setEditingRowId,
      editedRowData,
      setEditedRowData,

      onEdit: (row) => {
        setEditingRowId(row.id);
        setEditedRowData((prev) => ({
          ...prev,
          [row.id]: { ...row.original },
        }));
      },

      onCancel: (rowId) => {
        setEditingRowId(null);
        setEditedRowData((prev) => {
          const newEditedData = { ...prev };
          delete newEditedData[rowId];
          return newEditedData;
        });
      },

      onSave: (row) => {
        const updatedData = editedRowData[row.id];
        if (updatedData) {
          toast.promise(mutateAsync({ ...row.original, ...updatedData }), {
            loading: "Updating...",
            success: (data) => data.text,
            error: (data) => data.error,
          });
        }
      },

      updateEditedRowData: (rowId, columnId, value) => {
        setEditedRowData((prev) => ({
          ...prev,
          [rowId]: {
            ...prev[rowId],
            [columnId]: value,
          },
        }));
      },

      onAddMedical: (student) => {
        setSelectedStudentMedical(student);
        setIsAddMedicalModalOpen(true);
      },

      onConsultation(student) {
        setSelectedStudentConsultation(student)
        setIsAddConsultationModalOpen(true)
      },
    } as DataTableMeta<TData>,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <DataTableToolbar table={table} />
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
        <DataTablePagination table={table} />
      </div>
      {selectedStudentMedical && (
        <AddMedicalModal
          student={selectedStudentMedical}
          isOpen={isAddMedicalModalOpen}
          onClose={() => {
            setIsAddMedicalModalOpen(false);
            setSelectedStudentMedical(null);
          }}
        />
      )}
      
      {selectedStudentConsultation && (
        <AddConsultationModal
          student={selectedStudentConsultation}
          isOpen={isAddConsultationModalOpen}
          onClose={() => {
            setIsAddConsultationModalOpen(false);
            setSelectedStudentConsultation(null);
          }}
        />
      )}
    </>
  );
}
