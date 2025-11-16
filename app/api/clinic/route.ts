import { db } from "@/db";
import { students } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { desc, eq } from "drizzle-orm";

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
      fullName,
      grade,
      section,
      age,
      gender,
      bloodType,
      allergies,
      medicalHistory,
      emergencyContact,
    } = await req.json();

    await db.insert(students).values({
      fullName,
      grade,
      section,
      age,
      gender,
      bloodType,
      allergies,
      medicalHistory,
      emergencyContact,
      userId: data.user.id,
    });

    return NextResponse.json({
      message: "Student data has been created.",
    });
  } catch (error) {
    console.error("Unable to create a student data:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 400 }
    );
  }
}

export async function GET() {

  const data = await auth();

  if (!data || !data.user || !data.user.id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 400 }
    );
  }

  const res = await db
    .select()
    .from(students)
    .where(eq(students.userId, data.user.id))
    .orderBy(desc(students.createdAt));

  return NextResponse.json(res);
}