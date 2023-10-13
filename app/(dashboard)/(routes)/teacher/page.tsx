import { Button } from "@/components/ui/button";
import Link from "next/link";

const TeacherPage = async () => {
  return (
    <>
      <Button>
        <Link href="/teacher/create">New Course</Link>
      </Button>
    </>
  );
};

export default TeacherPage;
