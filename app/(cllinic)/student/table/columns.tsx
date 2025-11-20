"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Input } from "@/components/ui/input";
import { DataTableMeta } from "./data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentGender } from "./data/data";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StudentFormValues } from "@/types";
import { DataTableRowActions2 } from "./data-table-row-actions2";

export const columns: ColumnDef<StudentFormValues>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      return isEditing ? (
        <Input
          value={
            meta.editedRowData[row.id]?.fullName ?? row.getValue("fullName")
          }
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span>{row.getValue("fullName")}</span>
      );
    },
  },

  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      return isEditing ? (
        <Input
          value={meta.editedRowData[row.id]?.grade ?? row.getValue("grade")}
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span>{row.getValue("grade")}</span>
      );
    },
  },

  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      return isEditing ? (
        <Input
          value={meta.editedRowData[row.id]?.section ?? row.getValue("section")}
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span>{row.getValue("section")}</span>
      );
    },
  },

  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      return isEditing ? (
        <Input
          value={meta.editedRowData[row.id]?.age ?? row.getValue("age")}
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span>{row.getValue("age")}</span>
      );
    },
  },

  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      if (isEditing) {
        return (
          <Select
            value={meta.editedRowData[row.id]?.gender ?? row.getValue("gender")}
            onValueChange={(value) =>
              meta.updateEditedRowData(row.id, column.id, value)
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      const gender = StudentGender.find(
        (gender) => gender.value === row.getValue("gender")
      );

      if (!gender) {
        return null;
      }

      return (
        <div className="w-[100px]">
          <span>{row.getValue("gender")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "bloodType",
    header: "Blood Type",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      return isEditing ? (
        <Input
          value={
            meta.editedRowData[row.id]?.bloodType ?? row.getValue("bloodType")
          }
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span>{row.getValue("bloodType")}</span>
      );
    },
  },

  {
    accessorKey: "allergies",
    header: "Allergies",
    cell: ({ row }) => {
      const value = row.getValue("allergies") as string;
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span className="block max-w-[200px] truncate cursor-help">
                {value}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="max-w-md max-h-60 overflow-y-auto p-4"
            >
              <div className="whitespace-pre-wrap wrap-break-word font-normal text-sm">
                {value}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "medicalHistory",
    header: "Medical History",
    cell: ({ row }) => {
      const value = row.getValue("medicalHistory") as string;
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <span className="block max-w-[200px] truncate cursor-help">
                {value}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="max-w-md max-h-60 overflow-y-auto p-4"
            >
              <div className="whitespace-pre-wrap wrap-break-word font-normal text-sm">
                {value}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    accessorKey: "emergencyContact",
    header: "Emergency Contact",
    cell: ({ row, table, column }) => {
      const meta = table.options.meta as DataTableMeta<
        StudentFormValues
      >;
      const isEditing = meta.editingRowId === row.id;

      return isEditing ? (
        <Input
          value={
            meta.editedRowData[row.id]?.emergencyContact ??
            row.getValue("emergencyContact")
          }
          onChange={(e) =>
            meta.updateEditedRowData(row.id, column.id, e.target.value)
          }
          className="h-8"
        />
      ) : (
        <span>{row.getValue("emergencyContact")}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
  {
    id: "actions-secondary",
    cell: ({ row }) => <DataTableRowActions2 row={row}/>
  }
];
