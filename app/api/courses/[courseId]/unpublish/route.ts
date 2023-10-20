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
        } 
      });
    
      if (!course) {
        return new NextResponse("Not found", { status: 404 });
      }
      
    const unpublishCourse = await db.course.update({
        where: {id: params.courseId, userId},
        data:{
            isPublish: false
        }
    })

      return NextResponse.json(unpublishCourse)
    } catch (error) {
        console.log("[UNPUBLISH_COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 }); 
    }
  }