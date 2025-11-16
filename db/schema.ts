import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccountType>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const students = mysqlTable("students", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  fullName: varchar("full_name", { length: 255 }).notNull(),
  grade: varchar("grade", { length: 50 }),
  section: varchar("section", { length: 50 }),
  age: int("age"),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]).notNull(),

  bloodType: varchar("blood_type", { length: 10 }),
  allergies: text("allergies"),
  medicalHistory: text("medical_history"),
  emergencyContact: varchar("emergency_contact", { length: 255 }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const medicines = mysqlTable("medicines", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),

  medicineFullName: varchar("medicine_full_name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  quantity: int("quantity"),
  unit: varchar("unit", { length: 50 }),
  expiresDate: timestamp("expires_date", { mode: "date" }),
  status: mysqlEnum("status", [
    "Active",
    "Expired",
    "Used",
    "Unavailable",
  ]).default("Active"),
  description: text("description"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const consultations = mysqlTable("consultations", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  studentId: varchar("studentId", { length: 255 })
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),

  date: timestamp("date", { mode: "date" }).notNull(),
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  treatmentGiven: text("treatment_given"),
  medRxDispensed: text("medrx_dispensed"),
  attendingStaff: varchar("attending_staff", { length: 255 }),
  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
