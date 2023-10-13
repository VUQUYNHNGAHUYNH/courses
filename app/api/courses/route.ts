import { formCourseSchema } from "@/app/validationSchema";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
  ) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        const body = await req.json()
    
        const validation = formCourseSchema.safeParse(body);
        if(!validation.success) {
            return NextResponse.json(validation.error.errors,{status: 400});
        }
       
        const course = await db.course.create({
            data: {
                userId,
                title: body.title,
                imageUrl: body.imageUrl,
                price: body.price,
                category: body.category,
                chapters: body.chapters
            }
          })

          console.log("New course created:", course); 

        return NextResponse.json(course);
    } catch (error) {
        console.log('Error creating course:', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
  }