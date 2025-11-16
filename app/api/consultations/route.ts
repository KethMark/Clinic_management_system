import { db } from "@/db";
import { consultations, students } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const data = await auth();

    if (!data || !data.user || !data.user.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const {
      studentId,
      date,
      symptoms,
      diagnosis,
      treatmentGiven,
      medRxDispensed,
      attendingStaff,
      notes,
    } = await req.json();

    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student || student.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    if (student[0].userId !== data.user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to this student" },
        { status: 403 }
      );
    }

    await db.insert(consultations).values({
      studentId,
      date: new Date(date),
      symptoms,
      diagnosis,
      treatmentGiven,
      medRxDispensed,
      attendingStaff,
      notes,
    });

    return NextResponse.json({
      message: "Consultation has been added successfully.",
    });
  } catch (error) {
    console.error("Unable to create consultation:", error);
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 400 }
    );
  }
}