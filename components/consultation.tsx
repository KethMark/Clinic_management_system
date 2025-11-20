import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Consultation } from "@/types";

interface ConsultationsProps {
  data: Consultation[];
}

export const Consultations = ({ data }: ConsultationsProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full cursor-pointer">View Consultation</div>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Consultation Logs</DrawerTitle>
          <DrawerDescription>Past checkups and diagnoses.</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          <Table>
            {!data.length && (
              <TableCaption>No consultation records found.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Symptoms</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>MedRxDispensed</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Attending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((consult) => (
                <TableRow key={consult.id}>
                  <TableCell className="font-medium">
                    {new Date(consult.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {consult.symptoms || "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {consult.diagnosis || "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {consult.treatmentGiven || "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {consult.medRxDispensed || "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {consult.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {consult.attendingStaff || "Unknown"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
