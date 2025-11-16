"use client";

import { Row, Table } from "@tanstack/react-table";
import { MoreHorizontal, Check, X } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableMeta } from "./data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { studentSchema } from "@/components/dashboard";
import { Consultation, Medicine } from "@/types";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData extends z.infer<typeof studentSchema>>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const queryClient = useQueryClient();
  const meta = table.options.meta as DataTableMeta<TData>;

  const isEditing = meta.editingRowId === row.id;
  const student = row.original;

  const { data: medicines } = useQuery({
    queryKey: ["medicines", student.id],
    queryFn: async (): Promise<Medicine[]> => {
      const res = await axios.get(`/api/medicines/${student.id}`);
      return res.data;
    },
  });

  const { data: consultations } = useQuery({
    queryKey: ["consultations", student.id],
    queryFn: async (): Promise<Consultation[]>=> {
      const res = await axios.get(`/api/consultations/${student.id}`);
      return res.data;
    },
  });

  const hasMedicines = medicines && medicines.length > 0;
  const hasConsultations = consultations && consultations.length > 0;

  const { mutateAsync } = useMutation({
    mutationFn: async (data: Pick<z.infer<typeof studentSchema>, "id">) => {
      const res = await axios
        .delete(`/api/student/${data.id}`)
        .then((res) => res.data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher_student"] });
    },
  });

  function handleDelete() {
    toast.promise(mutateAsync({ id: student.id }), {
      loading: "Deleting...",
      success: (data) => data.text,
      error: (data) => data.error,
    });
  }

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
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onSelect={() => meta.onEdit(row)}>
              Edit
            </DropdownMenuItem>
            
            {!hasMedicines && (
              <DropdownMenuItem onSelect={() => meta.onAddMedical(student)}>
                Add Medical
              </DropdownMenuItem>
            )}
            
            {hasMedicines && (
              <DropdownMenuItem onSelect={() => meta.onViewMedical(medicines)}>
                View Medical 
              </DropdownMenuItem>
            )}
            
            {!hasConsultations && (
              <DropdownMenuItem onSelect={() => meta.onAddConsultation(student)}>
                Add Consultation
              </DropdownMenuItem>
            )}
            
            {hasConsultations && (
              <DropdownMenuItem onSelect={() => meta.onViewConsultation(consultations)}>
                View Consultation 
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}