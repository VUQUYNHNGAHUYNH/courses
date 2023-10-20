import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { chapterId: string, exerciseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapterOwner = await db.chapter.findUnique({
        where: {
            id: params.chapterId
        }
    })
    if (!chapterOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

   const exercise = await db.fillInExercise.delete({
    where: {
        chapterId: params.chapterId,
        id: params.exerciseId
    }
   })

    return NextResponse.json(exercise);
  } catch (error) {
    console.log("DELETE_EXERCISE_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
