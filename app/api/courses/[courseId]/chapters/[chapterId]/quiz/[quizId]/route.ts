import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { chapterId: string, quizId: string } }
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

   const quiz = await db.quiz.delete({
    where: {
        chapterId: params.chapterId,
        id: params.quizId
    }
   })

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("DELETE_VIDEO_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
