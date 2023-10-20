import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

  export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
    try {
      const { userId } = auth();
      const values  = await req.json();
  
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
  
      const chapter = await db.chapter.update({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
        data: {
          ...values,
        }
      });
  
      return NextResponse.json(chapter);
    } catch (error) {
      console.log("[UPDATE_CHAPTER_ID]", error);
      return new NextResponse("Internal Error", { status: 500 }); 
    }
  }


export async function DELETE(    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }){
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
        }
      })

      if (!chapter) {
        return new NextResponse("Not found", { status: 404 });
      }

      const deletedChapter = await db.chapter.delete({
        where: {id: params.chapterId}
      })

      // find published chapter in the course
      const publishedChapterInCourse = await db.chapter.findMany({
        where: {
            courseId: params.courseId, 
            isPublish:true}
      })

       // If no published chapters are found, update the 'isPublish' status of the course to false
      if(!publishedChapterInCourse.length){
        await db.course.update({
            where: {id: params.courseId},
            data:{
                isPublish: false
            }
        })
      }

      return NextResponse.json(deletedChapter)
} catch (error) {
    console.log("[DELETE_CHAPTER_ID]", error);
      return new NextResponse("Internal Error", { status: 500 }); 
}
} 