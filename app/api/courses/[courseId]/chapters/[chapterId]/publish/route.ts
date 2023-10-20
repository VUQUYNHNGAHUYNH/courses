import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
    try {
        const { userId } = auth();

      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId
        }
      });
  
      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            video: true,
            audio: true,
            quiz: true,
        }
    });
    
    if (!chapter || !chapter.title || (!chapter.audio.length && !chapter.video.length) || !chapter.quiz.length) {
        return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter =  await db.chapter.update({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        data: {
            isPublish: true
        }
      })

      return NextResponse.json(publishedChapter)
    } catch (error) {
        console.log("[PUBLISH_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 }); 
    }
  }