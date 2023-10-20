import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
     {params}:{params: {courseId: string;chapterId: string}}) {
try {
    const { userId} = auth()
    const { word, meaning } = await req.json()

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

    const chapterOwner = await db.chapter.findUnique({
        where: {id: params.chapterId}
    })
    
    if (!chapterOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
     }

    const quiz = await db.quiz.create({
        data: {
            word,
            meaning,
            chapterId: params.chapterId
    }
  })

  return NextResponse.json(quiz)
} catch (error) {
    console.log("CREATE_QUIZ", error);
    return new NextResponse("Internal Error", { status: 500 });
}
}