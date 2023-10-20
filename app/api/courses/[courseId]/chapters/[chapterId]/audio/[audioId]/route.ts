import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { chapterId: string, audioId: string } }
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

   const audio = await db.audio.delete({
    where: {
        chapterId: params.chapterId,
        id: params.audioId
    }
   })

    return NextResponse.json(audio);
  } catch (error) {
    console.log("DELETE_AUDIO_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
