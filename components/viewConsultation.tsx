import { Consultation } from "@/types";
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

export function ViewConsultationModal({
  consultations,
  isOpen,
  onClose,
}: {
  consultations: Consultation[];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Consultation Records</DialogTitle>
          <DialogDescription>
            Viewing all consultation records for this student
          </DialogDescription>
        </DialogHeader>

        {consultations && consultations.length > 0 ? (
          <FieldGroup>
            {consultations.map((consultation, index) => (
              <div key={consultation.id}>
                <FieldSet>
                  <FieldLegend>
                    {format(new Date(consultation.date), "PPP")}
                  </FieldLegend>

                    {consultation.attendingStaff && (
                      <Field>
                        <FieldLabel>Attending Staff</FieldLabel>
                        <Input
                          value={consultation.attendingStaff}
                          readOnly
                          disabled
                        />
                      </Field>
                    )}

                    {consultation.symptoms && (
                      <Field>
                        <FieldLabel>Symptoms</FieldLabel>
                        <Textarea
                          value={consultation.symptoms}
                          readOnly
                          disabled
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}

                    {consultation.diagnosis && (
                      <Field>
                        <FieldLabel>Diagnosis</FieldLabel>
                        <Textarea
                          value={consultation.diagnosis}
                          readOnly
                          disabled
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}

                    {consultation.treatmentGiven && (
                      <Field>
                        <FieldLabel>Treatment Given</FieldLabel>
                        <Textarea
                          value={consultation.treatmentGiven}
                          readOnly
                          disabled
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}

                    {consultation.medRxDispensed && (
                      <Field>
                        <FieldLabel>Medicine/Rx Dispensed</FieldLabel>
                        <Textarea
                          value={consultation.medRxDispensed}
                          readOnly
                          disabled
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}

                    {consultation.notes && (
                      <Field>
                        <FieldLabel>Additional Notes</FieldLabel>
                        <Textarea
                          value={consultation.notes}
                          readOnly
                          disabled
                          className="resize-none"
                          rows={3}
                        />
                      </Field>
                    )}

                    <FieldDescription>
                      Record created on{" "}
                      {format(new Date(consultation.createdAt), "PPP")}
                    </FieldDescription>
                </FieldSet>
                {index < consultations.length - 1 && <FieldSeparator />}
              </div>
            ))}
          </FieldGroup>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No consultation records found for this student.
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
