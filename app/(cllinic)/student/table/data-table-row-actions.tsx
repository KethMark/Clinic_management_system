"use client";

import { Row, Table } from "@tanstack/react-table";
import { Check, X, Plus } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableMeta } from "./data-table";
import { StudentFormValues } from "@/types";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData extends StudentFormValues>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const meta = table.options.meta as DataTableMeta<TData>;

  const isEditing = meta.editingRowId === row.id;
  const student = row.original;

  return (
    <div>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => meta.onSave(row)}
          >
            <Check className="size-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => meta.onCancel(row.id)}
          >
            <X className="size-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-muted size-8"
            >
              <Plus />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => meta.onEdit(row)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => meta.onAddMedical(student)}>
              Add Medical
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => meta.onAddConsultation(student)}>
              Add Consultation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}