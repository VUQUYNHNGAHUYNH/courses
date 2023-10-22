import SearchInput from "@/components/search-input";
import { db } from "@/lib/db";
import { Course } from "@prisma/client";

type courseProgress = Course & {
  chapters: { id: string }[];
  progress: number | null;
};

const Home = async () => {
  const courses = await db.course.findMany({
    where: {
      isPublish: true,
    },
    include: {
      chapters: {
        where: {
          isPublish: true,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <SearchInput />
    </div>
  );
};

export default Home;
