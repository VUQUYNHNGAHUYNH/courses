import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { chapterId: string, videoId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapterOwner = await db.chapter.findUnique({
        where: {
            id: params.chapterId
        }
    })
    if (!chapterOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

   const video = await db.video.delete({
    where: {
        chapterId: params.chapterId,
        id: params.videoId
    }
   })

    return NextResponse.json(video);
  } catch (error) {
    console.log("DELETE_VIDEO_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
