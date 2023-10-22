import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import CategoryForm from "./_components/category";
import ChaptersForm from "./_components/chapters";
import ImageForm from "./_components/image";
import PriceForm from "./_components/price";
import CoursePublish from "./_components/publish";
import TitleForm from "./_components/title-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId, userId },
    include: {
      chapters: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.category,
    course.imageUrl,
    course.chapters.some((chapter) => chapter.isPublish),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublish && (
        <Banner label="This course is unplushed. It will not be visible to the students" />
      )}
      <div className="flex flex-col items-center justify-center md:ml-12 p-8 gap-y-6">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold text-primary">
              Course Setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <CoursePublish
            disabled={!isCompleted}
            courseId={params.courseId}
            isPublish={course.isPublish}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 space-y-10 lg:space-y-0 lg:space-x-16 w-full">
          <div className="space-y-6">
            <TitleForm initialData={course} courseId={course.id} />
            <CategoryForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
          </div>
          <div className="space-y-6">
            <ChaptersForm initialData={course} courseId={course.id} />
            <PriceForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
