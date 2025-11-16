import { db } from "@/db";
import { medicines, students } from "@/db/schema";
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

    const medicinesList = await db
      .select()
      .from(medicines)
      .where(eq(medicines.studentId, id));

    return NextResponse.json(medicinesList);
  } catch (error) {
    console.error("Unable to fetch medicines:", error);
    return NextResponse.json(
      { error: "Failed to fetch medicines" },
      { status: 500 }
    );
  }
}
