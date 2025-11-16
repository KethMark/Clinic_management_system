import { db } from "@/db";
import { consultations, students } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET(
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

    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);

    if (
      !student ||
      student.length === 0 ||
      student[0].userId !== data.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const consultationsList = await db
      .select()
      .from(consultations)
      .where(eq(consultations.studentId, id));

    return NextResponse.json(consultationsList);
  } catch (error) {
    console.error("Unable to fetch consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}
