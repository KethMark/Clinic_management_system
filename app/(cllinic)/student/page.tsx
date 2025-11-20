"use client";

import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { StudentFormValues } from "@/types";

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["Clinic"],
    queryFn: async (): Promise<StudentFormValues[]> => {
      const res = await axios.get("/api/clinic").then((res) => res.data);
      return res;
    },
  });

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Spinner className="size-8" />
        </div>
      ) : (
        <>{data && <DataTable columns={columns} data={data} />}</>
      )}
    </>
  );
};

export default Page;
