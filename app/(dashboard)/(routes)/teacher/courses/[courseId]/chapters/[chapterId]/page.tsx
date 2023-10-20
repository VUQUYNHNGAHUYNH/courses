import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowBigLeftDash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import ChapterAcess from "./_components/chapter-access";
import ChapterAttachment from "./_components/chapter-attachment";
import ChapterAudio from "./_components/chapter-audio";
import ChapterExercise from "./_components/chapter-exercise";
import ChapterPublish from "./_components/chapter-publish";
import ChapterQuiz from "./_components/chapter-quiz";
import ChapterTitle from "./_components/chapter-title";
import ChapterVideo from "./_components/chapter-video";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: { id: params.chapterId, courseId: params.courseId },
    include: {
      quiz: {
        orderBy: {
          createdAt: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "asc",
        },
      },
      video: {
        orderBy: {
          createdAt: "asc",
        },
      },
      audio: {
        orderBy: {
          createdAt: "asc",
        },
      },
      fillIn: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [
    chapter.title,
    chapter.quiz.some((quiz) => quiz.id),
    chapter.audio.some((audio) => audio.id) ||
      chapter.video.some((video) => video.id),
  ];
  const totalFields = requiredFields.length;

  // count the truly values in the fields
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  // check if the elements in the required fields are true
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublish && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course."
        />
      )}
      <div>
        <Link
          href={`/teacher/courses/${params.courseId}`}
          className="flex items-center text-md hover:text-slate-800 transition"
        >
          <ArrowBigLeftDash className="h-5 w-5 mr-1" />
          Back to course setup
        </Link>

        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold text-primary">
              Chapter Setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <ChapterPublish
            disabled={!isComplete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublish={chapter.isPublish}
          />
        </div>
        <ChapterTitle
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <ChapterQuiz
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <ChapterAudio
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <ChapterVideo
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <ChapterAttachment
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <ChapterExercise
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
        <ChapterAcess
          initialData={chapter}
          courseId={params.courseId}
          chapterId={params.chapterId}
        />
      </div>
    </>
  );
};

export default ChapterIdPage;
