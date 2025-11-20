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
import { Medicine } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface MedicalProps {
  data: Medicine[];
}

export const Medical = ({ data }: MedicalProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-full cursor-pointer">View Medical</div>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Medical History</DrawerTitle>
          <DrawerDescription>
            List of medicines associated with this student.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <Table>
            {!data.length && (
              <TableCaption>No medical records found.</TableCaption>
            )}
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Qty / Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">
                    {med.medicineFullName}
                  </TableCell>
                  <TableCell>{med.type}</TableCell>
                  <TableCell>
                    {med.quantity} {med.unit}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        med.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {med.status}
                    </span>
                  </TableCell>
                  <TableCell>{med.description}</TableCell>
                  <TableCell className="text-right">
                    {med.expiresDate
                      ? new Date(med.expiresDate).toLocaleDateString()
                      : "N/A"}
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
