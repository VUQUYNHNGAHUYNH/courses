import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();
    
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
        }
    
        const course = await db.course.update({
          where: {
            id: courseId,
            userId
          },
          data:{
            ...values
          }
        });
    
        return NextResponse.json(course);
      } catch (error) {
        console.log("Update course setup error", error);
        return new NextResponse("Internal Error", { status: 500 });
      }
  }

  export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
  ) {
    try {
        const { userId } = auth();
       
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
        }
    
        const course = await db.course.findUnique({
            where:{userId, id: params.courseId},
        })

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
          }

       const deletedCourse = await db.course.delete({
        where: {
            id: params.courseId
        }
       })
    
        return NextResponse.json(deletedCourse);
      } catch (error) {
        console.log("Delete course error", error);
        return new NextResponse("Internal Error", { status: 500 });
      }
  }