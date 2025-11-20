import { Consultation, Medicine, StudentFormValues } from "@/types";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Medical } from "@/components/medical";
import { Consultations } from "@/components/consultation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions2<TData extends StudentFormValues>({
  row,
}: DataTableRowActionsProps<TData>) {
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
  
  return (
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
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Medical data={medicines || []}/>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Consultations data={consultations || []}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
