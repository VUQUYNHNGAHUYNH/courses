import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string;} }
  ) {
    try {
        const { userId } = auth();

      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const course = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId
        },
        include:{
            chapters:{
                orderBy: {
                    createdAt: "desc",
                  },
            }
        }
      });
  
      if (!course) {
        return new NextResponse("Not found", { status: 404 });
      }

    const publishedChapter =  course.chapters.some((chapter) => chapter.isPublish)

    if(!course.title || !course.category || !course.imageUrl || !publishedChapter){
        return new NextResponse("Missing required fields",{status: 400})
    }
    
    const publishCourse = await db.course.update({
        where: {id: params.courseId, userId},
        data:{
            isPublish: true
        }
    })

      return NextResponse.json(publishCourse)
    } catch (error) {
        console.log("[PUBLISH_COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 }); 
    }
  }