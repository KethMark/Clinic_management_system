import { Medicine } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function ViewMedicalModal({
  medicines,
  isOpen,
  onClose,
}: {
  medicines: Medicine[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const getStatusColor = (status: Medicine["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "Expired":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      case "Used":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "Unavailable":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Medical Records</DialogTitle>
          <DialogDescription>
            Viewing all medicine records for this student
          </DialogDescription>
        </DialogHeader>

        {medicines && medicines.length > 0 ? (
          <FieldGroup>
            {medicines.map((medicine, index) => (
              <div key={medicine.id}>
                <FieldSet>
                  <div className="flex items-start justify-between mb-4">
                    <FieldLegend>{medicine.medicineFullName}</FieldLegend>
                    <Badge className={getStatusColor(medicine.status)}>
                      {medicine.status}
                    </Badge>
                  </div>

                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      {medicine.type && (
                        <Field>
                          <FieldLabel>Type</FieldLabel>
                          <Input value={medicine.type} readOnly disabled />
                        </Field>
                      )}

                      {medicine.quantity !== null && (
                        <Field>
                          <FieldLabel>Quantity</FieldLabel>
                          <Input
                            value={`${medicine.quantity} ${
                              medicine.unit || ""
                            }`}
                            readOnly
                            disabled
                          />
                        </Field>
                      )}
                    </div>

                    {medicine.expiresDate && (
                      <Field>
                        <FieldLabel>Expires Date</FieldLabel>
                        <Input
                          value={format(new Date(medicine.expiresDate), "PPP")}
                          readOnly
                          disabled
                        />
                      </Field>
                    )}

                    {medicine.description && (
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea
                          value={medicine.description}
                          readOnly
                          disabled
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}

                    <FieldDescription>
                      Added on {format(new Date(medicine.createdAt), "PPP")}
                    </FieldDescription>
                  </FieldGroup>
                </FieldSet>
                {index < medicines.length - 1 && <FieldSeparator />}
              </div>
            ))}
          </FieldGroup>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No medical records found for this student.
          </div>
        )}

        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
