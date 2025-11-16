import { auth } from "@/auth";
import { db } from "@/db";
import { students } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await auth();
    if (!data || !data.user || !data.user.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const { 
      fullName, 
      grade, 
      section, 
      age, 
      gender, 
      bloodType, 
      allergies, 
      medicalHistory, 
      emergencyContact 
    } = await req.json();

    await db
      .update(students)
      .set({
        fullName,
        grade,
        section,
        age,
        gender,
        bloodType,
        allergies,
        medicalHistory,
        emergencyContact,
      })
      .where(and(eq(students.id, id), eq(students.userId, data.user.id)));

    return NextResponse.json({
      text: "Student has been updated.",
      id,
    });
  } catch (error) {
    console.error("Unable to update Student:", error);
    return NextResponse.json(
      { error: "Failed to update Student." },
      { status: 500 }
    );
  }
}