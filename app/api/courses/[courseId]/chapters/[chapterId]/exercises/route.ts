import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
     {params}:{params: {chapterId: string}}) {
try {
    const { userId} = auth()
    const { content, fillInWords } = await req.json()

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

    const chapterOwner = await db.chapter.findUnique({
        where: {id: params.chapterId}
    })
    
    if (!chapterOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
     }

    const attachments = await db.fillInExercise.create({
        data: {
            content,
            fillInWords,
            chapterId: params.chapterId
        }
    })

  return NextResponse.json(attachments)
} catch (error) {
    console.log("CREATE_EXERCISES", error);
    return new NextResponse("Internal Error", { status: 500 });
}
}