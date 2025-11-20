import { z } from "zod";

export interface Medicine {
  id: string;
  studentId: string;
  medicineFullName: string;
  type: string | null;
  quantity: number | null;
  unit: string | null;
  expiresDate: string | null; 
  status: "Active" | "Expired" | "Used" | "Unavailable";
  description: string | null;
  createdAt: string;
}

export interface Consultation {
  id: string;
  studentId: string;
  date: string; 
  symptoms: string | null;
  diagnosis: string | null;
  treatmentGiven: string | null;
  medRxDispensed: string | null;
  attendingStaff: string | null;
  notes: string | null;
  createdAt: string;
}

export const medicineFormSchema = z.object({
  medicineFullName: z.string().min(1, "Medicine name is required"),
  type: z.string().optional(),
  quantity: z.string().min(0, "Quantity must be 0 or more"),
  unit: z.string().optional(),
  expiresDate: z.date().optional(),
  status: z
    .enum(["Active", "Expired", "Used", "Unavailable"])
    .default("Active"),
  description: z.string().optional(),
});

export const consultationFormSchema = z.object({
  date: z.date({ message: "Date is required" }),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentGiven: z.string().optional(),
  medRxDispensed: z.string().optional(),
  attendingStaff: z.string().optional(),
  notes: z.string().optional(),
});

export const studentSchema = z.object({
  id: z.string().optional(),
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  grade: z.string().min(1, "Grade is required."),
  section: z.string().min(1, "Section is required."),
  age: z
    .string()
    .min(1, { message: "Age is required" })
    .regex(/^\d+$/, { message: "Age must be a valid number" })
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return num > 0 && num < 150;
      },
      {
        message: "Age must be between 1 and 149",
      }
    ),
  gender: z.string().min(4, "Gender is required."),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export type StudentFormValues = z.infer<typeof studentSchema>;