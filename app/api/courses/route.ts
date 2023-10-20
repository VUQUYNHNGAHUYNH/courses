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

        const {title, category} = await req.json()
    
        const course = await db.course.create({
            data: {
                userId,
                title,
                category
            }
          })

        return NextResponse.json(course);
    } catch (error) {
        console.log('Error creating course:', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
  }


