import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request,
     {params}:{params: {chapterId: string}}) {
try {
    const { userId} = auth()
    const { url } = await req.json()

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

    const chapterOwner = await db.chapter.findUnique({
        where: {id: params.chapterId}
    })
    
    if (!chapterOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
     }

    const video = await db.video.create({
        data: {
            url,
            chapterId: params.chapterId
        }
    })

  return NextResponse.json(video)
} catch (error) {
    console.log("CREATE_VIDEO", error);
    return new NextResponse("Internal Error", { status: 500 });
}
}