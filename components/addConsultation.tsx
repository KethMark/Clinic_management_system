"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { studentSchema } from "@/components/dashboard";
import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";

const consultationFormSchema = z.object({
  date: z.date({ message: "Date is required" }),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentGiven: z.string().optional(),
  medRxDispensed: z.string().optional(),
  attendingStaff: z.string().optional(),
  notes: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export function AddConsultationModal({
  student,
  isOpen,
  onClose,
}: {
  student: z.infer<typeof studentSchema>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      date: undefined,
      symptoms: "",
      diagnosis: "",
      treatmentGiven: "",
      medRxDispensed: "",
      attendingStaff: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ConsultationFormValues) => {
      const payload = {
        ...data,
        studentId: student.id,
      };
      const res = await axios.post("/api/consultations", payload);
      return res.data;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["Consultations"] });
      onClose();
    },
  });

  function onSubmit(values: ConsultationFormValues) {
    toast.promise(mutation.mutateAsync(values), {
      loading: "Submitting...",
      success: (data) => data.message,
      error: (error) => {
        return error?.response?.data?.message || "Something went wrong";
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Consultation Record</DialogTitle>
          <DialogDescription>
            Adding consultation for: <strong>{student.fullName}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Consultation Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attendingStaff"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Attending Staff</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nurse Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the symptoms..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter diagnosis..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatmentGiven"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Given</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe treatment provided..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medRxDispensed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine/Rx Dispensed</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List medications dispensed..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}